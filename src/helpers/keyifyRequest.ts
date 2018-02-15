import { Request } from 'express'

import keyifyObject from './keyifyObject'

export default function(req: Request): string {
  let keyQuery: string = req.originalUrl
    .toLocaleLowerCase()
    .replace(/\//g, '$')

  if (keyQuery.length > 1 ) keyQuery = keyQuery.replace(/\$$/, '')

  let keyParams: string | undefined

  switch(req.method) {
    case 'GET':
      keyParams = keyifyObject(req.query)
      break

    case 'POST':
    case 'PUT':
    case 'DELETE':
      keyParams = keyifyObject(req.body)
      break
  }

  return keyParams === undefined ? keyQuery : `${keyQuery}-${keyParams}`
}
