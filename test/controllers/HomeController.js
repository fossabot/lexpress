const BaseController = require('../..').BaseController

module.exports = class HomeController extends BaseController {
  get() {
    this.res
      .status(200)
      .render('home')
  }
}
