// FUNCTIONALITIES TO DO
// - Abstract Storage system
// - instantiator for the file tree
// - getter for the file tree
// - setter for the file tree
// 
// - local storage is simulated disk before migrating to Electron file system.
import seed from './files.json'
localStorage.setItem("FileTree", JSON.stringify(seed));

const tree = JSON.parse(localStorage.getItem("FileTree"));
const documentMap = {};

/**
 * Finds all document node and stores it as value paired
 * with document name as key. 
 * @param {*} nodes 
 */
function populateDocMap(nodes) {

    nodes.map((node) => {
        if(node.content !== undefined) {
            populateDocMap(node.content)
        }
        if(node.type === "text") {
            documentMap[node.name] = node.tiptapContent;
        }
    })
}

populateDocMap(tree.content);

export { tree, documentMap }