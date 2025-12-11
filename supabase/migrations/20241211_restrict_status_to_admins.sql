-- Add RLS policies to restrict status updates to admins only

-- For pending_builder_tasks
-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own pending tasks" ON pending_builder_tasks;

-- Create new update policy that allows:
-- 1. Admins to update everything
-- 2. Regular users to update their own tasks but NOT the status field
CREATE POLICY "Users can update pending tasks with restrictions"
  ON pending_builder_tasks FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    -- Admins can update everything
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
    -- Regular users can only update if they own it AND status hasn't changed
    (auth.uid() = user_id AND status = (SELECT status FROM pending_builder_tasks WHERE id = pending_builder_tasks.id))
  );

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
