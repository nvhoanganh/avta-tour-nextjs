CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.MatchResult
(
id uuid PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
ladderId CHAR(2000) not null,
winner1Id CHAR(2000) not null,
winner2Id CHAR(2000) not null,
winnerGameWon INT not null,
loser1Id CHAR(2000) not null,
loser2Id CHAR(2000) not null,
loserGameWon INT not null,
isBagel bool not null
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.MatchResult
    OWNER to avtaadmin;
	