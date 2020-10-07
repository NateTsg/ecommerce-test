import { Router } from "express";

import UserRouter from "./User.router";
import LoginRouter from "./Login.router";
import ClientRouter from "./Client.router";

let router: Router = Router();

router
  /**
   * Login Router
   */
  .use("/login", LoginRouter)
    /**
   * Login Router
   */
  .use("/user", UserRouter)
  /**
   * Client Router
   */
  .use("/client", ClientRouter);

export default router;
