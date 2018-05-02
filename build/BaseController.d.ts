import { Schema } from './libs/helpers/jsonSchemaValidate';
import { BaseControllerMethod, BaseControllerResponse, NextFunction, Request, Response } from '.';
export default abstract class BaseController {
    protected readonly controllerName: string;
    protected isJson: boolean;
    protected method: BaseControllerMethod;
    protected readonly next: NextFunction;
    protected readonly req: Request;
    protected readonly res: Response;
    constructor(req: Request, res: Response, next: NextFunction);
    get(): BaseControllerResponse;
    post(): BaseControllerResponse;
    put(): BaseControllerResponse;
    delete(): BaseControllerResponse;
    protected log(message: string): void;
    protected logError(message: string): void;
    protected answerError(err: any, statusCode?: number): void;
    protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): void;
}
