/// <reference types="express" />
import * as express from 'express';
import { Request, Response } from '..';
export default function cache(req: Request, res: Response, next: express.NextFunction): void;
