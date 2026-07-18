import { useState, useEffect } from "react";
import { getProject } from "../../../services/api";

export function useTree(projectId) {
    const [ tree, setTree ] = useState()

    useEffect(() => {
        async function getTree() {
            const { tree } = await getProject(projectId)
            setTree(tree);
        }
        getTree()
    },[projectId])

    return {tree, setTree}
}