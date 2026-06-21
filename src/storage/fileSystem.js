import {nodeMapSeed, treeSeed} from './seed'

/** Store node map and folder children on disk*/

/** 
 * This variable stores folder lookup by Id and their children's Id as
 * an array. Each folder must be treated as immutable.
 * 
*/
let folderTree = treeSeed;

/**
 * Stores each node in tree on the map. Each node is mutable. 
*/
let nodeMap = nodeMapSeed;

function copyFolderTree(tree) {
    const newTree = {...tree}
    return newTree;
}

function syncFileTreeToDisk() {
    return null;
}

/**
 * Creates document node and updates nodemap
 * @param {*} name 
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
 * @param {*} name 
 * @returns 
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
 * @param {*} folderId 
 */
function addDocumentNode(folderId) {
    folderTree[folderId] = [...folderTree[folderId], createDocNode()]

    // Create new object reference for React.
    return copyFolderTree(folderTree);
}

/**
 * Add folder node inside a folder using its id
 * @param {*} folderId 
 */
function addFolderNode(folderId) {
    const node = createFolderNode();

    folderTree[folderId] = [...folderTree[folderId], node.id]
    folderTree = {...folderTree, [node.id]: []}

    // Create new object reference for React.
    return copyFolderTree(folderTree);
}

function deleteNode(nodeId) {
    const keys = Object.keys(folderTree)
    let i = 0;
    let j = 0;
    let key;

    while(i < keys.length) {
        key = keys[i]
        
        while(j < folderTree[key].length) {
            if(folderTree[key][j] === nodeId) {
                folderTree[key] = folderTree[key].filter((nodeid) => {
                    return nodeid !== nodeId;
                })

                return copyFolderTree(folderTree);;
            }

            j++;
        }   

        j = 0;
        i++;
    }
}

export { nodeMap, 
         folderTree, 
         deleteNode, 
         addDocumentNode, 
         addFolderNode, 
         syncFileTreeToDisk }