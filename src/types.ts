import * as express from 'express'
import { ServerOptions } from 'https'

export interface Response extends express.Response {
  cache?: (expirationInMs: number) => Response
}

import BaseController from './BaseController'

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface BaseControllerConstructor {
  new (req: express.Request, res: express.Response): BaseController
}

export interface Route {
  controller: BaseControllerConstructor
  method: BaseControllerMethod
  path: string
}

export interface LexpressOptions {
  headers?: LexpressOptionsHeaders
  https?: false | ServerOptions
  middlewares?: express.RequestHandler[]
  routes: Route[]
  viewsEngine?: 'mustache' | 'pug'
  viewsPath?: string
}
export type LexpressOptionsHeaders = {
  'Access-Control-Allow-Origin'?: string
  'Access-Control-Allow-Headers'?: string
}
