import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import downloadLeadRouter from "./download-lead";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(downloadLeadRouter);

export default router;
