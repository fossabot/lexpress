import express from 'express'

declare module 'express' {
  export interface Response extends core.Response {
    render(view: string, options?: Object, callback?: (err: Error | null, html: string) => void): void;
    render(view: string, callback?: (err: Error | null, html: string) => void): void;
  }
}
