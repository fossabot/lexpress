export default function(value: Object): string {
  return JSON.stringify(value)
    .replace(/\W+/g, '-')
    .replace(/^-|-$/g, '')
    .toLocaleLowerCase()
}
