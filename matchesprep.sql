create database ipl;
use ipl;
SELECT TOP 10 * FROM matches;
-- Remove rows with missing or invalid values
DELETE FROM matches
WHERE id IS NULL OR date IS NULL OR winner IS NULL;

-- Remove duplicates
WITH cte AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) AS rn
  FROM matches
)
DELETE FROM cte WHERE rn > 1;

-- Convert date column (if stored as text)
ALTER TABLE matches ALTER COLUMN date DATE;

-- Trim unwanted spaces
UPDATE Matches
SET city = LTRIM(RTRIM(city)),
    team1 = LTRIM(RTRIM(team1)),
    team2 = LTRIM(RTRIM(team2)),
    winner = LTRIM(RTRIM(winner)),
    venue = LTRIM(RTRIM(venue));
