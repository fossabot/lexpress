/// <reference types="express" />

import { CacheResponse } from '.'

declare namespace Express {
  export interface Response {
    cache(forInSeconds: number): CacheResponse
  }
}
