/// <reference types="express" />
import { NextFunction, Request } from 'express';
import { Response } from '../types';
export default function cache(req: Request, res: Response, next: NextFunction): void;
