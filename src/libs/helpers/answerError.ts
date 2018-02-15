import { Response } from '../../types'

import log from './log'

export interface AnswerErrorParams {
  err: string
  isJson: boolean
  res: Response
  scope: string
  statusCode?: number
}

const CACHE_EXPIRATION_IN_SECONDS: number = 60

export default function answerError({ err, isJson, res, statusCode, scope }: AnswerErrorParams): void {
  if (statusCode && statusCode < 500)
    log.warn(`${scope}: ${err}`)
  else
    log.error(`${scope}: ${err}`)

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

    (res.status(400) as Response).cache(CACHE_EXPIRATION_IN_SECONDS).json({
      error: {
        code: 400,
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
