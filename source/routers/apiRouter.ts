import express from 'express';

import apiController from '../controllers/apiController.js';

const router = express.Router();

router.post("/register", apiController.register);

router.get("/login", apiController.login);

router.post("/subscribe", apiController.authentication, apiController.subscribe);

router.patch("/deactive", apiController.authentication, apiController.deactiveSub);

router.patch("/active", apiController.authentication, apiController.activeSub);

router.delete("/delete", apiController.authentication, apiController.deleteSub);

export default router;