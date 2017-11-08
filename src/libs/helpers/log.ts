import chalk from 'chalk'
import * as fs from 'fs'

// TODO https://stackoverflow.com/questions/41773168/define-prototype-function-with-typescript
const log = (console as any).log

log.error = (message: string): void => console.log(chalk.red(message))
log.info = (message: string): void => console.log(chalk.blue(message))
log.warn = (message: string): void => console.log(chalk.yellow(message))

log.write = (fileName: string, object: {}): void =>
  fs.writeFileSync(fileName, JSON.stringify(object, null, 2))

export default log
