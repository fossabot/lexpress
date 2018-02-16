const Lexpress = require('..').Lexpress
const routes = require('./routes')

const lexpress = new Lexpress({
  routes,
  staticPath: 'public',
  viewsEngine: 'pug',
  viewsPath: 'test/views',
})

lexpress.start()
