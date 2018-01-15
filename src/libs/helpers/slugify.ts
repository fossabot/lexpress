export default function(str: string): string {
  return str
    .toLocaleLowerCase()
    .replace(/\W+/g, '-')
}
