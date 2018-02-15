import * as bodyParser from 'body-parser'
import * as connectRedis from 'connect-redis'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as expressSession from 'express-session'
import * as https from 'https'
import * as memoryCache from 'memory-cache'

const mustacheExpress = require('mustache-express')
// require('pug')

import keyifyRequest from './helpers/keyifyRequest'
import answerError from './libs/helpers/answerError'
import fileExists from './libs/helpers/fileExists'
import log from './libs/helpers/log'
import logo from './libs/media/logo'
import cache from './middlewares/cache'

import { Express, NextFunction, Request, Response } from 'express'
import { LexpressOptions, Route } from './types'

const lexpressOptionsDefault: LexpressOptions = {
  headers: {},
  https: false,
  middlewares: [],
  routes: [],
  viewsEngine: 'mustache',
  viewsPath: 'src',
}
const rootPath = process.cwd()

// Check and load the local .env file (development mode)
if (fileExists(`${rootPath}/.env`)) dotenv.config({ path: `${rootPath}/.env` })

export default class Lexpress {
  private app: Express
  private headers: LexpressOptions['headers']
  private https: LexpressOptions['https']
  private middlewares: LexpressOptions['middlewares']
  private port: number
  private routes: LexpressOptions['routes']
  private viewsEngine: LexpressOptions['viewsEngine']
  private viewsPath: LexpressOptions['viewsPath']

  constructor(options: LexpressOptions) {
    options = Object.assign({}, lexpressOptionsDefault, options)

    this.headers = options.headers
    this.https = options.https
    this.middlewares = options.middlewares
    this.routes = options.routes
    this.viewsEngine = options.viewsEngine
    this.viewsPath = options.viewsPath
    this.init()
  }

  private init() {
    this.port = Number(process.env.PORT) || 3000

    // Initialize the Express app
    this.app = express()

    // Attaches the middlewares
    this.setMiddlewares()
    this.setCustomMiddlewares()

    // Attaches the routes
    this.setRoutes()

    // Define the template renderer
    switch (this.viewsEngine) {
      // case 'pug':
        // this.app.engine('pug', pug)
        // this.app.set('view engine', 'pug')

      default:
        this.app.engine('mst', mustacheExpress())
        this.app.set('view engine', 'mst')
    }

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

  private answer(req: Request, res: Response, routeIndex: number, routeSettings: Route['settings'] = {}) {
    const { controller: Controller, method } = this.routes[routeIndex]

    if (routeSettings.isCached !== false) {
      // Check if a cached content exists for this query,
      const cachedContent = this.cache(req, res)
      // and send it if there is one.
      if (cachedContent !== undefined) {
        return cachedContent.isJson ? res.json(cachedContent.body) : res.send(cachedContent.body)
      }
    }

    let key: keyof LexpressOptions['headers']
    for (key in this.headers)
      res.header(key, this.headers[key])

    console.log(`${method.toUpperCase()} on ${req.path} > ${Controller.name}.${method}()`)

    try {
      const controller = new Controller(req, res)

      return controller[method]()
    }
    catch (err) {
      return answerError({
        err,
        isJson: true,
        res,
        scope: `${Controller.name}.${method}()`,
      })
    }
  }

  private cache(req: express.Request, res: Response): any | void {
    // We generate the cache key
    const key: string = keyifyRequest(req)

    // We try to get the cache, in case it exists
    const cacheContent: any = memoryCache.get(key)

    // If the cache exists, we return its content
    if (cacheContent !== null) return cacheContent
  }

  private setCustomMiddlewares(): void {
    this.middlewares.forEach(middleware =>
      this.app.use(middleware)
    )
  }

  private setMiddlewares(): void {
    if (typeof process.env.SESSION_SECRET !== 'string' || process.env.SESSION_SECRET.length < 32) {
      log.err(`Lexpress#setMiddlewares(): Your %s must contain at least 32 characters.`, 'process.env.SESSION_SECRET')
    }

    if (typeof process.env.REDIS_URL !== 'string' || process.env.REDIS_URL.length === 0) {
      log.err(`Lexpress#init(): You must set your %s.`, 'process.env.REDIS_URL')
    }

    const RedisStore = connectRedis(expressSession)

    // Parse application/json request body
    this.app.use(bodyParser.json())
    // Parse application/x-www-form-urlencoded request body
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(expressSession({
      cookie: {
        secure: true
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new RedisStore({ url: process.env.REDIS_URL })
    }))
    this.app.use(cache)
  }

  private setRoutes(): void {
    this.routes.forEach((route, routeIndex) =>
    route.call !== undefined
      ? this.app[route.method](route.path, route.call)
      : this.app[route.method](route.path, (req, res) => this.answer(req, res, routeIndex, route.settings))
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
