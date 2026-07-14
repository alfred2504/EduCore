ALTER TABLE "Class"
ADD COLUMN IF NOT EXISTS "teacherId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Class_teacherId_fkey'
  ) THEN
    ALTER TABLE "Class"
    ADD CONSTRAINT "Class_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
