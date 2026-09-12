/**
 * Iterates through each node fetched from the database
 * to build folderChildMap and nodeMap to be sent to frontend.
 * 
 * @param {*} rows 
 * @returns 
 */
export function convertRowsToFileMap(rows) {
    const folderChildMap = {}
    const nodeMap = {}

    rows.forEach((row) => {
        if(row.type === 'folder') {
            folderChildMap[row.node_id] = [];

            nodeMap[row.node_id] = {
                id: row.node_id, 
                type: row.type, 
                name: row.name
            }
        }
    })

    rows.forEach((row) => {
        // Skip root folder which has null parent_id
        if(row.parent_id) {
            folderChildMap[row.parent_id][row.index] = row.node_id;
        }
        
        if(row.type === 'document') {
            nodeMap[row.node_id] = {
                id: row.node_id, 
                type: row.type, 
                name: row.name, 
                tiptapContent: row.content
            }
        }

    })

    return { folderChildMap, nodeMap }
}

/**
 * This function extrats project_id and name from data queried
 * from database.
 * 
 * @param {*} rows 
 * @returns 
 */
export function convertProjectsRows(rows){
    const projects = []

    rows.forEach((row) => {
        const id = row.project_id;
        const name = row.name

        projects.push({id, name})
    })

    return projects
}

export function getFolderRoot(nodeMap) {
    const nodes = Object.values(nodeMap);
    
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if(node.name === 'root') return node.id;
    }
}
