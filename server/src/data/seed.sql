DROP TABLE IF EXISTS nodes;
DROP TABLE IF EXISTS trees;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sessions;
DROP TYPE IF EXISTS node_type;
CREATE TYPE node_type AS ENUM ('text', 'folder');

CREATE TABLE sessions (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trees(
    tree_id TEXT PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    name TEXT NOT NULL
);


CREATE TABLE nodes(
    node_id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES nodes(node_id) DEFERRABLE INITIALLY DEFERRED, 
    tree_id TEXT REFERENCES trees(tree_id),
    type node_type NOT NULL,
    index SMALLINT,
    name TEXT NOT NULL,
    content JSONB
);

INSERT INTO trees (tree_id, name)
VALUES ('dev1', 'for development');

INSERT INTO nodes (node_id, parent_id, tree_id, type, index, name, content)
VALUES
('0', NULL, 'dev1', 'folder', NULL, 'root', NULL),
('1', '0', 'dev1', 'folder', 0, 'Chapters', NULL),
('2', '1', 'dev1', 'folder', 0, 'Sub chapters', NULL),
('3', '2', 'dev1', 'text', 0, 'chapter1.5', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('4', '1', 'dev1', 'text', 1, 'chapter 1', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('5', '1', 'dev1', 'text', 2, 'chapter 2', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('6', '1', 'dev1', 'text', 3, 'chapter 3', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('7', '0', 'dev1', 'folder', 1, 'Characters', NULL),
('8', '7', 'dev1', 'text', 0, 'Cedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello."}]}]}'::jsonb),
('9', '7', 'dev1', 'text', 1, 'Gedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"First sentence here."}]},{"type":"paragraph","content":[{"type":"text","text":"Second sentence here."}]},{"type":"paragraph","content":[{"type":"text","text":"Third sentence here."}]}]}'::jsonb),
('10', '7', 'dev1', 'text', 2, 'Jedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Have you ever wondered why the sky is blue?"}]}]}'::jsonb),
('11', '7', 'dev1', 'text', 3, 'Bedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('12', '0', 'dev1', 'text', 2, 'Magic System', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('13', '0', 'dev1', 'text', 3, 'Example tiptap file', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"\"What is this?\" Cedric muttered. After scrunching his eyes, the interface still covered his view. He reached out his hand out of instinct and swiped the blue interface away. Afterwards, the interfaced vanished from existence."}]},{"type":"paragraph","content":[{"type":"text","text":"\"Was I seeing things?\""}]},{"type":"paragraph","content":[{"type":"text","text":"Cedric sat up to take a look of his surroundings. The room was dimly lit and ample light seeped through the curtains."}]},{"type":"paragraph","content":[{"type":"text","text":"\"How did I survive?\""}]},{"type":"paragraph","content":[{"type":"text","text":"Cedric vividly remembered that he was cut in half but when he looked down, his body was still intact."}]},{"type":"paragraph","content":[{"type":"text","text":"''Did the saintess revive me?''"}]},{"type":"paragraph","content":[{"type":"text","text":"Although he had never seen it himself, there were rumors that the saintess had the ability to revive a person. That is if the soul hasn''t left its body yet."}]},{"type":"paragraph","content":[{"type":"text","text":"''But why me?''"}]}]}'::jsonb);