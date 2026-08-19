# Table of Contents

- [Data Structure](#data-structure)
- [Rolling Summarization](#rolling-summarization)
- [Editor Context](#editor-context)
- [Metadata Stripping & Injection process](#metadata-stripping--context-injection)

---

# Data Structure

## User Chat Object

```js
{
    role: "user",
    content: "The user's prompt",
    context: {
        textBefore: "Text before the selection in the same editor node",
        textSelected: "The highlighted text",
        textAfter: "Text after the selection in the same editor node",
        contextBefore: "Text from preceding editor nodes",
        contextAfter: "Text from following editor nodes"
    },
    summary: "A summary of earlier conversation history"
}
```

## Assistant Chat Object

```js
{
    role: "assistant",
    content: "The assistant's response"
}
```

---

# Rolling Summarization

Rolling summarization is triggered when the conversation exceeds the configured character limit.

The character count starts at the latest chat message and moves backward until it reaches:

- Previous user chat object containing a summary metadata, or
- Oldest message in conversation.

The count includes:
- User and assistant message content
- Editor context
- Existing summary metadata.

When summarization is triggered, the selected portion of the conversation is sent to the summarization model. The returned summary is inserted into the latest user chat object as summary metadata.

---

# Editor Context

Context metadata is attached to the user chat object when the user highlights text from the editor panel. The value from the text editor is read by using by using Tiptap library to create tools that can read the editor instance and return useful data. 

The `tiptapEditor.js` utility contains two functions used by the assistant panel:

### `selectionValues(selection)`
- Read selected text on the editor with surrounding paragraph and/or text as context.
- Context is limited by approximately 400 characters in each direction.

### `isPositionEqual(positionA, positionB)`
- compares two editor selection positions to determine whether the selection position has changed.

---

# Metadata Stripping & Context Injection

**Problem**:

User chat objects contain client-side metadata, such as `context` and `summary`, that should not be sent directly to the Groq API as part of the request body.

**Current Solution**: 

Before a conversation is sent to the Groq API, the backend rebuilds the conversation history. It strips the metadata from 
user chat objects and injects it into the corresponding user prompts.This also  allows the client-side chat structure 
to retain the original conversation for display while reducing the amount of conversation history sent to the model through 
rolling summarization.