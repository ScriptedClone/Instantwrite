export function selectionValues(selection) {
    if(!selection) return;
    const { from, to } = selection;
    const anchor = selection.$anchor
    const doc = anchor.doc
    const index = anchor.index(0);

    const textBefore = doc.textBetween(anchor.start(), from, " ");
    const textSelected = doc.textBetween(from, to, ' ')
    const textAfter = doc.textBetween(to, anchor.end(), " ");

    let contextBefore = ""
    let contextAfter = ""
    let contextSizeBef = 0;
    let contextSizeAft = 0

    for(let i = index - 1; i >= 0; i--) {
        if(contextSizeBef > 400) break;

        const node = doc.child(i)
        contextBefore = node.textContent + "\n" + contextBefore;
        contextSizeBef += node.nodeSize;
        
        
    }

    for(let i = index + 1; i < doc.childCount; i++) {
        if(contextSizeAft > 400) break;
        
        const node = doc.child(i)
        contextAfter += node.textContent + "\n"
        contextSizeAft += node.nodeSize;
    }

    return({
        textBefore,
        textSelected,
        textAfter,
        contextBefore,
        contextAfter,
    })
}

export function isPositionEqual(positionA, positionB) {
    if(positionA.from === positionB.from || positionA.to === positionB.to) return true
    return false;
}