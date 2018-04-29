import log from '@inspired-beings/log'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as expressSession from 'express-session'
import * as helmet from 'helmet'
import * as https from 'https'
import * as memoryCache from 'memory-cache'

// tslint:disable-next-line:no-require-imports no-var-requires typedef
const mustacheExpress = require('mustache-express')
// tslint:disable-next-line:no-require-imports no-var-requires typedef
const pug = require('pug')

import BaseController from './BaseController'
import keyifyRequest from './helpers/keyifyRequest'
import answerError from './libs/helpers/answerError'
import fileExists from './libs/helpers/fileExists'
import logo from './libs/media/logo'
import cache from './middlewares/cache'

import { CacheContent, LexpressOptions, NextFunction, Request, Response, Route } from '.'

const LEXPRESS_OPTIONS_DEFAULT: LexpressOptions = {
  headers: {},
  helmet: {},
  https: false,
  locals: {},
  middlewares: [],
  routes: [],
  viewsEngine: 'mustache',
  viewsPath: 'src',
}
const PORT_DEFAULT: number = 3000
const SESSION_SECRET_LENGTH_MIN: number = 32

const rootPath: string = process.cwd()

// Check and load the local .env file (development mode)
if (fileExists(`${rootPath}/.env`)) dotenv.config({ path: `${rootPath}/.env` })

export default class Lexpress {
  private app: express.Express
  private readonly headers: LexpressOptions['headers']
  private readonly helmet: LexpressOptions['helmet']
  private readonly https: LexpressOptions['https']
  private readonly locals: LexpressOptions['locals']
  private readonly middlewares: LexpressOptions['middlewares']
  private readonly notFoundmiddleware: LexpressOptions['notFoundmiddleware']
  private port: number
  private readonly routes: LexpressOptions['routes']
  private readonly staticPath: LexpressOptions['staticPath']
  private readonly viewsEngine: LexpressOptions['viewsEngine']
  private readonly viewsPath: LexpressOptions['viewsPath']

  public constructor(options: LexpressOptions) {
    const optionsFull: LexpressOptions = { ...LEXPRESS_OPTIONS_DEFAULT, ...options }

    this.headers = optionsFull.headers
    this.helmet = optionsFull.helmet
    this.https = optionsFull.https
    this.locals = optionsFull.locals
    this.middlewares = optionsFull.middlewares
    this.notFoundmiddleware = optionsFull.notFoundmiddleware
    this.routes = optionsFull.routes
    this.staticPath = optionsFull.staticPath
    this.viewsEngine = optionsFull.viewsEngine
    this.viewsPath = optionsFull.viewsPath
    this.init()
  }

  private init(): void {
    this.port = process.env.PORT !== undefined ? Number(process.env.PORT) : PORT_DEFAULT

    // Initialize the Express app
    this.app = express()

    // Attach local variables
    this.app.locals = this.locals

    // Attach the middlewares
    this.setMiddlewares()
    this.setCustomMiddlewares()

    // Attach Helmet
    // @see https://helmetjs.github.io/docs/
    this.app.use(helmet(this.helmet))

    // Attach the routes
    this.setRoutes()

    // Define the template renderer
    switch (this.viewsEngine) {
      case 'pug':
        this.app.engine('pug', pug.__express)
        this.app.set('view engine', 'pug')
        break

      default:
        this.app.engine('mst', mustacheExpress())
        this.app.set('view engine', 'mst')
    }

    // Set the views workspace relative path
    this.app.set('views', `${rootPath}/${this.viewsPath}`)

    // Set the static files workspace relative path
    this.app.use(express.static(`${rootPath}/${this.staticPath}`))

    // Set the response headers
    this.app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      let key: keyof LexpressOptions['headers']
      for (key in this.headers) {
        if (this.headers.hasOwnProperty(key)) res.header(key, this.headers[key])
      }

      next()
    })

    // Define 'public' directory as the static files directory
    this.app.use(express.static(`${rootPath}/public`))

    // Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers
    // to determine the connection and the IP address of the client.
    // NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
    // https://expressjs.com/en/4x/api.html#app.settings.table
    if (process.env.NODE_ENV === 'production') this.app.enable('trust proxy')

    // Attach the 404 error middleware
    if (this.notFoundmiddleware !== undefined) this.app.use(this.notFoundmiddleware)
  }

  private answer(
    req: Request,
    res: Response,
    next: NextFunction,
    routeIndex: number,
    routeSettings: Route['settings'] = {}
  ): void {
    // tslint:disable-next-line:variable-name
    const { controller: Controller, method } = this.routes[routeIndex]

    if (routeSettings.isCached === undefined || routeSettings.isCached) {
      // Check if a cached content exists for this query,
      const cachedContent: CacheContent | undefined = this.cache(req, res)
      // and send it if there is one.
      if (cachedContent !== undefined) {
        cachedContent.isJson ? res.json(cachedContent.body) : res.send(cachedContent.body)

        return
      }
    }

    let key: keyof LexpressOptions['headers']
    for (key in this.headers) {
      if (this.headers.hasOwnProperty(key)) res.header(key, this.headers[key])
    }

    log(`${method.toUpperCase()} on ${req.path} > ${Controller.name}.${method}()`)

    try {
      const controller: BaseController = new Controller(req, res, next)

      controller[method]()
    }
    catch (err) {
      answerError({
        err,
        isJson: true,
        res,
        scope: `${Controller.name}.${method}()`,
      })
    }
  }

  private cache(req: express.Request, res: express.Response): CacheContent | undefined {
    // We generate the cache key
    const key: string = keyifyRequest(req)

    // We try to get the cache, in case it exists
    const cacheContent: any = memoryCache.get(key)

    // If the cache exists, we return its content
    return cacheContent !== null ? cacheContent : undefined
  }

  private setCustomMiddlewares(): void {
    this.middlewares.forEach((middleware: express.RequestHandler) => this.app.use(middleware))
  }

  private setMiddlewares(): void {
    if (
      typeof process.env.SESSION_SECRET !== 'string'
      || process.env.SESSION_SECRET.length < SESSION_SECRET_LENGTH_MIN
    ) {
      log.err(`Lexpress#setMiddlewares(): Your %s must contain at least 32 characters.`, 'process.env.SESSION_SECRET')
    }

    // Parse application/json request body
    this.app.use(bodyParser.json())
    // Parse application/x-www-form-urlencoded request body
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(expressSession({
      cookie: {
        secure: process.env.NODE_ENV === 'production'
      },
      proxy: process.env.NODE_ENV === 'production',
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
    }))
    this.app.use(cache)
  }

  private setRoutes(): void {
    this.routes.forEach((route: Route, routeIndex: number) =>
      route.middleware !== undefined
        ? Array.isArray(route.middleware)
          ? route.call !== undefined
            ? this.app[route.method](route.path, ...route.middleware, route.call)
            : this.app[route.method](
              route.path,
              ...route.middleware,
              (req: Request, res: Response, next: NextFunction) => {
                this.answer(req, res, next, routeIndex, route.settings)
              }
            )
          : route.call !== undefined
            ? this.app[route.method](route.path, route.middleware, route.call)
            : this.app[route.method](
              route.path,
              route.middleware,
              (req: Request, res: Response, next: NextFunction) => {
                this.answer(req, res, next, routeIndex, route.settings)
              }
            )
        : route.call !== undefined
          ? this.app[route.method](route.path, route.call)
          : this.app[route.method](route.path, (req: Request, res: Response, next: NextFunction) => {
            this.answer(req, res, next, routeIndex, route.settings)
          })
    )
  }

  public start(): void {
    // tslint:disable-next-line:no-console
    console.log(logo)

    if (this.https === false) {
      this.startHttp()

      return
    }

    this.startHttps()
  }

  public startHttp(): void {
    const nodeEnv: string = process.env.NODE_ENV === 'production' ? 'production' : 'development'

    log.warn(`Lexpress Server will start in a ${nodeEnv} mode (non-secure).`)
    this.app.listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))
  }

  public startHttps(): void {
    const nodeEnv: string = process.env.NODE_ENV === 'production' ? 'production' : 'development'

    log.warn(`Lexpress Server will start in a ${nodeEnv} mode (secure).`)

    https
      .createServer(this.https as https.ServerOptions, this.app)
      .listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))
  }
}
