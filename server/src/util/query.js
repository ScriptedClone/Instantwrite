import { db } from "../config/database.js";

/**
 * A wrapper that runs a group of queries as one database transaction.
 *
 * Checks out a connection, runs BEGIN, calls the given function, then runs
 * COMMIT. If anything throws, the transaction is rolled back and the error
 * is rethrown. The connection is always released, and discarded if the
 * rollback itself fails.
 *
 * @param {Function} transaction
 *        An async function that receives the checked-out client and runs the
 *        transaction's queries with client.query(text, values).
 *        Whatever it returns becomes the result of transactionQuery.
 * @returns Result of the transaction function.
 */
export async function transactionQuery(transaction)
{
    const client = await db.connect();
    let discardClient = false;

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

        throw error;
    }
    finally
    {
        client.release(discardClient);
    }
}
