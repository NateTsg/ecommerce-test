import cors from 'cors';
import async from 'async';
import helmet from 'helmet';
import morgan from 'morgan';
import moment from 'moment';
import passport from 'passport';
import morganBody from 'morgan-body';
import bodyParser from "body-parser";
import compression from 'compression';
import Prometheus from 'prom-client';
import responseTime from 'response-time';
import express, { Application, Request, Response } from 'express';

import routes from './routers';
import { Error } from './errors/Errors';
import Messages from './errors/Messages';
import logger from './helpers/logger/Winston';
import { initializeApiDoc } from './documentation';
import { ForeignKeyConstraintError } from 'sequelize';
import UserService from './services/iam/User.service';
import { initializeApp } from './helpers/general/App.helpers';
import initializeDB, { User, sequelize } from './helpers/database/Sequelize';
import { PassportLocalStrategy, PassportJWTStrategy } from './helpers/security/Strategy';

/**
 * Initialize Express App
 */
const app: Application = express();

/**
 * Passport Initialization
 */
app.use(passport.initialize());
app.use(passport.session());

passport.use(PassportLocalStrategy);
passport.use(PassportJWTStrategy);

passport.serializeUser((user: User, done: Function) => {
    done(null, user.id);
});

passport.deserializeUser((id: string, done: Function) => {
    UserService.findById(id)
        .then((user: User) => done(null, user))
        .catch((error: any) => done(error));        
});

/**
 * Middleware
 */
app.use(compression());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

/**
 * Morgan Body Logger
 */
morganBody(app, { maxBodyLength: 1000000 });

/**
 * Prometheus Configuration
 */
Prometheus.collectDefaultMetrics();

const PrometheusMetric = {
    requestCounter: new Prometheus.Counter({name: "throughput", help: "Number of requests served."}),
    responseTimeSummary: new Prometheus.Summary({name: "response_time", help: "Latency in Percentiles."}),
    responseTimeHistogram: new Prometheus.Histogram({name: "response_time_histogram", help: "Latency in Histogram.", buckets: [0.1, 0.25, 0.5, 1, 2.5, 5, 10]})
};

/**
 * Request Counter
 */
app.use((request, response, next) => {
    PrometheusMetric.requestCounter.inc();
    next();
});

/**
 * Tracking Response Time
 */
app.use(responseTime((request, response, time) => {
    PrometheusMetric.responseTimeSummary.observe(time);
    PrometheusMetric.responseTimeHistogram.observe(time);
}));

/**
 * Metrics Endpoint
 */
app.get("/metrics", (request, response) => {
    response.end(Prometheus.register.metrics());
});

/**
 * Initialize Database
 */
initializeDB();

/**
 * Initialize Routes
 */
routes(app);

/**
 * Initialize App
 */
initializeApp();

/**
 * Initialize Api Documentation
 */
initializeApiDoc(app);

/**
 * Health Check Endpoint
 */
app.get("/health-check", async (request: Request, response: Response) => {
    const StatusResponse = {
        database: "Inactive"
    };
    async.waterfall([
        (done: Function) => {
            sequelize.authenticate()
                .then(() => {
                    StatusResponse.database = "Active";
                    done();
                })
                .catch(() => {
                    StatusResponse.database = "Inactive";
                    done();
                })
        }
    ], () => {
        response.status(200).json(StatusResponse);
    })
});

/**
 * Global Error Handler
 */
app.use((error: any, request: Request, response: Response, next: Function) => {
    logger.error(error);
    console.log(error);
    if (error instanceof Error) {
        if (error.payload?.errors instanceof ForeignKeyConstraintError) {
            let errors : any = []
            error.payload?.errors.fields.forEach((element : string) => {
                errors.push({
                    field: element,
                    message: error.payload?.errors.table + " not found"
                });
            });
            error.payload.errors = errors;
            response.status(error.statusCode).json(error.payload);

        }
        else {
            response.status(error.statusCode).json(error.payload);
        }
    }
    else {
        response.status(500).json({
            timestamp: moment(),
            errors: [
                Messages.INTERNAL_SERVER_ERROR
            ]
        });
    }
});


export default app;