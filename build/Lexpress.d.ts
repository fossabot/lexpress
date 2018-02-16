import { LexpressOptions } from '.';
export default class Lexpress {
    private app;
    private readonly headers;
    private readonly https;
    private readonly middlewares;
    private readonly notFoundmiddleware;
    private port;
    private readonly routes;
    private readonly viewsEngine;
    private readonly viewsPath;
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
