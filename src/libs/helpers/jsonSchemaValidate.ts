import * as Ajv from 'ajv'

// tslint:disable-next-line:ban-types
export type Schema = Object | string | boolean
export type Callback = (err: string | null) => any

const ajv: Ajv.Ajv = new Ajv()

export default function(schema: Schema, data: {}, cb: Callback): void {
  cb(ajv.validate(schema, data) ? null : ajv.errorsText())
}
