-- CREATE DATABASE IF NOT EXISTS wishpurr
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;

-- USE wishpurr;
USE railway;

CREATE TABLE users (
  user_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(191) NOT NULL,
  password    VARCHAR(191) NOT NULL,
  role        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  product_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id  INT UNSIGNED NOT NULL,
  name         VARCHAR(191) NOT NULL,
  description  TEXT NULL,
  price        DECIMAL(10,2) NOT NULL,
  stock        INT NOT NULL DEFAULT 0,
  image_cover  TEXT NULL,
  weight       INT UNSIGNED NULL,

  KEY idx_products_category_id (category_id),
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES categories (category_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_images (
  image_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id  INT UNSIGNED NOT NULL,
  image       TEXT NOT NULL,

  KEY idx_product_images_product_id (product_id),
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
  order_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  total       DECIMAL(10,2) NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_orders_user_id (user_id),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
  order_item_id  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       INT UNSIGNED NOT NULL,
  product_id     INT UNSIGNED NOT NULL,
  qty            INT NOT NULL,
  unit_price     DECIMAL(10,2) NOT NULL,

  KEY idx_order_items_order_id (order_id),
  KEY idx_order_items_product_id (product_id),

  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id)
    REFERENCES orders (order_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
  review_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  product_id  INT UNSIGNED NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL, 
  comment     TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- 1 user รีวิวสินค้า 1 ชิ้นได้ครั้งเดียว
  UNIQUE KEY uq_reviews_user_product (user_id, product_id),

  KEY idx_reviews_product_id (product_id),
  KEY idx_reviews_user_id (user_id),

  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id)
    REFERENCES products (product_id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


select * from users;
select * from categories;
select * from products;
select * from product_images;
select * from orders;
select * from order_items;
select * from reviews;

select * from users
where user_name = "admin";


UPDATE users SET role = 'admin' WHERE user_id = 1;



INSERT INTO categories (name, description)
VALUES
('ลูกแมว', 'อาหารสำหรับลูกแมว'),
('แมวโต', 'อาหารสำหรับแมวโต');



INSERT INTO products (category_id, name, description, price, stock, image_cover, weight)
VALUES
(2, 'WishPurr Signature – Turkey & Tuna',
'สูตรพื้นฐาน โปรตีน 35% ไขมัน 16% เหมาะกับแมว 4 เดือนขึ้นไป ทั้งลูกแมวและโตเต็มวัย เสริมภูมิคุ้มกัน ระบบย่อยอาหาร สมอง ข้อต่อ และขนสวยเงางาม',
299, 100, '/img/product.png', 1200),

(2, 'WishPurr Indoor – Wish of Balance',
'โปรตีนสูง 35% จากไก่ แกะ และทูน่า เหมาะสำหรับแมวเลี้ยงในบ้าน/คอนโด ช่วยเรื่องขนผิว ก้อนขน ลำไส้ ข้อต่อ พร้อม L-carnitine ช่วยเผาผลาญเพื่อลดไขมัน',
319, 100, '/img/product.png', 1200),

(2, 'WishPurr Senior – Wish of Bonnie',
'อาหารแมวสูงวัย 7 ปีขึ้นไป โปรตีน 35% จากไก่ ย่อยง่าย เสริม superfood บำรุงข้อ สมอง ภูมิคุ้มกัน เพื่อให้แมวสูงวัยยังแข็งแรง เดินคล่อง ขนสวย และย่อยดี',
349, 100, '/img/product.png', 1200),

(1, 'WishPurr Kitten – Dream of Growth',
'สูตรลูกแมวอายุ 2–12 เดือน โปรตีนสูงจากไก่และทูน่า เสริม DHA พัฒนาสมอง ระบบประสาท โตไว สุขภาพดี ขนสวย ระบบย่อยดี',
289, 100, '/img/product.png', 1200);

INSERT INTO product_images (product_id, image)
VALUES
(1, '/img/product.png'),
(2, '/img/product.png'),
(3, '/img/product.png'),
(4, '/img/product.png');




