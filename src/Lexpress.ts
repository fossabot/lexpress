import * as dotenv from 'dotenv'
import * as express from 'express'
import * as http from 'http'
const mustacheExpress = require('mustache-express')

import answerError from './libs/helpers/answerError'
import fileExists from './libs/helpers/fileExists'
import log from './libs/helpers/log'
import logo from './libs/media/logo'

import { Express, Request, Response } from 'express'
import { LexpressOptions } from './types'

const rootPath = process.cwd()

export default class Lexpress {
  private app: Express
  private port: number
  private routes: LexpressOptions['routes']

  constructor(options: LexpressOptions) {
    this.routes = options.routes
    this.port = options.port || Number(process.env.PORT) || 3000

    this.init()
  }

  private init() {
    // Check and load the local .env file (development mode)
    if (fileExists(`${rootPath}/.env`)) dotenv.config({ path: `${rootPath}/.env` })


    // Initialize the Express app
    this.app = express()

    // Attaches the routes
    this.setRoutes()

    // Define mustache as the template renderer
    this.app.engine('mst', mustacheExpress())
    this.app.set('view engine', 'mst')
    this.app.set('views', `${rootPath}/server/views`)

    // Define 'public' directory as the static files directory
    this.app.use(express.static(`${rootPath}/public`))
  }

  private answer(req: Request, res: Response, routeIndex: number) {
    const { Controller, method } = this.routes[routeIndex]

    console.log(`${method.toUpperCase()} on ${req.path} > ${Controller.name}.${method}()`)

    try {
      const controller = new Controller(req, res)
      return controller[method]()
    }
    catch (err) {
      return answerError({ res, scope: `${Controller.name}.${method}()`, err })
    }
  }

  private setRoutes() {
    this.routes.forEach((route, routeIndex) =>
      this.app[route.method](route.path, (req, res) => this.answer(req, res, routeIndex))
    )
  }

  public start(): void {
    console.log(logo)

    if (process.env.NODE_ENV === 'development') {
      log.warn(`Lexpress Server will start in a development mode.`)

      http
        .createServer(this.app)
        .listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))

      return
    }

    log.warn(`Lexpress Server will start in a production mode.`)

    this.app.listen(this.port, () => log.info(`Lexpress Server is listening on port ${this.port}.`))
  }
}
