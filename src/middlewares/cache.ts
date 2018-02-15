import log from '@inspired-beings/log'
import { NextFunction, Request } from 'express'
import * as dotenv from 'dotenv'
import * as memoryCache from 'memory-cache'

import keyifyRequest from '../helpers/keyifyRequest'

import { CacheResponse, Response } from '../types'

dotenv.config()

export default function cache(req: Request, res: Response, next: NextFunction): void {
  res.cache = (forInSeconds: number): CacheResponse => {
    const expirationInMs: number = forInSeconds * 1000

    // We generate the cache key
    const key: string = keyifyRequest(req)

    // We augment the Express json() method
    const jsonAugmented = (body?: any): Response => {
      if (process.env.NODE_ENV === 'development') {
        log.info(`Caching %s key for %sms`, key, expirationInMs)
      }

      memoryCache.put(key, body, expirationInMs)

      return res.json(body)
    }

    // We augment the Express render() method
    const renderAugmented = (view: string, options?: Object, callback?: (err: Error, html: string) => void): void => {
      if (options !== undefined && typeof options === 'object') {
        return res.render(view, options, (err: Error, html: string) => {
          if (err === null) {
            if (process.env.NODE_ENV === 'development') {
              log.info(`Caching %s key for %sms`, key, expirationInMs)
            }

            memoryCache.put(key, html, expirationInMs)
          }

          if (callback !== undefined) callback(err, html)
        })
      }

      return res.render(view, (err: Error, html: string) => {
        if (process.env.NODE_ENV === 'development') {
          log.info(`Augmented res.render()`)
        }

        if (err === null) {
          if (process.env.NODE_ENV === 'development') {
            log.info(`Caching %s key for %sms`, key, expirationInMs)
          }

          memoryCache.put(key, html, expirationInMs)
        }

        if (callback !== undefined) callback(err, html)
      })
    }

    return {
      json: jsonAugmented,
      render: renderAugmented,
    }
  }

  next()
}
