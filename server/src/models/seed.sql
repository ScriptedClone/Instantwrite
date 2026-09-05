-- Development account
-- EMAIL: dev@email.com
-- PASSWORD: 123456

INSERT INTO users (email, name, password_hash)
VALUES (
    'dev@email.com',
    'Development',
    '$2b$12$WznwoQa8rysNSsGpV/RWL.VAik9awaLuK8Mk0G.o/aF8I77ddpL12'
);

INSERT INTO projects (project_id, user_id, name)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    (SELECT user_id FROM users WHERE email = 'dev@email.com'),
    'Elrer'
);

INSERT INTO nodes (node_id, parent_id, project_id, type, index, name, content)
VALUES
('00000000-0000-0000-0000-000000000000', NULL, '11111111-1111-1111-1111-111111111111', 'folder', NULL, 'root', NULL),
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'folder', 0, 'Chapters', NULL),
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'folder', 0, 'Sub chapters', NULL),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'document', 0, 'chapter1.5', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'document', 1, 'chapter 1', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'document', 2, 'chapter 2', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'document', 3, 'chapter 3', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'folder', 1, 'Characters', NULL),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'document', 0, 'Cedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Hello."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'document', 1, 'Gedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"First sentence here."}]},{"type":"paragraph","content":[{"type":"text","text":"Second sentence here."}]},{"type":"paragraph","content":[{"type":"text","text":"Third sentence here."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'document', 2, 'Jedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Have you ever wondered why the sky is blue?"}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'document', 3, 'Bedric', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the first paragraph."}]},{"type":"paragraph","content":[{"type":"text","text":"This is the second paragraph."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'document', 2, 'Magic System', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The quick brown fox jumps over the lazy dog."}]}]}'::jsonb),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'document', 3, 'Example tiptap file', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"\"What is this?\" Cedric muttered. After scrunching his eyes, the interface still covered his view. He reached out his hand out of instinct and swiped the blue interface away. Afterwards, the interfaced vanished from existence."}]},{"type":"paragraph","content":[{"type":"text","text":"\"Was I seeing things?\""}]},{"type":"paragraph","content":[{"type":"text","text":"Cedric sat up to take a look of his surroundings. The room was dimly lit and ample light seeped through the curtains."}]},{"type":"paragraph","content":[{"type":"text","text":"\"How did I survive?\""}]},{"type":"paragraph","content":[{"type":"text","text":"Cedric vividly remembered that he was cut in half but when he looked down, his body was still intact."}]},{"type":"paragraph","content":[{"type":"text","text":"''Did the saintess revive me?''"}]},{"type":"paragraph","content":[{"type":"text","text":"Although he had never seen it himself, there were rumors that the saintess had the ability to revive a person. That is if the soul hasn''t left its body yet."}]},{"type":"paragraph","content":[{"type":"text","text":"''But why me?''"}]}]}'::jsonb);