# 📚 LMS Portal

A modern Learning Management System (LMS) built with **Next.js**, **Supabase**, and **Tailwind CSS**. It's designed to efficiently manage courses, modules, videos, and student enrollments.

---

## 🚀 Features

*   **User Profiles** With role-based access control for admins and students.
*   **Course & Module Management** For structured content.
*   **Video Integration** Powered by Bunny.net for seamless video hosting.
*   **Enrollment Tracking** To monitor student participation.
*   **Automatic Cleanup** Using SQL triggers to maintain data integrity.

---

## 🛠 Tech Stack

*   **Frontend**: Next.js 15, React 19, Tailwind CSS 4
*   **Backend**: Supabase (for Database, Authentication, and Storage)
*   **Video Hosting**: Bunny.net
*   **State Management**: TanStack Query
*   **UI Components**: Radix UI, Lucide Icons

---

## 📂 Database Schema

This is the SQL schema for setting up the database in Supabase.

### Profiles

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  role text CHECK (role IN ('admin', 'student')) DEFAULT 'student',
  created_at timestamp DEFAULT now()
);
```
### Courses

```sql
CREATE TABLE courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamp DEFAULT now()
);
```
### Modules

```sql
CREATE TABLE modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  position int DEFAULT 0,
  created_at timestamp DEFAULT now()
);
```
### Videos

```sql
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  bunny_video_id text NOT NULL,
  created_at timestamp DEFAULT now()
);
```
### Enrollments

```sql
CREATE TABLE enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  UNIQUE (user_id, course_id)
);
```
### 🔄 Triggers

Run the following SQL code after creating the schema. This trigger ensures that when a user profile is deleted from the profiles table, the corresponding user entry in `auth.users` is also removed, maintaining data consistency.

```sql
create function public.handle_user_delete()
returns trigger as $$
begin
  delete from auth.users where id = old.id;
  return old;
end;
$$ language plpgsql security definer;

create trigger on_profile_delete
  after delete on public.profiles
  for each row execute function public.handle_user_delete();
```

<!-- ##################################################################################################### -->

### ⚙️ Environment Variables

Create a `.env` file in the project root and add the following variables.

```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

⚠️ Important: The `SUPABASE_SERVICE_ROLE_KEY` must only be used in server-side code to prevent security vulnerabilities.

### 📦 Installation & Setup

Clone the repository:

```bash
git clone git@github.com:TT-talhatariq/LMS-Portal.git
cd lms-portal
```

Install dependencies:

```bash
npm install
```

Setup Supabase:

Create a new project in your Supabase dashboard.

Navigate to the SQL Editor and run the Database Schema and Triggers scripts provided above.

Add your Supabase environment variables to the `.env` file.

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to see the application.

### 📜 Scripts

| Command       | Description                      |
|---------------|----------------------------------|
| `npm run dev`   | Starts the development server    |
| `npm run build` | Builds the production bundle     |
| `npm run start` | Starts the production server     |
| `npm run lint`  | Lints the codebase             |
| `npm run format`| Formats code with Prettier       |


### 📖 Usage Flow

An Admin creates new courses and modules.

The Admin uploads videos, linking them to Bunny.net for hosting.

Students can then enroll in the available courses.

Course content is displayed to students based on their enrollment.

Database triggers automatically clean up user records when profiles are deleted.

### 🔐 Roles

**Admin**: Has full control to create, update, and delete courses, modules, and user profiles.

**Student**: Can view courses, enroll, and access content.

### 📝 License

This project is licensed under the MIT License.
