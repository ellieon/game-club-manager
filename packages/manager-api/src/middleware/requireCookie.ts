
import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from '../util/jwtHelper';

declare global {
    namespace Express {
      export interface Request {
        token?: string;
      }
    }
  }

export const requireCookie = (req: Request, res: Response, next: NextFunction) => {
    const token = JwtHelper.readBearerTokenFromRequest(req);
    if (!token) {
        console.log('Bearer token not found, redirecting to auth');
        res.redirect('/auth/discord');
    } else {
        req.token = token;
        next();
    }
  };