-- USER:------------------------------------------------------
CREATE TABLE KPI.users  (
    id int(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userName varchar(255),
    fullname varchar(255),
    email varchar(255),
    password varchar(255),
    confirm_password varchar(255),
    encrypted_password varchar(255),
    activationToken varchar(255);
    otpToken varchar(255)
    gender varchar(255),
    location varchar(255),
    mobile varchar(255),
    role_id int,
    emailConfirmation boolean not null default 0,
    created_at datetime,
    updated_at datetime
);

ALTER TABLE KPI.users ADD providerName varchar(255);
ALTER TABLE KPI.users ADD providerToken varchar(255);
ALTER TABLE KPI.users ADD providerId varchar(255);
ALTER TABLE KPI.users ADD otpToken varchar(255);

ALTER TABLE KPI.users ADD nickName varchar(255);
ALTER TABLE KPI.users ADD web varchar(255);
ALTER TABLE KPI.users ADD profileImage varchar(255);
ALTER TABLE KPI.users ADD coverImage varchar(255);
ALTER TABLE KPI.users ADD activationToken varchar(255);
 

-- ROLE:-------------------------------------------------------------
CREATE TABLE KPI.roles  (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255)
);

INSERT INTO KPI.roles (id, name) VALUES(1,'SuperAdmin');

INSERT INTO KPI.roles (id, name) VALUES(2,'User');


