import chalk from 'chalk'

// Is replaced with postversion script
const VERSION: string = `__VERSION__`

export default chalk.gray(`
,
"\\",
"=\\=",
 "=\\=",
  "=\\=",
   "-\\-"
      \\
       \\  ${chalk.magenta('Lexpress')} ${chalk.blue(VERSION)}

`)
