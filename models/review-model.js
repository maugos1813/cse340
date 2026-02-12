const pool = require("../database/")

/* ***************************
 * Add New Review
 * ************************** */
async function addReview(inv_id, account_id, review_text, review_rating) {
  try {
    const sql = `
      INSERT INTO reviews 
      (inv_id, account_id, review_text, review_rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `
    const data = await pool.query(sql, [
      inv_id,
      account_id,
      review_text,
      review_rating
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
    return null
  }
}

/* ***************************
 * Get Reviews by Vehicle ID
 * ************************** */
async function getReviewsByVehicle(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_rating, r.review_date,
             a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC;
    `
    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByVehicle error:", error)
    return []
  }
}

module.exports = {
  addReview,
  getReviewsByVehicle
}
