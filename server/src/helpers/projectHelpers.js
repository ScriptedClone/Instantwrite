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
        const nodeId = row.node_id

        if(row.type === 'folder') {
            folderChildMap[nodeId] = [];
            nodeMap[nodeId] = {id: nodeId, type: row.type, name: row.name}

            if(row.parent_id) {
                folderChildMap[row.parent_id][row.index] = nodeId;
            }
        }
        if(row.type === 'text') {
           folderChildMap[row.parent_id][row.index] = nodeId;
           nodeMap[nodeId] = {id: nodeId, type: row.type, name: row.name, tiptapContent: row.content}
        }
    })

    return { folderChildMap, nodeMap }
}

/**
 * This function extrats tree_id and name from data queried
 * from database.
 * 
 * @param {*} rows 
 * @returns 
 */
export function convertProjectsRows(rows){
    const projects = []

    rows.forEach((row) => {
        const id = row.tree_id;
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
