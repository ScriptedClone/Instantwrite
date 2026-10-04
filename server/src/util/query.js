import { db } from "../config/database.js";

/**
 * A helper function to send generic error messages
 * to front-end.
 * 
 * @param {*} message The message to send to frontend.
 * @param {*} status The error code to send to frontend.
 * @returns 
 */
function genericError(message, status)
{
    const error = new Error(message);
    error.status = status;
    return error;
}

/**
 * A wrapper for the database instance's query methods.
 * 
 * Used to catch errors that come from the database to only expose
 * generic messages to the front-end. 

 * @param {Object} queryConfig Is an object that contains text, and values property.
 * @param {string} queryConfig.text The query string. 
 * @param {Array} [queryConfig.values] Array Placeholder values in order. Omit if query has none.
 *
 * @returns result object from the database.
 * @throws {Error} database failure is logged and generic message is sent to frontend.
 */
export async function databaseQuery(queryConfig) 
{   
    try 
    {
        return await db.query(queryConfig);
    } 
    catch(dbError)
    {
        console.error(dbError);
        throw genericError('Service temporarily unavailable. Please try again.', 500)
    }
}

/**
 * A wrapper that runs a group of queries as one database transaction.
 *
 * Checks out a connection, runs BEGIN, calls the given function, then runs
 * COMMIT. If anything throws, the transaction is rolled back. The connection
 * is always released, and discarded if the rollback itself fails.
 *
 * Errors a service throws on purpose (those with a status) are rethrown
 * unchanged. Database errors and unexpected errors are logged and replaced
 * with a generic error, so only generic messages reach the front-end.
 *
 * @param {Function} transaction
 *        An async function that receives the checked-out client and runs the
 *        transaction's queries with client.query({ text, values }).
 *        Whatever it returns becomes the result of transactionQuery.
 * @returns Result from the database.
 * @throws {Error} The service's own error if it has a status; a 503 error if
 *         no connection could be obtained; otherwise a generic 500 error.
 */
export async function transactionQuery(transaction) 
{
    let client;
    let discardClient = false;

    try
    {
        client = await db.connect();
    }
    catch(error)
    {
        console.error(error);
        throw genericError("Service unavailable, please try again", 503);
    }
    
    try
    {

        await client.query('BEGIN');
        const result = await transaction(client);
        await client.query('COMMIT');

        return result;
    }
    catch (error) 
    {
        try
        {
            await client.query('ROLLBACK');
        }
        catch (rollbackError)
        {
            console.error('ROLLBACK failed:', rollbackError);
            discardClient = true;
        }

        // Checks for errors thrown by services on purpose.
        if (error.status) throw error;

        // Logs pg errors or  unexpected JS errors.
        console.error(error);

        throw genericError('An error occurred. Please try again.', 500);
    } 
    finally
    {
        client.release(discardClient);
    }
}

