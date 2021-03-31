const Ajv = require('ajv')
const ajv = new Ajv()
const credentialSchema = {
  "properties": {
    "email": {
      "type": "string"
      , "format": "email"
    }
    , "password": {
      "type": "string"
    }
  }
  , "required": ["email", "password"]
}

const TokenService = require('./token-service')
const HashService = require('./hash-service')
const UserService = require('./user-service')

module.exports = class LoginService {
  constructor() {
    this.userService = new UserService()
  }

  static validate(login) {
    const validate = ajv.compile(credentialSchema)
    let valid = validate(login)
    if (!valid)
      throw Error(
        `The format of provided credentials is invalid: ${validate.errors[0].message}`
      )
    return true
  }

  async login(credentials) {
    let user = await this.userService.getByEmail(credentials.email)
    let result = await HashService.checkHash(credentials.password, user.password)
    if (result) {
      return TokenService.newToken({
        user: {
          name: user.name
          , email: user.email
          , id: user.id
          , role: user.role
        }
        , organizationId: user.organizationId
      })
    } else {
      throw new Error(`Invalid credentials`)
    }

  }
}
