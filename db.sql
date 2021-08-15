CREATE DATABASE ipa_app;

-- todo_id to make sure it's unique. SERIAL increases primary key to ensure uniqueness. // VARCHAR sets the max number of characters
CREATE TABLE utf(
    char VARCHAR(5),
    pin VARCHAR(20)
);

CREATE TABLE ipa(
    syl VARCHAR(20),
    ipa VARCHAR(20)
);

SHOW server_encoding;
SET client_encoding TO 'UTF8';

COPY utf(char,pin)
FROM 'C:\Users\dchat\Desktop\IPA-web-app\server\utf-2col.csv' 
DELIMITER ','
CSV HEADER;

COPY ipa(syl,ipa)
FROM 'C:\Users\dchat\Desktop\IPA-web-app\server\ipa-2col.csv' 
DELIMITER ','
CSV HEADER;

-- Operations on the database:

你
SELECT * FROM utf WHERE char = 你;


SELECT ipa FROM ipa WHERE syl = 'fou';


INSERT INTO todo(description) VALUES ('hello') RETURNING *