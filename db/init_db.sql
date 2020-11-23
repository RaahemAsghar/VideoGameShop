CREATE TABLE IF NOT EXISTS user(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50),
    password TEXT,
    address TEXT,
    phone_number VARCHAR(15),
    credits INT DEFAULT 0,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS admin(
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    email VARCHAR(50),
    password TEXT,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS category (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(20),
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS manufacturer(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS game(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    description TEXT,
    tags text,
    sale_price VARCHAR(10),
    rent_price VARCHAR(10),
    platform VARCHAR(50),
    image_url TEXT,
    stock INT,
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS game_category(
    game_id INT,
    category_id INT,
    PRIMARY KEY(game_id, category_id),
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS console(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    description TEXT,
    tags text,
    sale_price VARCHAR(10),
    manufacturer_id INT,
    image_url TEXT,
    stock INT,
    PRIMARY KEY(id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS transaction_history (
    id int NOT NULL AUTO_INCREMENT,
    game_id int,
    user_id int,
    price VARCHAR(10),
    date_of_purchase DATE,
    Type_of_transaction varchar(10),
    PRIMARY KEY (id),
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS rent (
    user_id int NOT NULL,
    game_id int NOT NULL,
    date_lent DATE,
    date_due DATE,
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS user_purchase_history (
    user_id int,
    transaction_id int,
    PRIMARY KEY (user_id, transaction_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transaction_history(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS returned_games (
    game_id int,
    reason_for_return varchar(20),
    credit_returned int,
    transaction_id int NOT NULL AUTO_INCREMENT,
    user_id int,
    PRIMARY KEY (transaction_id),
    FOREIGN KEY (game_id) REFERENCES game(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES transaction_history(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);