import { Router } from "express";

import ProductRouter from "./Product.router";
import CartItemRouter from "./CartItem.router";
import TransactionRouter from "./Transaction.router";

let router: Router = Router();

router
  /**
   * Product Router
   */
  .use("/product", ProductRouter)
    /**
   * Cart Item Router
   */
  .use("/cart", CartItemRouter)
  /**
   * Transaction Router
   */
  .use("/transaction", TransactionRouter);

export default router;
