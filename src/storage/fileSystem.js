import {nodeMapSeed, treeSeed} from './seed'

/**
 * Seed local storage.
 */
if (!localStorage.getItem("tree") && !localStorage.getItem("nodeMap")) {
    localStorage.setItem("tree", JSON.stringify(treeSeed));
    localStorage.setItem("nodeMap", JSON.stringify(nodeMapSeed))
}

/**
 * Stores each node in tree on a map.
 * 
 * node properties:
 * - id: STRING node identifier
 * - type: STRING text / folder
 * - name: STRING displayed name
 * - tiptapContent: OBJECT in tiptap format.
*/
let nodeMap = JSON.parse(localStorage.getItem("nodeMap"));

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
 * Writes tree and nodemap on local storage.
 * @param {*} tree
 */
function syncFileTreeToDisk(tree) {
    localStorage.setItem("tree", JSON.stringify(tree));
    localStorage.setItem("nodeMap", JSON.stringify(nodeMap));
}


/**
 * Checks if target node is descendant of source. This is used as
 * an accept condition for sortable node components.
 * @param {*} sourceId is the id of the node being dragged.
 * @param {*} nodeId is the id of the node target destination. 
 * @returns true if nodeId is a descendant. 
 */
function isNodeDescendant(sourceId, nodeId, tree) {
    const children = tree[sourceId];

    for(let i = 0; i < children.length; i++) {
        const node = nodeMap[children[i]];
        
        if(node.type === "folder") {

            // This recursion returns true if any node of a nested
            // folder is a descendant of source.
            if(isNodeDescendant(node.id, nodeId, tree)) {
                return true
            }
        }

        if(children[i] === nodeId) {
            return true;
        }
    }

    return false
}

/**
 * Creates document node and updates nodemap.
 * @param {*} name optional argument to set document name.
 * @returns id of created node.
 */
function createDocNode(name) {
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

    nodeMap = {...nodeMap, [node.id]:node}
    return node.id
}

/**
 * Creates a folder node and updates nodemap
 * @param {*} name optional argument to set folder name.
 * @returns folder node.
 */
function createFolderNode(name) {
    const node = {
        id: crypto.randomUUID(),
        type: "folder",
        name: (name)? name : "New folder"
    }

    nodeMap = {...nodeMap, [node.id]:node}
    return node
}

/**
 * Add document node inside a folder using its id.
 * @param {*} folderId is the id of the folder to add a new document.
 */
function addDocumentNode(folderId, tree) {
    const newTree = copyTree(tree)

    newTree[folderId] = [...newTree[folderId], createDocNode()]
    
    return newTree;
}

/**
 * Add folder node inside a folder using its id and updates list 
 * of folder keys inside tree.
 * @param {*} folderId is the id of the folder to add a new folder.
 */
function addFolderNode(folderId, tree) {
    const node = createFolderNode();
    let newTree = copyTree(tree);

    newTree[folderId] = [...newTree[folderId], node.id]
    newTree = {...newTree, [node.id]: []}

    return newTree;
}

/**
 * TO-DO: if a folder is deleted, i need to delete all of its
 * children as on nodemap. On tree, its id must be deleted on 
 * its parent array. Its key must also be deleted.
 * 
 * Deletes node using id in tree.
 * @param {*} nodeId is id of the node that you pass
 * @param {*} tree the tree object that holds a map to each folder node and its children
 * @returns a new tree object with deleted node.
 */
function deleteNode(nodeId, tree) {
    const keys = Object.keys(tree);
    const newTree = copyTree(tree);

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
                console.log(nodeMap[nodeId]);
                delete nodeMap[nodeId];
                return newTree;;
            }

            j++;
        }   

        j = 0;
        i++;
    }
}

/**
 * Renames node using id in tree.
 * 
 * @param {*} newName is the value for the node's new name.
 * @param {*} nodeId id of the node being renamed.
 * @param {*} tree the tree object that holds a map to each folder node and its children
 * @returns a new tree object with the renamed node.
 */
function renameNode(newName, nodeId, tree) {
    const newTree = copyTree(tree);
    nodeMap[nodeId].name = newName;

    return newTree;
}

export { nodeMap,
         renameNode,
         deleteNode, 
         addDocumentNode, 
         addFolderNode, 
         syncFileTreeToDisk,
         isNodeDescendant}