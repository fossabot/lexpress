import { Response } from 'express'
import { Collection, InsertWriteOpResult, MongoClient } from 'mongodb'
import * as path from 'path'

import answerError from '../answerError'
import log from '../helpers/log'

import { CollectionName } from './types'

const filePath = path.basename(__filename)

export default class Database {
  private query<ExpectedCollectionItem>(
    res: Response,
    collectionName: CollectionName,
    cb: (collection: Collection<ExpectedCollectionItem>) => void
  ) {
    console.log(`${filePath} > Connecting to database`)

    MongoClient.connect(process.env.MONGODB_URI, (err, db): any => {
      if (err) return answerError({ res, filePath, err: err.message })

      log(`${filePath} > Opening collection '${collectionName}'`)
      const collection = db.collection<ExpectedCollectionItem>(collectionName)

      cb(collection)

      db.close()
    })
  }

  public select<ExpectedCollectionItem>(
    res: Response,
    collectionName: CollectionName,
    where: any, cb: (items: ExpectedCollectionItem[]
  ) => any) {
    this.query<ExpectedCollectionItem>(res, collectionName, (collection) => {
      log(`${filePath} > Selecting in collection '${collectionName}'`)

      collection.find(where).toArray((err, items): any => {
        if (err) return answerError({ res, filePath, err: err.message })

        cb(items)
      })
    })
  }

  public insert<ExpectedCollectionItem>(
    res: Response, collectionName: CollectionName,
    items: ExpectedCollectionItem[],
    cb: (result: InsertWriteOpResult) => any
  ) {
    this.query(res, collectionName, (collection) => {
      log(`${filePath} > Inserting ${items.length} items in collection '${collectionName}'`)

      collection.insertMany(items, (err, result): any => {
        if (err) return answerError({ res, filePath, err: err.message })

        cb(result)
      })
    })
  }
}
