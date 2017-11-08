import chalk from 'chalk'

const npmConfig = require('../../../package.json')

export default chalk.gray(`
,
"\\",
"=\\=",
 "=\\=",
  "=\\=",
   "-\\-"
      \\
       \\  ${chalk.magenta('Lexpress')} ${chalk.blue(npmConfig.version)}

`)
