import { appDataSource } from "../database/appDataSource.js";
import RefreshToken from "../entities/RefreshToken.js";
import { AppError } from "../errors/AppError.js";

export class LogoutService {

    private refreshRepo =  appDataSource.getRepository(RefreshToken);

    async execute(jti: string) {
        const session = await this.refreshRepo.findOne({
            where: { jti }
        })
        if (!session) {
            throw new AppError(404, "Sessão não encontrada");
        }
        await this.refreshRepo.remove(session);
    }
}
