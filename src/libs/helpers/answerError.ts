import log from '@inspired-beings/log'

import { Response } from '../..'

export interface AnswerErrorParams {
  err: string
  isJson: boolean
  res: Response
  scope: string
  statusCode?: number
}

const CACHE_EXPIRATION_IN_SECONDS: number = 60
const HTTP_STATUS_CODE_BAD_REQUEST: number = 400
const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR: number = 500

export default function answerError({ err, isJson, res, statusCode, scope }: AnswerErrorParams): void {
  if (statusCode !== undefined && statusCode < HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR) {
    log.warn(`${scope}: ${err}`)
  } else {
    log.err(`${scope}: ${err}`)
  }

  if (isJson) {
    if (process.env.NODE_ENV === 'development') {
      res.status(statusCode).json({
        error: {
          code: statusCode,
          message: err
        }
      })

      return
    }

    (res.status(HTTP_STATUS_CODE_BAD_REQUEST) as Response).cache(CACHE_EXPIRATION_IN_SECONDS).json({
      error: {
        code: HTTP_STATUS_CODE_BAD_REQUEST,
        message: 'Bad Request'
      }
    })

    return
  }

  if (process.env.NODE_ENV === 'development') {
    res.render(String(statusCode))

    return
  }

  res.cache(CACHE_EXPIRATION_IN_SECONDS).render(String(statusCode))
}
