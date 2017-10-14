import { Response } from 'express'

import log from './log'

interface AnswerErrorParams {
  res: Response
  scope: string
  err: string
  statusCode?: number
}

export default function answerError({ res, scope, err, statusCode = 400 }: AnswerErrorParams): Response {
  if (statusCode && statusCode < 500)
    log.warn(`${scope}: ${err}`)
  else
    log.error(`${scope}: ${err}`)

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      error: {
        code: statusCode,
        message: err
      }
    })
  }

  return res.status(400).json({
    error: {
      code: 400,
      message: 'Bad Request'
    }
  })
}
