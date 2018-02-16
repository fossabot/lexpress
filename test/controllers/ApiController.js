const BaseController = require('../..').BaseController

module.exports = class ApiUserController extends BaseController {
  get() {
    const schema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['name'],
    }

    return this.validateJsonSchema(schema, () => {
      return this.res
        .status(200)
        .json({
          message: 'Hello World !',
          name: this.req.query.name,
        })
    })
  }
}
