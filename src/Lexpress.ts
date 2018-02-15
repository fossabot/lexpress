import * as dotenv from 'dotenv'
import * as express from 'express'
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
import { LexpressOptions, RouteOptions } from './types'

const lexpressOptionsDefault: LexpressOptions = {
  headers: {},
  https: false,
  middlewares: [],
  routes: [],
  viewsEngine: 'mustache',
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

  private answer(req: Request, res: Response, routeIndex: number, options: RouteOptions = {}) {
    const { controller: Controller, method } = this.routes[routeIndex]

    if (options.isJson !== undefined) {
      // Check if a cached content exists for this query,
      const cachedContent = this.cache(req, res)
      // and send it if there is one.
      if (cachedContent !== undefined) {
        return options.isJson ? res.json(cachedContent) : res.send(cachedContent)
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
      return answerError({ res, scope: `${Controller.name}.${method}()`, err })
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
    this.app.use(cache)
  }

  private setRoutes(): void {
    this.routes.forEach((route, routeIndex) =>
      this.app[route.method](route.path, (req, res) => this.answer(req, res, routeIndex, route.options))
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
