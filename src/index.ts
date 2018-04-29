import Lexpress from './Lexpress'
export { Lexpress }

import BaseController from './BaseController'
export { BaseController }

import * as express from 'express'
import { IHelmetConfiguration } from 'helmet'
import { ServerOptions } from 'https'

// tslint:disable-next-line:no-empty-interface
export interface NextFunction extends express.NextFunction {}

// tslint:disable-next-line:no-empty-interface
export interface Request extends express.Request {}

export interface Response extends express.Response {
  cache(forInSeconds: number): CacheResponse
}
export interface CacheResponse {
  json: express.Response['json']
  render: express.Response['render']
}
export interface CacheContent {
  isJson: boolean
  body: any
}

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface BaseControllerConstructor {
  new (req: Request, res: Response, next: NextFunction): BaseController
}

export interface Route {
  call?: any
  controller?: BaseControllerConstructor
  method: BaseControllerMethod
  middleware?: express.RequestHandler | express.RequestHandler[]
  path: string
  settings?: {
    isCached?: boolean
  }
}

export interface LexpressOptions {
  headers?: LexpressOptionsHeaders
  helmet?: IHelmetConfiguration
  https?: false | ServerOptions
  locals?: { [key: string]: any }
  middlewares?: express.RequestHandler[]
  notFoundmiddleware?: express.RequestHandler
  routes: Route[]
  staticPath?: string
  viewsEngine?: 'mustache' | 'pug'
  viewsPath?: string
}
export interface LexpressOptionsHeaders {
  'Access-Control-Allow-Origin'?: string
  'Access-Control-Allow-Headers'?: string
}
