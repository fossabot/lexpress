import { Response } from 'express'

export type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put'

export type BaseControllerResponse = Response | Promise<Response> | void

export interface Route {
  handler: BaseController
  method: BaseControllerMethod
  path: string
}

export interface LexpressOptions {
  routes: Route[]
}
