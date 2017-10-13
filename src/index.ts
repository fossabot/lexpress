import { Request, Response } from 'express'

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface BaseControllerConstructor {
  new (req: Request, res: Response): BaseController
}

export interface Route {
  controller: BaseControllerConstructor
  method: BaseControllerMethod
  path: string
}

export interface LexpressOptions {
  port?: number
  routes: Route[]
}

import Lexpress from './Lexpress'
export default Lexpress

import BaseController from './BaseController'
export { BaseController }
