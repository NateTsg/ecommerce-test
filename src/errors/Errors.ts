import moment from 'moment';

import Messages from './Messages';

export class Error {
    payload: any;
    statusCode: number;

    constructor(statusCode: number, errors: any[]) {
        this.statusCode = statusCode;
        this.payload = {
            timestamp: moment(),
            errors: errors
        }
    }
};

/**
 * Bad Request Error
 */
export class BadRequestError extends Error {
    constructor(errors: any[]) {
        super(400, errors);
    }
};

/**
 * Unauthorized Error
 */
export class UnauthorizedError extends Error {
    constructor(error?: string) {
        super(401, [
            error ? error : Messages.UNAUTHORIZED_ERROR
        ]);
    }
};

/**
 * Forbidden Error
 */
export class ForbiddenError extends Error {
    constructor() {
        super(403, [
            Messages.FORBIDDEN_ERROR
        ]);
    }
};

/**
 * Not Found Error
 */
export class NotFoundError extends Error {
    constructor(error: string) {
        super(404, [
            error
        ]);
    }
};

/**
 * Internal Server Error
 */
export class InternalServerError extends Error {
    constructor(error?: string) {
        super(500, [
            error ? `Internal Server Error: ${error}` : Messages.INTERNAL_SERVER_ERROR
        ]);
    }
};


/**
 * Not Implemented Error
 */
export class NotImplementedError extends Error {
    constructor(error?: string) {
        super(501, [
            error ? `Not Implemented: ${error}` : Messages.NOT_IMPLEMENTED_ERROR
        ]);
    }
};

/**
 * Service Unavailable Error
 */
export class ServiceUnavailableError extends Error {
    constructor(error?: string) {
        super(502, [
            error ? `Service Unavailable: ${error}` : Messages.SERVICE_UNAVAILABLE_ERROR
        ]);
    }
};
