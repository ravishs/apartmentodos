-- Add status column to pending_builder_tasks and wishlist_items tables

-- Add status to pending_builder_tasks
ALTER TABLE pending_builder_tasks 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'invalid'));

-- Add status to wishlist_items
ALTER TABLE wishlist_items 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'invalid'));

-- Update existing rows to have 'pending' status if NULL
UPDATE pending_builder_tasks SET status = 'pending' WHERE status IS NULL;
UPDATE wishlist_items SET status = 'pending' WHERE status IS NULL;
