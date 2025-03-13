import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useEffect } from "react";

export const useCheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then((response) => {
      if (response.data.user === null) {
        navigate("/login");
      }
    });
  }, [navigate]);
};
