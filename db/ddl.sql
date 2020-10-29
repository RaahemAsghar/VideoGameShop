CREATE TABLE category
(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(20),
    PRIMARY KEY (id)
);

CREATE TABLE transaction_history
(
    id int NOT NULL AUTO_INCREMENT,
    game_id int(5),
    user_id varchar(20),
    price int(5),
    date_of_purchase DATE,
    Type_of_transaction varchar(10),
    PRIMARY KEY (id),
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (user_id) REFERENCES user(id)


);

CREATE TABLE rent
(
    game_id int NOT NULL AUTO_INCREMENT,
    user_id varchar NOT NULL AUTO_INCREMENT,
    date_lent DATE,
    date_due DATE,
    PRIMARY KEY (game_id),
    PRIMARY KEY (user_id),
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE user_purchase_history
(
    user_id varchar NOT NULL AUTO_INCREMENT,
    transaction_id int NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (user_id),
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (transaction_id) REFERENCES transaction_history(id)
);

CREATE TABLE returned_games
(
    game_id int(5),
    reason_for_return varchar(20),
    credit_returned int(5),
    transaction_id int NOT NULL AUTO_INCREMENT,
    user_id varchar(20),
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (game_id) REFERENCES game(game_id),
    FOREIGN KEY (transaction_id) REFERENCES transaction_history(id),
    FOREIGN KEY (user_id) REFERENCES user(id)

);

