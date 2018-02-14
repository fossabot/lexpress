import * as express from 'express'
import * as memoryCache from 'memory-cache'

import keyifyObject from '../helpers/keyifyObject'

import { Response } from '../types'

export default function cache(
  req: express.Request,
  res: Response,
  next: express.NextFunction
): void {
  (res as any).cache = (expirationInMs: number) => {
    const keyChunks: string[] = [req.originalUrl.toLowerCase()]

    switch(req.method) {
      case 'GET':
        keyChunks.push(keyifyObject(req.query))
        break

      case 'POST':
      case 'PUT':
      case 'DELETE':
        keyChunks.push(keyifyObject(req.body))
        break
    }

    const key: string = keyChunks.join('-')

    const { json, ...resRest } = res

    const jsonAugmented = (body?: any): Response => {
      if (cache === undefined) {
        return json()
      }

      const cacheBody = memoryCache.get(key)

      if (cacheBody === null) {
        memoryCache.put(key, body, expirationInMs)

        return json(body)
      } else {
        return json(cacheBody)
      }
    }

    return {
      json: jsonAugmented,
      ...resRest
    }
  }

  next()
}
