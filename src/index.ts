import config from 'config';

import app from './app';
import logger from './helpers/logger/Winston';

const PORT = process.env.PORT || config.get("app.port");

app.listen(PORT, () => {
    logger.info(`${config.get("name")} Running on port ${PORT}`);
});


export default app;