import bcrypt from "bcryptjs";
import { appDataSource } from "../database/appDataSource.js";
import Pesquisador from "../entities/Pesquisador.js";
import { AppError } from "../errors/AppError.js";
import jwt from 'jsonwebtoken'
import { jwtConfig } from "../config/jwt.config.js";
import RefreshToken  from "../entities/RefreshToken.js";
import { randomUUID } from "crypto";

export class AuthService {

private pesquisadorRepo = appDataSource.getRepository(Pesquisador);
private refreshRepo = appDataSource.getRepository(RefreshToken)

  async login(email: string, password: string) {

    const pesquisador = await this.pesquisadorRepo.findOne({
      where: { email },
    });

    if (!pesquisador) {
      throw new AppError(401, "Credenciais inválidas");
    }

    const valid = await bcrypt.compare(password, pesquisador.senha);

    if (!valid) {
      throw new AppError(401, "Credenciais inválidas");
    }

    const refreshToken = await this.createRefreshToken(pesquisador);
    const accessToken = this.generateAccessToken(pesquisador);
    const refreshTokenJwt = this.generateRefreshToken(pesquisador, refreshToken.jti)
    return { accessToken, refreshToken:  refreshTokenJwt }

  }

  private generateAccessToken(user: Pesquisador) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: "access",
    },
    jwtConfig.access.secret,
    {
      expiresIn: jwtConfig.access.expiresIn!, 
    }
  );
}

private generateRefreshToken(user: Pesquisador, jti: string) {
  return jwt.sign(
    {
      sub: user.id,
      jti: jti,
      type: "refresh",
    },
    jwtConfig.refresh.secret,
    {
      expiresIn: jwtConfig.refresh.expiresIn!,
    }
  );
}

  private async createRefreshToken(pesquisador: Pesquisador) {
    const token = this.refreshRepo.create({
        jti: randomUUID(),
        pesquisador,
    });

    return this.refreshRepo.save(token);
    }
}