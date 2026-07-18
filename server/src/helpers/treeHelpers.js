/**
 * Iterates through each node fetched from the database
 * to build tree and nodeMap to be sent to frontend.
 * 
 * @param {*} rows 
 * @returns 
 */
export function convertRowsToFileTree(rows) {
    const tree = {}
    const nodeMap = {}

    rows.forEach((row) => {
        const nodeId = row.node_id

        if(row.type === 'folder') {
            tree[nodeId] = [];
            nodeMap[nodeId] = {id: nodeId, type: row.type, name: row.name}

            if(row.parent_id) {
                tree[row.parent_id][row.index] = nodeId;
            }
        }
        if(row.type === 'text') {
           tree[row.parent_id][row.index] = nodeId;
           nodeMap[nodeId] = {id: nodeId, type: row.type, name: row.name, tiptapContent: row.content}
        }
    })

    return { tree, nodeMap }
}