-- Add promo column to units table

-- Check if promo column exists in units table
SELECT COUNT(*) FROM pragma_table_info('units') WHERE name = 'promo';

-- Add the promo column if it doesn't exist
ALTER TABLE units ADD COLUMN promo TEXT;
