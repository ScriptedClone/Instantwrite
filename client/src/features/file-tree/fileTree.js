/**
 * Copies contents of folderChildMap and returns it as a new object. 
 * @param {*} folderChildMap 
 * @returns 
 */
function copyfolderChildMap(folderChildMap) {
    const newfolderChildMap = {};
    for (const key of Object.keys(folderChildMap)) {
        newfolderChildMap[key] = [...folderChildMap[key]];
    }
    return newfolderChildMap;
}

/**
 * Creates document node and updates nodemap.
 * @param {*} name optional argument to set document name.
 * @returns id of created node.
 */
function createDocNode(name, nodeMap) {
    const node = {
        id: crypto.randomUUID(),
        type:"text",
        name: (name)? name : "Untitled",
        tiptapContent: {
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: " "
                        }
                    ]
                }
            ]
        }
    }

    nodeMap[node.id] = node
    return node.id
}

/**
 * Creates a folder node and updates nodemap
 * @param {*} name optional argument to set folder name.
 * @returns folder node.
 */
function createFolderNode(name, nodeMap) {
    const node = {
        id: crypto.randomUUID(),
        type: "folder",
        name: (name)? name : "New folder"
    }

    nodeMap[node.id] = node
    return node
}

/**
 * This is a recursive function that deletes a folder node and 
 * all its descendants in nodemap.
 * 
 * The folder's id entry is also deleted on the folderChildMap.
 * 
 * @param {*} folderId folder unique identifier.
 * @param {*} folderChildMap A hashmap that uses folder id as key and an array of its children's id as value.
 */
function deleteFolder(folderId, folderChildMap, nodeMap) {
    const folderChildren = folderChildMap[folderId]

    // delete children in nodemap
    for(let i = 0; i < folderChildren.length; i++) {
        const childId = folderChildren[i]
        
        if(nodeMap[childId].type === "folder") deleteFolder(childId, folderChildMap, nodeMap)
            
        delete nodeMap[childId];
    }

    delete nodeMap[folderId]; // delete the folder's id entry in node map.
    delete folderChildMap[folderId]; // delete the folder's id entry in folderChildMap.
}

/**
 * Checks if target node is descendant of source. This is used as
 * an accept condition for sortable node components.
 * @param {*} sourceId is the id of the node being dragged.
 * @param {*} nodeId is the id of the node target destination. 
 * @returns true if nodeId is a descendant. 
 */
function isNodeDescendant(sourceId, nodeId, folderChildMap, nodeMap) {
    const children = folderChildMap[sourceId];

    for(let i = 0; i < children.length; i++) {
        const node = nodeMap[children[i]];
        
        if(node.type === "folder" && sourceId !== node.id) {
            if(isNodeDescendant(node.id, nodeId, folderChildMap, nodeMap)) {
                return true
            }
        }

        if(children[i] === nodeId)  return true;
    }

    return false
}

/**
 * Add document node inside a folder using its id.
 * @param {*} folderId is the id of the folder to add a new document.
 */
function addDocumentNode(folderId, folderChildMap, nodeMap) {
    const newfolderChildMap = copyfolderChildMap(folderChildMap)

    newfolderChildMap[folderId] = [...newfolderChildMap[folderId], createDocNode(undefined, nodeMap)]
    
    return newfolderChildMap;
}

/**
 * Add folder node inside a folder using its id and updates list 
 * of folder keys inside folderChildMap.
 * @param {*} folderId is the id of the folder to add a new folder.
 */
function addFolderNode(folderId, folderChildMap, nodeMap) {
    const node = createFolderNode(undefined, nodeMap);
    let newfolderChildMap = copyfolderChildMap(folderChildMap);

    newfolderChildMap[folderId] = [...newfolderChildMap[folderId], node.id]
    newfolderChildMap = {...newfolderChildMap, [node.id]: []}

    return newfolderChildMap;
}



/**
 * Deletes node using id in folderChildMap and nodemap.
 * 
 * @param {*} nodeId Node unique identifier. Can be of type folder or text.
 * @param {*} folderChildMap A hashmap that uses folder id as key and an array of its children's id as value.
 * @returns a new folderChildMap object with deleted node.
 */
function deleteNode(nodeId, folderChildMap, nodeMap) {
    const newfolderChildMap = copyfolderChildMap(folderChildMap); 
    const node = nodeMap[nodeId]

    if(node.type === "folder") {
        deleteFolder(nodeId, newfolderChildMap, nodeMap)
    }

    if (node.type === "text") {
        delete nodeMap[nodeId];
    }

    // find and remove where node lives as child.
    const keys = Object.keys(newfolderChildMap);
    let i = 0;
    let j = 0;
    let key;
    while(i < keys.length) {
        key = keys[i]
        while(j < newfolderChildMap[key].length) {
            if(newfolderChildMap[key][j] === nodeId) {
                newfolderChildMap[key] = newfolderChildMap[key].filter((nodeid) => {
                    return nodeid !== nodeId;
                })
                return newfolderChildMap;
            }
            
            j++;
        }   

        j = 0;
        i++;
    }
} 

/**
 * Renames node using its id in nodemap. Returns a new
 * folderChildMap reference for React.
 * 
 * @param {*} newName is the value for the node's new name.
 * @param {*} nodeId id of the node being renamed.
 * @param {*} folderChildMap A hashmap that uses folder id as key and an array of its children's id as value.
 * @returns a new folderChildMap object.
 */
function renameNode(newName, nodeId, folderChildMap, nodeMap) {
    const newfolderChildMap = copyfolderChildMap(folderChildMap);
    nodeMap[nodeId].name = newName;

    return newfolderChildMap;
}

/**
 * Moves a node within a folder or to a new folder.
 * 
 * @param {*} initialIndex node id index inside initial folder.
 * @param {*} initialGroup initial folder group.
 * @param {*} index new index of node id.
 * @param {*} group new folder group.
 * @param {*} id the node being moved.
 * @param {*} folderChildMap map of folders and its children.
 */
function moveNode(initialIndex, initialGroup, index, group, id, folderChildMap) {
    let newfolderChildMap = copyfolderChildMap(folderChildMap);

    if(initialGroup === group) {
        if(index < initialIndex) {
            newfolderChildMap[group] = newfolderChildMap[group].toSpliced(index, 0, id);
            newfolderChildMap[group] = newfolderChildMap[group].toSpliced(initialIndex + 1, 1);
            return newfolderChildMap;
        } else {
            newfolderChildMap[group] = newfolderChildMap[group].toSpliced(index + 1, 0, id);
            newfolderChildMap[group] = newfolderChildMap[group].toSpliced(initialIndex, 1);
            return newfolderChildMap;
        }
    } else {
        newfolderChildMap[initialGroup] = newfolderChildMap[initialGroup].toSpliced(initialIndex, 1);
        newfolderChildMap[group] = newfolderChildMap[group].toSpliced(index, 0, id);
        return newfolderChildMap
    }
}

function getFolderRoot(nodeMap) {
    const nodes = Object.values(nodeMap);
    
    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if(node.name === 'root') return node.id;
    }
}

export { moveNode,
         renameNode,
         deleteNode, 
         addDocumentNode, 
         addFolderNode, 
         isNodeDescendant,
         getFolderRoot}
