import { Request } from 'express'

import answerError from './libs/helpers/answerError'
import log from './libs/helpers/log'
import jsonSchemaValidate, { Schema } from './libs/helpers/jsonSchemaValidate'

import { BaseControllerResponse, Response } from './types'

export default abstract class BaseController {
  protected readonly controllerName = this.constructor.name
  protected isJson: boolean = true

  constructor(
    protected readonly req: Request,
    protected readonly res: Response
  ) {}

  public get(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public post(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public put(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public delete(): BaseControllerResponse { return this.answerError('Not Found', 404) }

  protected log(message: string): void {
    log(`${this.controllerName}: ${message}`)
  }

  protected logError(message: string): void {
    log.error(`${this.controllerName}: ${message}`)
  }

  protected logWrite(controllerName: string, data: {}): void {
    log.write(controllerName, data)
  }

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

    return jsonSchemaValidate(schema, this.req.query, (err) => {
      if (err) return this.answerError(err)

      return cb()
    })
  }
}
