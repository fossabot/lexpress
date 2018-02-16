const ApiController = require('./controllers/ApiController')
const HomeController = require('./controllers/HomeController')

console.log(HomeController)
console.log(HomeController.name)

module.exports = [
  {
    path: '/',
    controller: HomeController,
    method: 'get',
  },
  {
    path: '/api',
    controller: ApiController,
    method: 'get',
  },
]
