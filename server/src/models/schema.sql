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
    tree_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(user_id),
    name TEXT NOT NULL
);

CREATE TABLE nodes(
    node_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES nodes(node_id) DEFERRABLE INITIALLY DEFERRED, 
    tree_id UUID REFERENCES trees(tree_id),
    type node_type NOT NULL,
    index SMALLINT,
    name TEXT NOT NULL,
    content JSONB
);