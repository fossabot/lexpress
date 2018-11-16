import { Request } from 'express'

import keyifyObject from './keyifyObject'

export default function(req: Request): string {
  let keyQuery: string = req.originalUrl
    .toLocaleLowerCase()
    .replace(/\//g, '$')

  if (keyQuery.length > 1) keyQuery = keyQuery.replace(/\$$/, '')

  const keyParams: string = req.method === 'GET' ? keyifyObject(req.query) : keyifyObject(req.body)

  return keyParams.length === 0 ? keyQuery : `${keyQuery}-${keyParams}`
}
