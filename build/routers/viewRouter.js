import express from 'express';
import viewController from '../controllers/viewController.js';
import apiController from '../controllers/apiController.js';
const router = express.Router();
router.get("/", viewController.authentication, viewController.loginPage);
router.get("/app", apiController.authentication, viewController.appPage);
export default router;
