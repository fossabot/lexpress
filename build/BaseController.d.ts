/// <reference types="express" />
import { Request } from 'express';
import { Schema } from './libs/helpers/jsonSchemaValidate';
import { BaseControllerResponse, Response } from './types';
export default abstract class BaseController {
    protected readonly req: Request;
    protected readonly res: Response;
    protected readonly controllerName: string;
    protected isJson: boolean;
    constructor(req: Request, res: Response);
    get(): BaseControllerResponse;
    post(): BaseControllerResponse;
    put(): BaseControllerResponse;
    delete(): BaseControllerResponse;
    protected log(message: string): void;
    protected logError(message: string): void;
    protected logWrite(controllerName: string, data: {}): void;
    protected answerError(err: string, statusCode?: number): void;
    protected validateJsonSchema(schema: Schema, cb: () => BaseControllerResponse): BaseControllerResponse;
}
