import { db } from "../config/database";

export async function databaseQuery(queryConfig) 
{   
    try 
    {
        return await db.query(queryConfig);
    } 
    catch(dbError)
    {
        console.error(dbError);
        
        const error = new Error('An error occured. Please try again');
        error.status = 500;

        throw error
    }
}

export async function transactionQuery(transaction) 
{
    const client = await db.connect();

    try
    {
        await client.query('BEGIN');
        return await transaction();
    }
    catch (dbError) 
    {
        console.error(dbError);

        const error = new Error('An error occured. Please try again');
        error.status = 500;

        throw error;
    } 
    finally
    {
        client.release();
    }
}
