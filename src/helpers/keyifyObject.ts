export default function(value: {}): string {
  return JSON.stringify(value)
    .replace(/\W+/g, '-')
    .replace(/^-|-$/g, '')
    .toLocaleLowerCase()
}
