import Lexpress from './Lexpress'
export { Lexpress }

import BaseController from './BaseController'
export { BaseController }

import log from './libs/helpers/log'
export { log }

import * as express from 'express'
import { ServerOptions } from 'https'

// tslint:disable-next-line:no-empty-interface
export interface Request extends express.Request {}

export interface Response extends express.Response {
  cache(forInSeconds: number): CacheResponse
}
export interface CacheResponse {
  json: express.Response['json']
  render: express.Response['render']
}

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface BaseControllerConstructor {
  new (req: express.Request, res: express.Response): BaseController
}

export interface Route {
  call?: any
  controller?: BaseControllerConstructor
  method: BaseControllerMethod
  path: string
  settings?: {
    isCached?: boolean
  }
}

export interface LexpressOptions {
  headers?: LexpressOptionsHeaders
  https?: false | ServerOptions
  middlewares?: express.RequestHandler[]
  routes: Route[]
  viewsEngine?: 'mustache'/* | 'pug'*/
  viewsPath?: string
}
export interface LexpressOptionsHeaders {
  'Access-Control-Allow-Origin'?: string
  'Access-Control-Allow-Headers'?: string
}
