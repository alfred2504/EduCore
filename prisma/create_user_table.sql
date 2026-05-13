CREATE TABLE IF NOT EXISTS public."User" (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'STUDENT',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
