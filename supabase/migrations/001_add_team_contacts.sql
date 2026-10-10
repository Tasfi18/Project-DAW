-- Migration: Add contact fields to team members
-- Date: 2025-01-17
-- Description: Adds phone, email, and linkedin_url columns to team_members table

-- Add new columns
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS email VARCHAR(100),
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Update existing data
UPDATE team_members 
SET phone = '0123456789',
    email = 'nils.leseberg@hybess.dk',
    linkedin_url = 'https://www.linkedin.com/example'
WHERE name = 'Hasib';
