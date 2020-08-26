--INSERT INTO users (created) VALUES (now());
--INSERT INTO posts (user_id,content,voters,created) VALUES (2,'testing26-1206','',now());

--UPDATE posts SET voters='2,3' WHERE id=1;

--SELECT * FROM "posts" LIMIT 1000;

--SELECT * FROM "users";

SELECT * FROM "posts"
 WHERE created > CURRENT_DATE;
