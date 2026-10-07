import { AppError } from '../util/AppError.js';

/**
 * Errors thrown on purpose (AppError) send their message to the front-end.
 * Anything else (database errors, library errors, bugs) is logged and
 * replaced with a generic message.
 */
export function errorHandler(error, req, res, next) {
    if (error instanceof AppError) {
        if (error.status >= 500) console.error(error);
        return res.status(error.status).json({ message: error.message });
    }

    console.error(error);
    res.status(error.status ?? 500).json({ message: 'Something went wrong. Please try again.' });
}
