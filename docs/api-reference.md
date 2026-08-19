# REST Endpoints

## Project Routes

All project routes require an **authenticated** session.

### `GET /api/v1/project/:id`

Fetches project nodes in a hashmap(nodeMap, folderChildMap) owned by user.

For examples of `nodeMap` and `folderChildMap`, refer to [Example Project Map](./example-project-map.md).

**URL Parameters**

| Parameter | Type | Example |
| --- | --- | --- |
| `id` | UUID string | `00000000-0000-0000-0000-000000000000` |

**Request Body** None

**Response Body**

```json
{
  "message": "project found from database",
  "folderChildMap": {
    "<rootFolderId>": ["<childNodeId>"],
    "<folderId>": ["<childNodeId>"]
  },
  "nodeMap": {
    "<nodeId>": {
      "id": "<nodeId>",
      "type": "document",
      "name": "Chapter 1",
      "tiptapContent": {
        "type": "doc",
        "content": []
      }
    }
  }
}
```

### `GET /api/v1/project`

Fetches all projects owned by user.

**Request Body** None

**Response Body**

```json
[
  {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "Untitled Project"
  },
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "name": "Fantasy Novel"
  }
]
```

### `POST /api/v1/project`

Creates a new project owned user.

**Request Body**

```json
{
  "projectName": "Fantasy Novel"
}
```

**Response Body**

```json
{
  "message": "project created succesfully",
  "project": {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "Fantasy Novel"
  }
}
```

### `DELETE /api/v1/project/:id`

Deletes a project owned by user.

**URL Parameters**

| Parameter | Type | Example |
| --- | --- | --- |
| `id` | UUID string | `00000000-0000-0000-0000-000000000000` |

**Request Body** None

**Response Body**

```json
{
  "message": "project deleted successfully"
}
```

### `PATCH /api/v1/project/:id`

Renames a project owned by user.

**URL Parameters**

| Parameter | Type | Example |
| --- | --- | --- |
| `id` | UUID string | `00000000-0000-0000-0000-000000000000` |

**Request Body**

```json
{
  "projectName": "New Project Name"
}
```

**Response Body**

```json
{
  "message": "project renamed succesfully"
}
```

### `PUT /api/v1/project/:id`

Saves the full file-tree and document state for a project owned by user.

For a full request body example, refer to [ExampleProjectFileMap](./example-project-map.md).

**URL Parameters**

| Parameter | Type | Example |
| --- | --- | --- |
| `id` | UUID string | `00000000-0000-0000-0000-000000000000` |

**Request Body**

```json
{
  "folderChildMap": {
    "<rootFolderId>": ["<childNodeId>"],
    "<folderId>": ["<childNodeId>"]
  },
  "nodeMap": {
    "<nodeId>": {
      "id": "<nodeId>",
      "type": "document",
      "name": "Chapter 1",
      "tiptapContent": {
        "type": "doc",
        "content": []
      }
    }
  }
}
```

**Response Body**

```json
{
  "message": "project saved succesfully"
}
```

## Authentication Routes

### `POST /api/v1/users`

Creates a new user account and starts an authenticated session.

**Request Body**

```json
{
  "username": "tracee",
  "email": "tracee@example.com",
  "password": "password123"
}
```

**Response Body**

```json
{
  "message": "signup success"
}
```

### `POST /api/v1/sessions`

Creates a new authenticated session for an existing user.

**Request Body**

```json
{
  "email": "tracee@example.com",
  "password": "password123"
}
```

**Response Body**

```json
{
  "message": "login successful"
}
```

### `DELETE /api/v1/sessions`

Deletes the current authenticated session.

**Request Body:** None

**Response Body**

```json
{
  "message": "session deleted"
}
```

---

# RPC Endpoints

## LLM Routes

All LLM routes require an **authenticated** session.

### `POST /api/v1/llm/chat`

Generates an assistant chat response from the provided chat history.

**Request Body**

```json
[
  {
    "role": "user",
    "content": "How can I make this opening chapter stronger?"
  },
  {
    "role": "assistant",
    "content": "You could strengthen the opening by clarifying the character's goal."
  },
  {
    "role": "user",
    "content": "Can you suggest a better hook?",
    "context": {
      "textBefore": "Optional editor text before the selection.",
      "textSelected": "Selected editor text.",
      "textAfter": "Optional editor text after the selection.",
      "contextBefore": "Larger editor context before the selection.",
      "contextAfter": "Larger editor context after the selection."
    }
  }
]
```

**Response Body**

```json
"Generated assistant response text."
```

### `POST /api/v1/llm/summarize`

Generates a summary of the provided chat history.

**Request Body**

```json
[
  {
    "role": "user",
    "content": "Can you help me plan this scene?"
  },
  {
    "role": "assistant",
    "content": "This scene could focus on the conflict between the protagonist and mentor."
  }
]
```

**Response Body**

```json
"Generated conversation summary text."
```

### `POST /api/v1/llm/rewrite`

Generates a rewrite of selected editor text using the selected style and tone.

**Request Body**

```json
{
  "settings": {
    "style": "Descriptive",
    "tone": "Mysterious"
  },
  "selection": {
    "textBefore": "Optional editor text before the selection.",
    "textSelected": "The selected passage to rewrite.",
    "textAfter": "Optional editor text after the selection.",
    "contextBefore": "Larger editor context before the selection.",
    "contextAfter": "Larger editor context after the selection."
  }
}
```

**Response Body**

```json
"Generated rewritten passage."
```
