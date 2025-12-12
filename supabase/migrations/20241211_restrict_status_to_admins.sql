-- Add RLS policies to restrict status updates to admins only

-- For pending_builder_tasks
-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own pending tasks" ON pending_builder_tasks;

-- Create new update policy that allows:
-- 1. Admins to update everything
-- 2. Regular users to update any task but NOT the status field
CREATE POLICY "Users can update pending tasks with restrictions"
  ON pending_builder_tasks FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (
    -- Admins can update everything
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    -- Regular users can update but status must remain the same
    status = (SELECT status FROM pending_builder_tasks WHERE id = pending_builder_tasks.id)
  );

-- Drop existing delete policy
DROP POLICY IF EXISTS "Users can delete their own pending tasks" ON pending_builder_tasks;

-- Create new delete policy that allows authenticated users to delete any task
CREATE POLICY "Authenticated users can delete pending tasks"
  ON pending_builder_tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- For wishlist_items
-- Drop existing update policy
DROP POLICY IF EXISTS "Authenticated users can update wishlist items" ON wishlist_items;

-- Create new update policy that restricts status changes to admins
CREATE POLICY "Users can update wishlist with restrictions"
  ON wishlist_items FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (
    -- Admins can update everything
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    -- Regular users can update but status must remain the same
    status = (SELECT status FROM wishlist_items WHERE id = wishlist_items.id)
  );
