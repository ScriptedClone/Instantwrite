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
 * Finds all document node and stores it as value paired
 * with document name as key. 
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
 * @param {} docName 
 * @returns 
 */
function createTextNode(docName) { // change to createDocNode

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
function deleteTextNode(nodeId, btnType) {
    
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

// REMEMBER TO CHANGE UPDATE TREE 
/**
 * Creates a new textNode on selected folder and replaces old tree
 * with a new tree object.
 * 
 * @param {*} folderName 
 * @returns 
 */
function updateTree(folderName) {
    treeNodeMap[folderName].content = [...treeNodeMap[folderName].content, createTextNode()]
    const newTree = {content:[...tree.content]}

    populateMap(newTree.content);
    
    return newTree
}




export { tree, treeNodeMap, deleteTextNode, syncFileTreeToDisk, updateTree }