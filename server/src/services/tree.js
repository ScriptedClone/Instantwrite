import { convertProjectsRows, convertRowsToFileTree, getFolderRoot } from '../helpers/treeHelpers.js'
import { db } from '../config/database.js'

export async function getProject(id) {
    const project = await db.query(`
        SELECT * FROM nodes
        WHERE tree_id = $1`, 
        [id]
    )
    return convertRowsToFileTree(project.rows);
}

export async function getProjects(userId){
    const projects = await db.query(`
        SELECT * FROM trees
        WHERE user_id = $1`,
        [userId]
    )

    return convertProjectsRows(projects.rows)
}

export async function putProject(treeId, tree, nodeMap) {
    const client = await db.connect();
    const rootId = getFolderRoot(nodeMap);

    try {
        await client.query('BEGIN');
        await client.query(`DELETE FROM nodes WHERE tree_id = $1`, [treeId]);
        await client.query(`INSERT INTO nodes (node_id, parent_id, tree_id, index, type, name, content)
                            VALUES($1, null, $2, null, 'folder', 'root', null)`, [rootId, treeId]);
         
        for(const [parentId, childrenId] of Object.entries(tree)) {
            for(const [index, childId] of childrenId.entries()){
                await client.query(`INSERT INTO nodes (node_id, parent_id, tree_id, index, type, name, content)
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

export async function createProject(name, userId){
    const client = await db.connect();
    let res;
    let id;

    try {
        await client.query('BEGIN');
        res = await client.query(`
                INSERT INTO trees(user_id, name)
                values($1, $2)
                RETURNING tree_id`,
                [userId, name]
        )

        id = res.rows[0].tree_id;
        await client.query(`
            INSERT INTO nodes (node_id, parent_id, tree_id, type, index, name, content)
            VALUES (gen_random_uuid(), NULL, $1, 'folder', NULL, 'root', NULL)`,
            [id]
        )
         
        await client.query('COMMIT');
        return { id, name };
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteProject(id, userId) {
    const client = await db.connect();
    console.log(userId)
    try {
        await client.query('BEGIN');

        await client.query(`
            DELETE FROM nodes 
            WHERE tree_id = $1`, 
            [id]
        );
        await client.query(`
            DELETE FROM trees 
            WHERE tree_id = $1 
            AND user_id = $2`, 
            [id, userId]
        );

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}