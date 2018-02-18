import log from '@inspired-beings/log'
import { Request } from 'express'

import answerError from './libs/helpers/answerError'
import jsonSchemaValidate, { Schema } from './libs/helpers/jsonSchemaValidate'

import { BaseControllerMethod, BaseControllerResponse, Response } from '.'

export default abstract class BaseController {
  protected readonly controllerName: string = this.constructor.name
  protected isJson: boolean = true
  protected method: BaseControllerMethod
  protected readonly req: Request
  protected readonly res: Response

  public constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  public get(): BaseControllerResponse {
    this.method = 'get'
  }
  public post(): BaseControllerResponse {
    this.method = 'post'
  }
  public put(): BaseControllerResponse {
    this.method = 'put'
  }
  public delete(): BaseControllerResponse {
    this.method = 'delete'
  }

  protected log(message: string): void {
    log(`${this.controllerName}: ${message}`)
  }

  protected logError(message: string): void {
    log.err(`${this.controllerName}: ${message}`)
  }

  // protected logWrite(controllerName: string, data: {}): void {
  //   log.write(controllerName, data)
  // }

  protected answerError(err: string, statusCode: number = 400): void {
    answerError({
      err,
      isJson: this.isJson,
      res: this.res,
      scope: this.controllerName,
      statusCode,
    })
  }

  protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): void {
    this.log(`Validating JSON Schema`)

    jsonSchemaValidate(schema, this.method === 'get' ? this.req.query : this.req.body, (err: string) => {
      if (err !== null) {
        this.answerError(err)

        return
      }

      cb()
    })
  }
}
