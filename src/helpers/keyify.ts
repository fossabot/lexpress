import * as crypto from 'crypto'

const hash = crypto.createHash('md5')

export default function(str: string): string {
  hash.update(str)

  return hash.digest('hex')
}
