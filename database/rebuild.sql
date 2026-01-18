-- =========================================
-- DATABASE REBUILD SCRIPT
-- =========================================

DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type;

-- =========================================
-- ENUM TYPE
-- =========================================
CREATE TYPE account_type AS ENUM (
  'Client',
  'Employee',
  'Admin'
);

-- =========================================
-- ACCOUNT TABLE
-- =========================================
CREATE TABLE account (
  account_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_firstname VARCHAR NOT NULL,
  account_lastname VARCHAR NOT NULL,
  account_email VARCHAR NOT NULL,
  account_password VARCHAR NOT NULL,
  account_type account_type NOT NULL DEFAULT 'Client'
);

-- =========================================
-- CLASSIFICATION TABLE
-- =========================================
CREATE TABLE classification (
  classification_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- =========================================
-- INVENTORY TABLE
-- =========================================
CREATE TABLE inventory (
  inv_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  inv_make VARCHAR NOT NULL,
  inv_model VARCHAR NOT NULL,
  inv_year CHAR(4) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR NOT NULL,
  inv_thumbnail VARCHAR NOT NULL,
  inv_price NUMERIC(9,0) NOT NULL,
  inv_miles INTEGER NOT NULL,
  inv_color VARCHAR NOT NULL,
  classification_id INTEGER NOT NULL,
  CONSTRAINT fk_classification
    FOREIGN KEY (classification_id)
    REFERENCES classification(classification_id)
    ON DELETE CASCADE
);

-- =========================================
-- CLASSIFICATION DATA
-- =========================================
INSERT INTO classification (classification_name)
VALUES
  ('Custom'),
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');

-- =========================================
-- INVENTORY DATA
-- =========================================
INSERT INTO inventory (
  inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price,
  inv_miles, inv_color, classification_id
)
VALUES
('Chevy','Camaro','2018','If you want to look cool this is the car you need!','/images/vehicles/camaro.jpg','/images/vehicles/camaro-tn.jpg',25000,101222,'Silver',2),
('Batmobile','Custom','2007','Ever want to be a super hero?','/images/vehicles/batmobile.jpg','/images/vehicles/batmobile-tn.jpg',65000,29887,'Black',1),
('FBI','Surveillance Van','2016','Perfect for surveillance work.','/images/vehicles/survan.jpg','/images/vehicles/survan-tn.jpg',20000,19851,'Brown',1),
('Dog','Car','1997','The original Dog Car.','/images/vehicles/dog-car.jpg','/images/vehicles/dog-car-tn.jpg',35000,71632,'White',1),
('Jeep','Wrangler','2019','Great for offroading.','/images/vehicles/wrangler.jpg','/images/vehicles/wrangler-tn.jpg',28045,41205,'Yellow',3),
('Lamborghini','Adventador','2016','High performance sports car.','/images/vehicles/adventador.jpg','/images/vehicles/adventador-tn.jpg',417650,71003,'Blue',2),
('Aerocar International','Aerocar','1963','Car that converts into a plane.','/images/vehicles/aerocar.jpg','/images/vehicles/aerocar-tn.jpg',700000,18956,'Red',1),
('Monster','Truck','1995','Built for fun.','/images/vehicles/monster-truck.jpg','/images/vehicles/monster-truck-tn.jpg',150000,3998,'Purple',1),
('Cadillac','Escalade','2019','Luxury SUV.','/images/vehicles/escalade.jpg','/images/vehicles/escalade-tn.jpg',75195,41958,'Black',4),
('GM','Hummer','2016','Built for offroad.','/images/vehicles/hummer.jpg','/images/vehicles/hummer-tn.jpg',58800,56564,'Yellow',4),
('Mechanic','Special','1964','Needs some TLC.','/images/vehicles/mechanic.jpg','/images/vehicles/mechanic-tn.jpg',100,200125,'Rust',5),
('Ford','Model T','1921','First production car.','/images/vehicles/model-t.jpg','/images/vehicles/model-t-tn.jpg',30000,26357,'Black',5),
('Mystery','Machine','1999','Scooby Doo classic.','/images/vehicles/mystery-van.jpg','/images/vehicles/mystery-van-tn.jpg',10000,128564,'Green',1),
('Spartan','Fire Truck','2012','Emergency response vehicle.','/images/vehicles/fire-truck.jpg','/images/vehicles/fire-truck-tn.jpg',50000,38522,'Red',4),
('Ford','Crown Victoria','2013','Former police car.','/images/vehicles/crwn-vic.jpg','/images/vehicles/crwn-vic-tn.jpg',10000,108247,'White',5);


-- =========================================
-- TASK 1 QUERY 4: Update GM Hummer description
-- =========================================
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'Built for offroad.', 'a huge interior with an engine to get you out of any muddy or rocky situation.')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- =========================================
-- TASK 1 QUERY 6: Update inv_image and inv_thumbnail paths
-- =========================================
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
