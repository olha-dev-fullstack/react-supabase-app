import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { supabase } from "./supabase";
import { useCheckAuth } from "./checkAuth";

export const Posts = () => {
  useCheckAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.error) {
        setError(response.error.message);
        return;
      }
      setUserId(response.data.user.id);
    });
  }, []);

  const logout = async () => {
    const response = await supabase.auth.signOut();

    if (response.error) {
      setError(response.error.message);
      return;
    }
    navigate("/login");
  };

  const getPosts = async () => {
    const response = await supabase
      .from("posts")
      .select("*, user_data(email)")
      .order("created_at", { ascending: false });

    if (response.error) {
      setError(response.error.message);
      return;
    }

    setPosts(response.data);
  };

  const handleDelete = async (post) => {
    await supabase.from("posts").delete().match({ id: post.id });
    await supabase.storage.from("images").remove([`${post.user_id}/${post.image_id}`])
  };

  useEffect(() => {
    getPosts();
  }, []);

  supabase
    .channel("posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      getPosts
    )
    .subscribe();

  return (
    <div>
      <div className={"mt-4 flex flex-row justify-end mr-8"}>
        <button onClick={logout} className={"text-indigo-600"}>
          Logout
        </button>
      </div>
      <div className="mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div>
            <div className="md:flex md:items-center md:justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                  Posts
                </h2>
              </div>
              <div className="mt-4 flex md:ml-4 md:mt-0">
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <Link to={"/new-post"}>New Post</Link>
                </button>
              </div>
            </div>

            <ErrorMessage error={error} />

            <ul role="list" className="divide-y divide-gray-200">
              {posts.map((post) => {
                const imageUrl = supabase.storage
                  .from("images")
                  .getPublicUrl(`${post.user_id}/${post.image_id}`)
                  .data.publicUrl;
                return (
                  <li key={post.id} className="py-4">
                    <h4 className={"mb-4"}>
                      {post.user_data.email}
                      <span className={"text-gray-500"}>
                        {" "}
                        - {new Date(post.created_at).toLocaleString()}
                      </span>
                    </h4>
                    <p className={"mb-2"}>{post.content}</p>
                    {post.image_id ? (
                      <img src={imageUrl} className={"w-full"} />
                    ) : null}
                    {userId === post.user_id ? (
                      <button
                        onClick={() => handleDelete(post)}
                        className={"text-red-500"}
                      >
                        Delete
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
