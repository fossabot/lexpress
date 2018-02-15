/// <reference types="express" />
/// <reference types="node" />
import * as express from 'express';
import { ServerOptions } from 'https';
export interface Response extends express.Response {
    cache?: (forInSeconds: number) => CacheResponse;
}
export interface CacheResponse {
    json: express.Response['json'];
    render: express.Response['render'];
}
import BaseController from './BaseController';
export declare type BaseControllerMethod = 'delete' | 'get' | 'post' | 'put';
export declare type BaseControllerResponse = Response | Promise<Response> | void;
export interface BaseControllerConstructor {
    new (req: express.Request, res: express.Response): BaseController;
}
export interface Route {
    call?: any;
    controller?: BaseControllerConstructor;
    method: BaseControllerMethod;
    path: string;
}
export interface LexpressOptions {
    headers?: LexpressOptionsHeaders;
    https?: false | ServerOptions;
    middlewares?: express.RequestHandler[];
    routes: Route[];
    viewsEngine?: 'mustache';
    viewsPath?: string;
}
export declare type LexpressOptionsHeaders = {
    'Access-Control-Allow-Origin'?: string;
    'Access-Control-Allow-Headers'?: string;
};
