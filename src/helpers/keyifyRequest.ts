import { Request } from 'express'

import keyifyObject from './keyifyObject'

export default function(req: Request): string {
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

  return keyChunks.join('-')
}
