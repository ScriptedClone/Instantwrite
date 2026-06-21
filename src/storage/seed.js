//folderTree
export const treeSeed = {
  "0": ["1", "7", "12", "13"],
  "1": ["2", "4", "5", "6"],
  "2": ["3"],
  "7": ["8", "9", "10", "11"]
}

//nodemap
export const nodeMapSeed = {
  "0": { id: "0", type: "folder", name: "root" },
  "1": { id: "1", type: "folder", name: "Chapters" },
  "2": { id: "2", type: "folder", name: "Sub chapters" },
  "3": {
    id: "3",
    type: "text",
    name: "chapter1.5",
    tiptapContent: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "The quick brown fox jumps over the lazy dog." }]
        }
      ]
    }
  },
  "4": {
    id: "4",
    type: "text",
    name: "chapter 1",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "This is the first paragraph." }] },
        { type: "paragraph", content: [{ type: "text", text: "This is the second paragraph." }] }
      ]
    }
  },
  "5": {
    id: "5",
    type: "text",
    name: "chapter 2",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "The quick brown fox jumps over the lazy dog." }] }
      ]
    }
  },
  "6": {
    id: "6",
    type: "text",
    name: "chapter 3",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "This is the first paragraph." }] },
        { type: "paragraph", content: [{ type: "text", text: "This is the second paragraph." }] }
      ]
    }
  },
  "7": { id: "7", type: "folder", name: "Characters" },
  "8": {
    id: "8",
    type: "text",
    name: "Cedric",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Hello." }] }
      ]
    }
  },
  "9": {
    id: "9",
    type: "text",
    name: "Gedric",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "First sentence here." }] },
        { type: "paragraph", content: [{ type: "text", text: "Second sentence here." }] },
        { type: "paragraph", content: [{ type: "text", text: "Third sentence here." }] }
      ]
    }
  },
  "10": {
    id: "10",
    type: "text",
    name: "Jedric",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "Have you ever wondered why the sky is blue?" }] }
      ]
    }
  },
  "11": {
    id: "11",
    type: "text",
    name: "Bedric",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "This is the first paragraph." }] },
        { type: "paragraph", content: [{ type: "text", text: "This is the second paragraph." }] }
      ]
    }
  },
  "12": {
    id: "12",
    type: "text",
    name: "Magic System",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "The quick brown fox jumps over the lazy dog." }] }
      ]
    }
  },
  "13": {
    id: "13",
    type: "text",
    name: "Example tiptap file",
    tiptapContent: {
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "\"What is this?\" Cedric muttered. After scrunching his eyes, the interface still covered his view. He reached out his hand out of instinct and swiped the blue interface away. Afterwards, the interfaced vanished from existence." }] },
        { type: "paragraph", content: [{ type: "text", text: "\"Was I seeing things?\"" }] },
        { type: "paragraph", content: [{ type: "text", text: "Cedric sat up to take a look of his surroundings. The room was dimly lit and ample light seeped through the curtains." }] },
        { type: "paragraph", content: [{ type: "text", text: "\"How did I survive?\"" }] },
        { type: "paragraph", content: [{ type: "text", text: "Cedric vividly remembered that he was cut in half but when he looked down, his body was still intact." }] },
        { type: "paragraph", content: [{ type: "text", text: "'Did the saintess revive me?'" }] },
        { type: "paragraph", content: [{ type: "text", text: "Although he had never seen it himself, there were rumors that the saintess had the ability to revive a person. That is if the soul hasn't left its body yet." }] },
        { type: "paragraph", content: [{ type: "text", text: "'But why me?'" }] }
      ]
    }
  }
}
