import { Router } from "express";
import sensorRouter from "./sensorRoutes.js";
import pesquisadorRoutes from "./pesquisadorRoutes.js";


const indexRouter = Router();

indexRouter.use(sensorRouter);
indexRouter.use(pesquisadorRoutes);

export default indexRouter;
