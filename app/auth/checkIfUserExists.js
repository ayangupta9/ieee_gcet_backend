const mysql = require('mysql')

checkDuplicateUser = async (req, res, next) => {
  try {
    key = req.body.email
    let checkQuery = 'SELECT 1 FROM ?? WHERE ?? = ?;'
    let query = mysql.format(checkQuery, ['users', 'email', key])
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to validate username!'
    })
  }
}
