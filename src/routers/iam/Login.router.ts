import express, { Router } from 'express';

import LoginController from '../../controllers/iam/Login.controller';

let router: Router = express.Router();

router
    /**
     * jwt Login
     */
    .post("/jwt", LoginController.jwtLogin);

export default router;