import seed from './files.json'

/**
 * Seeds file tree on disk with placeholder
 */
if (!localStorage.getItem("FileTree")) {
    localStorage.setItem("FileTree", JSON.stringify(seed));
}

/**
 * File tree in memory.
 */
let tree = JSON.parse(localStorage.getItem("FileTree"));

/**
 * Hashmap for node object reference in tree.
 */
const treeNodeMap = {}

if(!treeNodeMap.content) {
    populateMap(tree.content);
}

/**
 * Recursively traverses through file tree and stores each node
 * on the map.
 * @param {*} nodes 
 */
function populateMap(nodes) {
    nodes.forEach((node) => {
        if(node.content !== undefined) {
            populateMap(node.content)
        }
        if(node.type === "text") { 
            treeNodeMap[node.id] = node;
        }
        if(node.type === "folder") {
            treeNodeMap[node.id] = node;
        }
    })

    treeNodeMap[0] = tree;
}

/**
 * Overwrites file tree on disk with file tree in memory.  
 */
function syncFileTreeToDisk() {
    console.log("Files synced")
    localStorage.setItem("FileTree", JSON.stringify(tree));
}

/**
 * Creates a text node.
 * @returns 
 */
function createDocNode() {

    const node =
    {
        id: crypto.randomUUID(),
        type:"text",
        name: "Untitled",
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

    return node;
}

/**
 * Creates a folder node
 * @param {} folderName 
 * @returns 
 */
function createFolderNode(folderName) {

    const node = 
    {
        id: crypto.randomUUID(),
        type: "folder",
        name: "New folder",
        content:[]
    }

    return node;
}

/**
 * Find parent node of passed node within tree.
 * @param {*} nodeId is the child of parent node to find.
 * @param {*} nodes is the tree.
 * @returns parent node Id.
 */
function findParentNodeId(nodeId, nodes) {
    const currentNodeId = nodes.id;
    let parentNodeId;

    let i = 0;
    while((i < nodes.content.length) && !parentNodeId) {
        const node = nodes.content[i]
        if(node.id !== nodeId){
            if(node.content !== undefined) {
                parentNodeId = findParentNodeId(nodeId, node)
            }
        } else {
            return parentNodeId = currentNodeId;
        }
        i++;
    }

    return parentNodeId;
}

/**
 * Deletes a node on file tree and returns a new tree object reference with
 * updated structure.
 * @param {*} nodeId 
 * @param {*} btnType 
 * @returns 
 */
function deleteNode(nodeId, btnType) {
    
    const parentNodeId = findParentNodeId(nodeId, tree);
    console.log(parentNodeId)

    const parentNode = treeNodeMap[parentNodeId];

    parentNode.content = parentNode.content.filter((item) =>{
        return item.id !== nodeId
    })

    console.log(tree);

    const newTree = {content:[...tree.content]}

    populateMap(newTree.content);

    return newTree;

}

/**
 * Create document node in parent folder.
 * @param {*} parentFolderId 
 * @returns new tree object reference      
 */
function addDocumentNode(parentFolderId) {
    treeNodeMap[parentFolderId].content = [...treeNodeMap[parentFolderId].content, createDocNode()]
    const newTree = {content:[...tree.content]}

    populateMap(newTree.content);
    
    return newTree
}

/**
 * Create folder node in parent folder.
 * @param {*} parentFolderid
 * @returns new tree object reference
 */
function addFolderNode(parentFolderid) {
    treeNodeMap[parentFolderid].content = [...treeNodeMap[parentFolderid].content, createFolderNode()]
    const newTree = {content:[...tree.content]}

    populateMap(newTree.content)

    return newTree;
}



export { tree, treeNodeMap, deleteNode, syncFileTreeToDisk, addDocumentNode, addFolderNode }