/// <reference types="express" />
import { Request } from 'express';
import { Schema } from './libs/helpers/jsonSchemaValidate';
import { BaseControllerMethod, BaseControllerResponse, Response } from '.';
export default abstract class BaseController {
    protected readonly controllerName: string;
    protected isJson: boolean;
    protected method: BaseControllerMethod;
    protected readonly req: Request;
    protected readonly res: Response;
    constructor(req: Request, res: Response);
    get(): BaseControllerResponse;
    post(): BaseControllerResponse;
    put(): BaseControllerResponse;
    delete(): BaseControllerResponse;
    protected log(message: string): void;
    protected logError(message: string): void;
    protected answerError(err: Error | string, statusCode?: number): void;
    protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): void;
}
