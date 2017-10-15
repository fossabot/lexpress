import { Request, Response } from 'express'

import BaseController from './BaseController'

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface BaseControllerConstructor {
  new (req: Request, res: Response): BaseController
}

export interface Route {
  Controller: BaseControllerConstructor
  method: BaseControllerMethod
  path: string
}

export type LexpressOptionsHttps = {
  cert: string
  key: string
}

export interface LexpressOptions {
  https?: false | LexpressOptionsHttps
  routes: Route[]
}
