import seed from './files.json'

if (!localStorage.getItem("FileTree")) {
    localStorage.setItem("FileTree", JSON.stringify(seed));
}

let tree = JSON.parse(localStorage.getItem("FileTree"));
const treeNodeMap = {};

//const folderNodeMap = {};

/**
 * Finds all document node and stores it as value paired
 * with document name as key. 
 * @param {*} nodes 
 */
function populateMap(nodes) {

    nodes.map((node) => {
        if(node.content !== undefined) {
            populateMap(node.content)
        }
        if(node.type === "text") {
            treeNodeMap[node.name] = node;
        }
        if(node.type === "folder") {
            treeNodeMap[node.name] = node;
        }
    })
}

/*
function populateFolderMap(nodes) {
    nodes.map((node) => {
        if(node.content !== undefined) {
            populateMap(node.content)
        }
        if(node.type === "folder") {
            console.log(node.name);
            folderNodeMap[node.name] = node;
        }
    })
}
*/

/**
 * Overwrites file tree on disk with file tree in memory.  
 */
function syncFileTreeToDisk() {
    //console.log(tree);
    localStorage.setItem("FileTree", JSON.stringify(tree));
}

/**
 * Creates a text node.
 * @param {} docName 
 * @returns 
 */
function createTextNode(docName) {

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
 * Creates a new file tree with a new text document and overwrites
 * old file tree. 
 * 
 * to-do:
 * - get currently selected folder reference
 * - add new textnode to its content array.
 * @param {*} docName 
 */
function updateTree() {
    const newTree = {type:"folder", 
                     content:[...tree.content, createTextNode()]}
    tree = newTree;

    populateMap(newTree.content);

    return newTree
}


if(!treeNodeMap.content) {
    populateMap(tree.content);
}

export { tree, treeNodeMap, syncFileTreeToDisk, updateTree }