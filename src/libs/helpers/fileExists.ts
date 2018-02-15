import * as fs from 'fs'

export default function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath)

    return true
  }
  catch (err) {
    return false
  }
}
