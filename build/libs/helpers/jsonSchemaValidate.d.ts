export declare type Schema = Object | string | boolean;
export declare type Callback = (err: string | null) => any;
export default function (schema: Schema, data: {}, cb: Callback): void;
