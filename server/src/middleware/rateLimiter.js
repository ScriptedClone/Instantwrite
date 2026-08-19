import rateLimit from 'express-rate-limit';
import { ONE_MINUTE, TEN_MINUTES, ONE_HOUR } from '../const/windowMs.js';


/** Prevent creation of too many accounts. */
export const createUserLimit = rateLimit({
    windowMs: ONE_HOUR,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many accounts created from this IP, please try again later' },
});

/** Prevent excessive session check. */
export const checkSessionLimit = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false, 
    message: { message: 'Too many requests, please try again later' },
});

/** Prevent bruteforce attacks on login. */
export const createSessionLimit = rateLimit({
    windowMs: TEN_MINUTES,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, 
    message: { message: 'Too many login attempts, please try again later' },
});

/** Prevent logout endpoint abuse. Limited to 20 per minute. */
export const deleteSessionLimit = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Limit project read to 120 per minute. */
export const getProjectLimit = rateLimit({
    windowMs: ONE_MINUTE, 
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Limit user projects read to 120 per minute. */
export const getProjectsLimit = rateLimit({
    windowMs:ONE_MINUTE,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Limit project create/delete/rename to 25 per minute. */
export const writeProjectLimit = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 25,
    standardHeaders: true,
    legacyHeaders: false,
});

/** Limit project save/put requests to 60 per minute. */
export const saveProjectLimit = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

//** Limit chat completion requests to 10 per minute */
export const llmChatLimit = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages sent, please slow down' },
});

/** Limit chat summary requests to groq to 5 per minute */
export const llmSummaryLimiter = rateLimit({
    windowMs: ONE_MINUTE,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many messages sent, please slow down' },
});

//** Limit rewrite requests to groq 15 per minute*/
export const llmRewriteLimit = rateLimit({
    windowMs: ONE_MINUTE, 
    limit: 15, 
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many rewrite requests, please slow down' },
});
