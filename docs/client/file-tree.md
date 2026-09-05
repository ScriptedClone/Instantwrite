# Table of Contents

- [Data Model](#data-model)
- [Data Structure](#data-structure)
- [Component Structure and Responsibilities](#component-structure-and-responsibilities)

# Data Model
The file-tree is designed using hierarchical tree data structure to 
represent a a project and its nodes. Each node is either a document or a folder.

A document contains tiptap JSON document while a folder act as parent to group
sibling nodes.

# Data Structure
The file-tree is implemented by combining two hash-maps, nodeMap and folderChildMap.

## `nodeMap` 
- Provide 0(1) node lookup. 
- Store properties of every folder and document.
- Hold mutable node data updated by file-tree actions.

## `folderChildMap`
- Store id of child nodes for each folder.
- Determine display order of siblings.
- Used for recursive tree traversal in [fileTree.js](../../client/src/features/file-tree/fileTree.js)

see [ExampleProjectMap](../example-project-map.md) for examples.

# Component Structure and Responsibilities

**FileTreePanel -> FileTree -> FolderChildren (recursive) -> Folder/Document**

## FileTreePanel
- Owns FileTree state and actions. 
- Provides contexts to children components.
- Bridge FileTreeHeader actions to FileTree state.
- Wrap FileTree component with DragDropProvider from DND-kit for drag and drop feature.

## FileTree
- Render root folder and descendants.
- Additional root folder functionality.

## FolderChildren
- A two-step recursive component to render the file-tree and its nested lists.

## Folder
- Renders a folder node.
- When expanded, triggers the second step to for FolderChildren to finish its two-step recursion.

## Document
- Render document node and allow user to select it for editing. 


