import { Response } from '../..';
export interface AnswerErrorParams {
    err: string;
    isJson: boolean;
    res: Response;
    scope: string;
    statusCode?: number;
}
export default function answerError({err, isJson, res, statusCode, scope}: AnswerErrorParams): void;
