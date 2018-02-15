import log from '@inspired-beings/log'
import { Request } from 'express'

import answerError from './libs/helpers/answerError'
import jsonSchemaValidate, { Schema } from './libs/helpers/jsonSchemaValidate'

import { BaseControllerResponse, Response } from '.'

const HTTP_STATUS_CODE_NOT_FOUND: number = 404

export default abstract class BaseController {
  protected readonly controllerName: string = this.constructor.name
  protected isJson: boolean = true
  protected readonly req: Request
  protected readonly res: Response

  public constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  public get(): BaseControllerResponse { return this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND) }
  public post(): BaseControllerResponse { return this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND) }
  public put(): BaseControllerResponse { return this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND) }
  public delete(): BaseControllerResponse { return this.answerError('Not Found', HTTP_STATUS_CODE_NOT_FOUND) }

  protected log(message: string): void {
    log.LogFunction(`${this.controllerName}: ${message}`)
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

  protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): BaseControllerResponse {
    this.log(`Validating JSON Schema`)

    return jsonSchemaValidate(schema, this.req.query, (err: string) => {
      if (err) return this.answerError(err)

      return cb()
    })
  }
}
