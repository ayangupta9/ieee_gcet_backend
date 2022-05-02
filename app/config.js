const ADMIN_SECRET_KEY = 'admin@admin.com'
const ACCESS_TOKEN_SECRET = 'accesstokensecret'
// const REFRESH_TOKEN_SECRET = 'refreshtokensecret'
const SERVER_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 500,
  errorMessage: 'Internal server error Occured'
}

const UNAUTHORIZED_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 403,
  errorMessage: 'Unauthorized access'
}

const NOTFOUND_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 404,
  errorMessage: 'Not found'
}

const INVALID_CRED_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 401,
  errorMessage: 'Invalid email/password'
}

const NO_PAPERS_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 404,
  errorMessage: 'No papers here'
}

const PAPERS_INACCESS_ERROR_REJECT_OBJECT = {
  bool: false,
  status: 401,
  errorMessage: 'Cannot access papers at the moment'
}

const serverconfig = {
  ADMIN_SECRET_KEY: ADMIN_SECRET_KEY,
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  SERVER_ERROR_REJECT_OBJECT,
  UNAUTHORIZED_ERROR_REJECT_OBJECT,
  NOTFOUND_ERROR_REJECT_OBJECT,
  INVALID_CRED_ERROR_REJECT_OBJECT,
  NO_PAPERS_ERROR_REJECT_OBJECT,
  PAPERS_INACCESS_ERROR_REJECT_OBJECT
  //   REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET
}

module.exports = serverconfig
