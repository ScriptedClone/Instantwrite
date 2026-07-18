import { convertRowsToFileTree } from '../helpers/treeHelpers.js'
import { db } from '../const/DBconnection.js'

export async function getProject(id) {
    const project = await db.query(`
        SELECT * FROM node
        WHERE tree_id = $1`, 
        [id]
    )
    return convertRowsToFileTree(project.rows);
}

export async function putProject(treeId, tree, nodeMap) {
    const client = await db.connect();

    try {
        await client.query('BEGIN');
        await client.query(`DELETE FROM node WHERE tree_id = $1`, [treeId]);
        await client.query(`INSERT INTO node (node_id, parent_id, tree_id, index, type, name, content)
                            VALUES(0, null, $1, null, 'folder', 'root', null)`, [treeId]);
         
        for(const [parentId, childrenId] of Object.entries(tree)) {
            for(const [index, childId] of childrenId.entries()){
                await client.query(`INSERT INTO node (node_id, parent_id, tree_id, index, type, name, content)
                                    VALUES($1, $2, $3, $4, $5, $6, $7)`,[childId, 
                                                                         parentId, 
                                                                         treeId, 
                                                                         index, 
                                                                         nodeMap[childId].type,
                                                                         nodeMap[childId].name, 
                                                                         nodeMap[childId].tiptapContent ?? null])
            }
        }
        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}