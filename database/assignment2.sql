/*************************************************
 * Assignment 2 – CSE 340
 * Task One – SQL Statements
 * Student: Mauro Agostinelli
 *************************************************/


/* ------------------------------------------------
 * 1. Insert Tony Stark into account table
 * ------------------------------------------------ */
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
) VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);


/* ------------------------------------------------
 * 2. Update Tony Stark's account_type to Admin
 * ------------------------------------------------ */
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


/* ------------------------------------------------
 * 3. Delete Tony Stark from account table
 * ------------------------------------------------ */
DELETE FROM account
WHERE account_email = 'tony@starkent.com';


/* ------------------------------------------------
 * 4. Update GM Hummer description
 * Replace "small interiors" with "a huge interior"
 * ------------------------------------------------ */
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
  AND inv_model = 'Hummer';


/* ------------------------------------------------
 * 5. Select make, model, and classification for "Sport" vehicles
 * ------------------------------------------------ */
SELECT i.inv_make,
       i.inv_model,
       c.classification_name
FROM inventory i
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


/* ------------------------------------------------
 * 6. Update inv_image and inv_thumbnail paths
 * Add "/vehicles" to the middle of the file path
 * ------------------------------------------------ */
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
