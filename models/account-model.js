const pool = require("../database") // ajusta la ruta según tu proyecto

/* *****************************
 * Register new account
 **************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result.rows[0] // devuelve la cuenta creada
  } catch (error) {
    console.error("Error in registerAccount:", error)
    return null
  }
}

/* *****************************
 * Get account by email
 **************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error in getAccountByEmail:", error)
    return null
  }
}

/* *****************************
 * Get account by ID
 **************************** */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error in getAccountById:", error)
    return null
  }
}

/* *****************************
 * Update account info (firstname, lastname, email)
 **************************** */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error in updateAccount:", error)
    return null
  }
}

/* *****************************
 * Update account password
 **************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error in updatePassword:", error)
    return null
  }
}

/* **********************
 * Check for existing email
 ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount
  } catch (error) {
    console.error("Error in checkExistingEmail:", error)
    return 0
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  checkExistingEmail,
}
