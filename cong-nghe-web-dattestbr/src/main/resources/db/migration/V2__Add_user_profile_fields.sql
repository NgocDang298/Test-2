-- Add profile fields to users table
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN birthday DATE,
ADD COLUMN address TEXT; 