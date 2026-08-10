import { convertProjectsRows, convertRowsToFileMap, getFolderRoot } from '../helpers/projectHelpers.js'
import { db } from '../config/database.js'

export async function getProject(id) {
    const project = await db.query(`
        SELECT 
            n.node_id,
            n.parent_id,
            n.name,
            n.type,
            n.index,
            n.content
        FROM nodes n
        JOIN projects p
        ON n.project_id = p.project_id
        WHERE p.project_id = $1 
        AND p.user_id = $2`, 
        [projectId, userId]
    )
    return convertRowsToFileMap(project.rows);
}

export async function getProjects(userId){
    const projects = await db.query(`
        SELECT * FROM projects
        WHERE user_id = $1`,
        [userId]
    )

    return convertProjectsRows(projects.rows)
}

export async function putProject(projectId, project, nodeMap) {
    const client = await db.connect();
    const rootId = getFolderRoot(nodeMap);

    try {
        await client.query('BEGIN');
        await client.query(`DELETE FROM nodes WHERE project_id = $1`, [projectId]);
        await client.query(`INSERT INTO nodes (node_id, parent_id, project_id, index, type, name, content)
                            VALUES($1, null, $2, null, 'folder', 'root', null)`, [rootId, projectId]);
         
        for(const [parentId, childrenId] of Object.entries(project)) {
            for(const [index, childId] of childrenId.entries()){
                await client.query(`INSERT INTO nodes (node_id, parent_id, project_id, index, type, name, content)
                                    VALUES($1, $2, $3, $4, $5, $6, $7)`,[childId, 
                                                                         parentId, 
                                                                         projectId, 
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
                INSERT INTO projects(user_id, name)
                values($1, $2)
                RETURNING project_id`,
                [userId, name]
        )

        id = res.rows[0].project_id;
        await client.query(`
            INSERT INTO nodes (node_id, parent_id, project_id, type, index, name, content)
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

    try {
        await client.query('BEGIN');

        await client.query(`
            DELETE FROM nodes 
            WHERE project_id = $1`, 
            [id]
        );
        await client.query(`
            DELETE FROM projects 
            WHERE project_id = $1 
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

export async function renameProject(newName, projectId, userId) {
    const result = await db.query(`
        UPDATE projects
        SET name = $1
        WHERE project_id = $2 
        AND user_id = $3`,
        [newName, projectId, userId]
    )

    if (result.rowCount !== 1) {
        const error = new Error('project not found');
        error.status = 404;
        
        throw error;
    }
}