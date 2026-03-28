import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import downloadLeadRouter from "./download-lead";
import newsRouter from "./news";
import columnsRouter from "./columns";
import sendEmailRouter from "./send-email";
import trackRouter from "./track";
import crawlEmailsRouter from "./crawl-emails";
import crawlGoogleRouter from "./crawl-google";
import crawlLeadsRouter from "./crawl-leads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(downloadLeadRouter);
router.use(newsRouter);
router.use(columnsRouter);
router.use(sendEmailRouter);
router.use(trackRouter);
router.use(crawlEmailsRouter);
router.use(crawlGoogleRouter);
router.use(crawlLeadsRouter);

export default router;
