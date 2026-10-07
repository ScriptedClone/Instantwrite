/**
 * This is for errors that are thrown on purpose for the front-end.
 * 
 * Never pass messages from the database or other libraries; put the 
 * original error in `cause` so it is logged instead.
 *
 * @param {string} message The message sent to the front-end.
 * @param {number} status The HTTP status code.
 * @param {Error} [cause] The original error, logged but never sent.
 */
export class AppError extends Error {
    constructor(message, status, cause) {
        super(message, { cause });
        this.status = status;
    }
}
