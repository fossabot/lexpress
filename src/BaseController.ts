import { Request, Response } from 'express'

import answerError from './libs/helpers/answerError'
import log from './libs/helpers/log'
import Validate, { Schema } from './libs/validate'

import { BaseControllerResponse } from './types'

export default abstract class BaseController {
  protected readonly filePath = this.constructor.name

  constructor(
    protected readonly req: Request,
    protected readonly res: Response
  ) {}

  public get(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public post(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public put(): BaseControllerResponse { return this.answerError('Not Found', 404) }
  public delete(): BaseControllerResponse { return this.answerError('Not Found', 404) }

  protected log(message: string): void {
    log(`${this.filePath}: ${message}`)
  }

  protected logError(message: string): void {
    log.error(`${this.filePath}: ${message}`)
  }

  protected logWrite(filePath: string, data: {}): void {
    log.write(filePath, data)
  }

  protected answerError(err: string, statusCode?: number): Response {
    return answerError({
      res: this.res,
      scope: this.filePath,
      err,
      statusCode: statusCode || 0,
    })
  }

  protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): BaseControllerResponse {
    this.log(`Validating JSON Schema`)

    return Validate.jsonSchema(schema, this.req.query, (err) => {
      if (err) return this.answerError(err)

      return cb()
    })
  }
}
