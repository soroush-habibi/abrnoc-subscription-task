import express from 'express';
import apiController from '../controllers/apiController.js';
const router = express.Router();
router.post("/register", apiController.register);
router.get("/login", apiController.login);
router.post("/subscribe", apiController.subscribe);
router.patch("/deactive", apiController.deactiveSub);
export default router;
