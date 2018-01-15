import { ApplicationRequestHandler, Request, Response } from 'express'

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

export interface LexpressOptions {
  headers?: LexpressOptionsHeaders
  https?: false | LexpressOptionsHttps
  middlewares?: ApplicationRequestHandler[]
  routes: Route[]
}
export type LexpressOptionsHeaders = {
  'Access-Control-Allow-Origin'?: string
  'Access-Control-Allow-Headers'?: string
}
export type LexpressOptionsHttps = {
  cert: string
  key: string
}
