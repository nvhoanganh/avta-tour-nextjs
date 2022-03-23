-- insert
INSERT INTO public.matchresult (
	ladderid, winner1id, winner2id, winnergamewon, loser1id, loser2id, losergamewon, isbagel)
	VALUES ('def', 'a', 'b', 2, 'c' , 'd', 6, false);

-- select
select ladderid, count(ladderid) from public.matchresult group by ladderid
