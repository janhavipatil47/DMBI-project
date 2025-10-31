use ipl;
select top 10 * from deliveries;
--  Remove rows with missing match_id or batsman (invalid)
DELETE FROM deliveries
WHERE match_id IS NULL OR batter IS NULL OR bowler IS NULL;

--  Convert numeric columns to correct types (if text)
ALTER TABLE deliveries ALTER COLUMN [over] INT;
ALTER TABLE deliveries ALTER COLUMN ball INT;
ALTER TABLE deliveries ALTER COLUMN total_runs INT;
ALTER TABLE deliveries ALTER COLUMN batsman_runs INT;

-- Trim all string columns
UPDATE deliveries
SET batting_team = LTRIM(RTRIM(batting_team)),
    bowling_team = LTRIM(RTRIM(bowling_team)),
    batter = LTRIM(RTRIM(batter)),
    bowler = LTRIM(RTRIM(bowler)),
    dismissal_kind = LTRIM(RTRIM(dismissal_kind)),
    player_dismissed = LTRIM(RTRIM(player_dismissed));
