import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

let swaggerDoc = require('../../swagger.json');

/**
 * Initialize API Documentation
 * @param app 
 */
export const initializeApiDoc = (app: Application) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};