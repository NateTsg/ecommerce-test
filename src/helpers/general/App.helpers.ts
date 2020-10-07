import logger from '../logger/Winston';
import { initializeSuperAdmin } from './IAM.helpers';

/**
 * Initialize App
 */
export const initializeApp = async () => {
    logger.info("[*] Initializing App ... ");

    try {
        logger.info("[*] Initializing Superadmin ");
        await initializeSuperAdmin();
    }
    catch (error) {
        logger.error("Superadmin initialization failed!");
    }
    
};