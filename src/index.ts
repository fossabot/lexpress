import * as express from 'express'
import { IHelmetConfiguration } from 'helmet'
import { ServerOptions } from 'https'
import { ServeStaticOptions } from 'serve-static'

import Lexpress from './Lexpress'
export { Lexpress }

import BaseController from './BaseController'
export { BaseController }

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

interface LexpressCustomProps {
  headers: LexpressCustomPropsHeaders
  helmet: IHelmetConfiguration
  https: false | ServerOptions
  locals: { [key: string]: any }
  middlewares: express.RequestHandler[]
  notFoundmiddleware?: express.RequestHandler
  routes: Route[]
  staticOptions: ServeStaticOptions
  staticPath?: string
  viewsEngine: 'mustache' | 'pug'
  viewsPath: string
}
export interface LexpressCustomPropsHeaders {
  'Access-Control-Allow-Origin'?: string
  'Access-Control-Allow-Headers'?: string
}

export type LexpressOptions = Partial<LexpressCustomProps>
