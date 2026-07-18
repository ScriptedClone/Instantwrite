import { convertRowsToFileTree } from '../helpers/treeHelpers.js'
import { Pool } from 'pg'

const db = new Pool({ connectionString: process.env.DATABASE_URL})

export async function getProject(id) {
    const project = await db.query(`
        SELECT * FROM node
        WHERE tree_id = $1`, 
        [id]
    )
    return convertRowsToFileTree(project.rows);
}