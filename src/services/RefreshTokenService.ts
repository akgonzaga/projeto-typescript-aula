import type { JwtPayload } from "jsonwebtoken";
import { appDataSource } from "../database/appDataSource.js";
import Pesquisador from "../entities/Pesquisador.js";
import RefreshToken from "../entities/RefreshToken.js";
import { jwtConfig } from "../config/jwt.config.js";
import jwt from 'jsonwebtoken'
import { AppError } from "../errors/AppError.js";

export class RefreshTokenService {
    private refreshRepo = appDataSource.getRepository(RefreshToken);
    private pesquisadorRepo = appDataSource.getRepository(Pesquisador);

    async execute(refreshTokenJWT: string) {
        let payload: JwtPayload;
        try {
            payload = jwt.verify (
                refreshTokenJWT,
                jwtConfig.refresh.secret
            ) as JwtPayload
        } catch (error) {
            throw new AppError(401, "Refresh token inválido")
        }
        if (payload.type !== "refresh" || !payload.jti || !payload.sub) {
            throw new AppError(401, "Refresh token inválido")
        }
        const session = await this.refreshRepo.findOne({
            where: { jti: payload.jti },
            relations: ["pesquisador"]
        })
        if (!session) {
            throw new AppError(401, "Sessão expirada!")
        }
        const acessToken = jwt.sign(
            {
              sub: session.pesquisador.id,
              email: session.pesquisador.email,
              jti: session.jti,
              type: "access",
            },
            jwtConfig.access.secret,
            {
      
              expiresIn: jwtConfig.access.expiresIn!,
            }
          );
        return acessToken;
    }
    
}
