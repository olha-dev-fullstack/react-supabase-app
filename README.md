# React Supabase Posts App

This is a simple React App for posts publishing with user authentication. It allows users to create account and add posts with description and images. Later posts can be deleted.

## Stack

- React JS
- Supabase database
- Supabase Auth
- Supabase Storage

## 📦 Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/olha-dev-fullstack/react-supabase-app.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. Create supabase project and add `supabase.js` file with project config. Should look like this:

   ```bash
    import { createClient } from "@supabase/supabase-js";

    const supabaseUrl = "YOUR PROJECT URL";
    const supabaseKey = SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    export { supabase };
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
