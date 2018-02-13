import * as dotenv from 'dotenv'
import * as express from 'express'
import * as https from 'https'
const mustacheExpress = require('mustache-express')

import answerError from './libs/helpers/answerError'
import cache from './middlewares/cache'
import fileExists from './libs/helpers/fileExists'
import log from './libs/helpers/log'
import logo from './libs/media/logo'

import { Express, NextFunction, Request, Response } from 'express'
import { LexpressOptions } from './types'

const lexpressOptionsDefault: LexpressOptions = {
  headers: {},
  https: false,
  middlewares: [],
  routes: [],
  viewsPath: 'src',
}
const rootPath = process.cwd()

export default class Lexpress {
  private app: Express
  private headers: LexpressOptions['headers']
  private https: LexpressOptions['https']
  private middlewares: LexpressOptions['middlewares']
  private port: number
  private routes: LexpressOptions['routes']
  private viewsPath: LexpressOptions['viewsPath']

  constructor(options: LexpressOptions) {
    options = Object.assign({}, lexpressOptionsDefault, options)

    this.headers = options.headers
    this.https = options.https
    this.middlewares = options.middlewares
    this.routes = options.routes
    this.viewsPath = options.viewsPath
    this.init()
  }

  private init() {
    // Check and load the local .env file (development mode)
    if (fileExists(`${rootPath}/.env`)) dotenv.config({ path: `${rootPath}/.env` })

    this.port = Number(process.env.PORT) || 3000

    // Initialize the Express app
    this.app = express()

    // Attaches the middlewares
    this.setMiddlewares()
    this.setCustomMiddlewares()

    // Attaches the routes
    this.setRoutes()

    // Define mustache as the template renderer
    this.app.engine('mst', mustacheExpress())
    this.app.set('view engine', 'mst')
    this.app.set('views', `${rootPath}/${this.viewsPath}/views`)

    // Set the response headers
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      let key: keyof LexpressOptions['headers']
      for (key in this.headers)
        res.header(key, this.headers[key])

      next()
    })

    // Define 'public' directory as the static files directory
    this.app.use(express.static(`${rootPath}/public`))
  }

  private answer(req: Request, res: Response, routeIndex: number) {
    const { controller: Controller, method } = this.routes[routeIndex]

    let key: keyof LexpressOptions['headers']
    for (key in this.headers)
      res.header(key, this.headers[key])

    console.log(`${method.toUpperCase()} on ${req.path} > ${Controller.name}.${method}()`)

    try {
      const controller = new Controller(req, res)
      return controller[method]()
    }
    catch (err) {
      return answerError({ res, scope: `${Controller.name}.${method}()`, err })
    }
  }

  private setMiddlewares(): void {
    this.app.use(cache)
  }

  private setCustomMiddlewares(): void {
    this.middlewares.forEach(middleware =>
      this.app.use(middleware)
    )
  }

  private setRoutes(): void {
    this.routes.forEach((route, routeIndex) =>
      this.app[route.method](route.path, (req, res) => this.answer(req, res, routeIndex))
    )
  }

  public start(): void {
    console.log(logo)

    return this.https === false ? this.startHttp() : this.startHttps()
  }

  public startHttp(): void {
    const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'

    log.warn(`Lexpress Server will start in a ${nodeEnv} mode (non-secure).`)
    this.app.listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))
  }

  public startHttps(): void {
    const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development'

    log.warn(`Lexpress Server will start in a ${nodeEnv} mode (secure).`)

    https
      .createServer(this.https as https.ServerOptions, this.app)
      .listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))
  }
}
