-- DIMENSION: Match
SELECT DISTINCT
  id AS MatchID,
  season,
  city,
  date,
  team1,
  team2,
  toss_winner,
  toss_decision,
  result,
  winner,
  venue
INTO DimMatch
FROM matches;

-- DIMENSION: Batsman
SELECT DISTINCT
  batter AS BatsmanName
INTO DimBatsman
FROM deliveries;

-- DIMENSION: Bowler
SELECT DISTINCT
  bowler AS BowlerName
INTO DimBowler
FROM deliveries;

-- DIMENSION: Venue
SELECT DISTINCT
  venue AS VenueName,
  city
INTO DimVenue
FROM matches;

-- FACT TABLE
SELECT
  d.match_id AS MatchID,
  d.inning,
  d.batting_team,
  d.bowling_team,
  d.[over],
  d.ball,
  d.batter,
  d.bowler,
  d.batsman_runs,
  d.extra_runs,
  d.total_runs,
  d.dismissal_kind,
  d.player_dismissed
INTO FactDeliveries
FROM deliveries AS d;

SELECT TOP(1) * FROM DimMatch;
SELECT TOP(1) * FROM DimBatsman;
SELECT TOP(1) * FROM DimBowler;
SELECT TOP(1) * FROM DimVenue;
SELECT TOP(1) * FROM FactDeliveries;

SELECT MatchID, COUNT(*) cnt FROM DimMatch GROUP BY MatchID HAVING COUNT(*)>1;


-- if MatchID already unique
ALTER TABLE DimMatch
ADD CONSTRAINT PK_DimMatch PRIMARY KEY CLUSTERED (MatchID);

ALTER TABLE DimBatsman
ADD CONSTRAINT PK_DimBatsman PRIMARY KEY CLUSTERED (BatsmanName);

ALTER TABLE DimBowler
ADD CONSTRAINT PK_DimBowler PRIMARY KEY CLUSTERED (BowlerName);

ALTER TABLE DimVenue
ADD CONSTRAINT PK_DimVenue PRIMARY KEY CLUSTERED (VenueName);

ALTER TABLE DimVenue
ADD VenueID INT IDENTITY(1,1) PRIMARY KEY;

ALTER TABLE FactDeliveries
ADD CONSTRAINT FK_Fact_Match FOREIGN KEY (MatchID) REFERENCES DimMatch(MatchID);
