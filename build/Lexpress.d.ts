import { LexpressOptions } from './types';
export default class Lexpress {
    private app;
    private headers;
    private https;
    private middlewares;
    private port;
    private routes;
    private viewsEngine;
    private viewsPath;
    constructor(options: LexpressOptions);
    private init();
    private answer(req, res, routeIndex, routeSettings?);
    private cache(req, res);
    private setCustomMiddlewares();
    private setMiddlewares();
    private setRoutes();
    start(): void;
    startHttp(): void;
    startHttps(): void;
}
