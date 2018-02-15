import { Request as LRequest, Response as LResponse } from '.'

declare namespace Express {
  export interface Request extends LRequest {}
  export interface Response extends LResponse {}
}
