const pool = require("../database/")

/* ***************************
 * Add vehicle to favorites
 *************************** */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO account_favorites (account_id, inv_id)
    VALUES ($1, $2)
    RETURNING *
  `
  return await pool.query(sql, [account_id, inv_id])
}

/* ***************************
 * Remove vehicle from favorites
 *************************** */
async function removeFavorite(account_id, inv_id) {
  const sql = `
    DELETE FROM account_favorites
    WHERE account_id = $1 AND inv_id = $2
  `
  return await pool.query(sql, [account_id, inv_id])
}

/* ***************************
 * Get all favorites for account
 *************************** */
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT i.*
    FROM account_favorites af
    JOIN inventory i ON af.inv_id = i.inv_id
    WHERE af.account_id = $1
    ORDER BY af.created_at DESC
  `
  return await pool.query(sql, [account_id])
}

/* ***************************
 * Check if vehicle is already favorite
 *************************** */
async function checkFavorite(account_id, inv_id) {
  const sql = `
    SELECT *
    FROM account_favorites
    WHERE account_id = $1 AND inv_id = $2
  `
  return await pool.query(sql, [account_id, inv_id])
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccount,
  checkFavorite,
}
