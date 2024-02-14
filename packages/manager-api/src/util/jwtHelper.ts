import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as logger from 'winston';
import { getRequiredEnvVar } from './getRequiredEnvVar';

export class JwtHelper {

  private static readonly jwtKey: string = getRequiredEnvVar('JWT_SECRET')
  private static readonly jwtExpiry: number = 3600
  private static readonly tokenName: string = 'SESSION_ID'

  static createBearerToken (bearerToken: string): any {
    return jwt.sign({ bearerToken }, this.jwtKey, {
      algorithm: 'HS256',
      expiresIn: this.jwtExpiry
    })
  }

  static readBearerTokenFromRequest (req: Request): string | undefined {
    try {
      const token = jwt.verify(req.cookies.SESSION_ID, this.jwtKey) as jwt.JwtPayload
      return token.bearerToken;
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        logger.info('Invalid JWT Token')
      }
      return undefined
    }
  }

  static saveBearerTokenToCookie (res: Response, token: any) {
    res.cookie(this.tokenName, token, { maxAge: this.jwtExpiry * 1000 })
  }

  static expireCookie (res: Response) {
    res.clearCookie(this.tokenName)
  }
}