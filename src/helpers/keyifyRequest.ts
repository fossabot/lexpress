import { Request } from 'express'

import keyifyObject from './keyifyObject'

export default function(req: Request): string {
  const keyChunks: string[] = [req.originalUrl.substr(1).toLowerCase()]

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

  return key.length === 1 ? '0' : key
}
