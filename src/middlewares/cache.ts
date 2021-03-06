import log from '@inspired-beings/log'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as memoryCache from 'memory-cache'

import keyifyRequest from '../helpers/keyifyRequest'

import { CacheResponse, Request, Response } from '..'

dotenv.config()

const SECONDS_IN_MILLISECONDS: number = 1000

export default function cache(req: Request, res: Response, next: express.NextFunction): void {
  res.cache = (forInSeconds: number): CacheResponse => {
    const expirationInMs: number = forInSeconds * SECONDS_IN_MILLISECONDS

    // We generate the cache key
    const key: string = keyifyRequest(req)

    // We augment the Express json() method
    const jsonAugmented: express.Response['json'] = (body?: any): Response => {
      if (process.env.NODE_ENV === 'development') {
        log.info(`Caching %s key for %sms`, key, expirationInMs)
      }

      memoryCache.put(key, body, expirationInMs)

      return res.json({ isJson: true, body }) as Response
    }

    // We augment the Express render() method
    const renderAugmented: express.Response['render'] = (
      view: string,
      options?: {},
      callback?: (err: Error | null, html: string) => void
    ): void => {
      if (options !== undefined && typeof options === 'object') {
        res.render(view, options, (err: Error | null, html: string) => {
          if (err === null) {
            if (process.env.NODE_ENV === 'development') {
              log.info(`Caching %s key for %sms`, key, expirationInMs)
            }

            memoryCache.put(key, { isJson: false, body: html }, expirationInMs)
          }

          if (callback !== undefined) {
            callback(err, html)

            return
          }

          res.send(html)
        })

        return
      }

      res.render(view, (err: Error | null, html: string) => {
        if (err === null) {
          if (process.env.NODE_ENV === 'development') {
            log.info(`Caching %s key for %sms`, key, expirationInMs)
          }

          memoryCache.put(key, { isJson: false, body: html }, expirationInMs)
        }

        if (callback !== undefined) {
          callback(err, html)

          return
        }

        res.send(html)
      })

      return
    }

    return {
      json: jsonAugmented,
      render: renderAugmented,
    }
  }

  next()
}
