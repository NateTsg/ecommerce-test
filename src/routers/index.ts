import { Application } from 'express';

import IAMRouter from './iam';
import ShopRouter from './shop';

let routes = (app: Application) => {
    app.use("/api/iam", IAMRouter);
    app.use("/api/shop", ShopRouter);
};

export default routes;