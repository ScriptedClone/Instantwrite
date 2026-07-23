/**
 * Copies contents of tree and returns it as a new object.
 * @param {*} tree 
 * @returns 
 */
function copyTree(tree) {
    const newTree = {};
    for (const key of Object.keys(tree)) {
        newTree[key] = [...tree[key]];
    }
    return newTree;
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
 * The folder's id entry is also deleted on the tree.
 * 
 * @param {*} folderId folder unique identifier.
 * @param {*} tree A hashmap that uses folder id as key and an array of its children's id as value.
 */
function deleteFolder(folderId, tree, nodeMap) {
    const folderChildren = tree[folderId]

    // delete children in nodemap
    for(let i = 0; i < folderChildren.length; i++) {
        const childId = folderChildren[i]
        
        if(nodeMap[childId].type === "folder") deleteFolder(childId, tree, nodeMap)
            
        delete nodeMap[childId];
    }

    delete nodeMap[folderId]; // delete the folder's id entry in node map.
    delete tree[folderId]; // delete the folder's id entry in tree.
}

/**
 * Checks if target node is descendant of source. This is used as
 * an accept condition for sortable node components.
 * @param {*} sourceId is the id of the node being dragged.
 * @param {*} nodeId is the id of the node target destination. 
 * @returns true if nodeId is a descendant. 
 */
function isNodeDescendant(sourceId, nodeId, tree, nodeMap) {
    const children = tree[sourceId];

    for(let i = 0; i < children.length; i++) {
        const node = nodeMap[children[i]];
        
        if(node.type === "folder" && sourceId !== node.id) {
            if(isNodeDescendant(node.id, nodeId, tree, nodeMap)) {
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
function addDocumentNode(folderId, tree, nodeMap) {
    const newTree = copyTree(tree)

    newTree[folderId] = [...newTree[folderId], createDocNode(undefined, nodeMap)]
    
    return newTree;
}

/**
 * Add folder node inside a folder using its id and updates list 
 * of folder keys inside tree.
 * @param {*} folderId is the id of the folder to add a new folder.
 */
function addFolderNode(folderId, tree, nodeMap) {
    const node = createFolderNode(undefined, nodeMap);
    let newTree = copyTree(tree);

    newTree[folderId] = [...newTree[folderId], node.id]
    newTree = {...newTree, [node.id]: []}

    return newTree;
}



/**
 * Deletes node using id in tree and nodemap.
 * 
 * @param {*} nodeId Node unique identifier. Can be of type folder or text.
 * @param {*} tree A hashmap that uses folder id as key and an array of its children's id as value.
 * @returns a new tree object with deleted node.
 */
function deleteNode(nodeId, tree, nodeMap) {
    const newTree = copyTree(tree); 
    const node = nodeMap[nodeId]

    if(node.type === "folder") {
        deleteFolder(nodeId, newTree, nodeMap)
    }

    if (node.type === "text") {
        delete nodeMap[nodeId];
    }

    // find and remove where node lives as child.
    const keys = Object.keys(newTree);
    let i = 0;
    let j = 0;
    let key;
    while(i < keys.length) {
        key = keys[i]
        while(j < newTree[key].length) {
            if(newTree[key][j] === nodeId) {
                newTree[key] = newTree[key].filter((nodeid) => {
                    return nodeid !== nodeId;
                })
                return newTree;
            }
            
            j++;
        }   

        j = 0;
        i++;
    }
} 

/**
 * Renames node using its id in nodemap. Returns a new
 * tree reference for React.
 * 
 * @param {*} newName is the value for the node's new name.
 * @param {*} nodeId id of the node being renamed.
 * @param {*} tree A hashmap that uses folder id as key and an array of its children's id as value.
 * @returns a new tree object.
 */
function renameNode(newName, nodeId, tree, nodeMap) {
    const newTree = copyTree(tree);
    nodeMap[nodeId].name = newName;

    return newTree;
}

/**
 * Moves a node within a folder or to a new folder.
 * 
 * @param {*} initialIndex node id index inside initial folder.
 * @param {*} initialGroup initial folder group.
 * @param {*} index new index of node id.
 * @param {*} group new folder group.
 * @param {*} id the node being moved.
 * @param {*} tree map of folders and its children.
 */
function moveNode(initialIndex, initialGroup, index, group, id, tree) {
    let newTree = copyTree(tree);

    if(initialGroup === group) {
        if(index < initialIndex) {
            newTree[group] = newTree[group].toSpliced(index, 0, id);
            newTree[group] = newTree[group].toSpliced(initialIndex + 1, 1);
            return newTree;
        } else {
            newTree[group] = newTree[group].toSpliced(index + 1, 0, id);
            newTree[group] = newTree[group].toSpliced(initialIndex, 1);
            return newTree;
        }
    } else {
        newTree[initialGroup] = newTree[initialGroup].toSpliced(initialIndex, 1);
        newTree[group] = newTree[group].toSpliced(index, 0, id);
        return newTree
    }
}

export { moveNode,
         renameNode,
         deleteNode, 
         addDocumentNode, 
         addFolderNode, 
         isNodeDescendant}
