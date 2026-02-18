-- Bella Design Hub - seed data para ambiente de desenvolvimento/testes
-- Este script pressupõe um banco PostgreSQL com as tabelas criadas pelas migrations atuais.
-- Execute em um banco vazio ou use TRUNCATE abaixo para limpar antes de inserir.

BEGIN;

-- Limpeza (ajuste caso haja chaves estrangeiras adicionais)
TRUNCATE TABLE production_schedule_parts CASCADE;
TRUNCATE TABLE production_schedules CASCADE;
TRUNCATE TABLE product_parts CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE expenses CASCADE;
TRUNCATE TABLE customers CASCADE;

-- Clientes
INSERT INTO customers ("Id", "Name", "Email", "Phone", "Address", "CreatedAt")
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Amanda Nogueira', 'amanda.nogueira@gmail.com', '+55 11 99951-1001', 'Rua Imbuia, 280 - São Paulo/SP', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Bruno Carvalho', 'bruno.carvalho@studio.com', '+55 11 99842-1002', 'Rua das Cerejeiras, 88 - São Paulo/SP', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Camila Mendes', 'camila.mendes@interiores.com', '+55 21 99773-1003', 'Av. Atlântica, 1700 - Rio de Janeiro/RJ', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Daniel Costa', 'daniel.costa@arquitetura.com', '+55 31 98888-1101', 'Rua Ipê Roxo, 41 - Belo Horizonte/MG', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Eduarda Lima', NULL, '+55 51 99777-1201', 'Rua Padre Chagas, 230 - Porto Alegre/RS', NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Felipe Rocha', 'felipe.rocha@decor.co', '+55 61 99666-1301', 'SHN Quadra 2 - Brasília/DF', NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Gabriela Teixeira', 'gabriela.tx@hotmail.com', '+55 41 99555-1401', 'Rua Vicente Machado, 2500 - Curitiba/PR', NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Henrique Prado', 'henrique.prado@residencial.com', '+55 62 99444-1501', 'Rua T-63, 500 - Goiânia/GO', NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Isabela Figueiredo', 'isa.fig@projetos.com', '+55 71 99333-1601', 'Av. Tancredo Neves, 1900 - Salvador/BA', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'João Victor Reis', NULL, '+55 82 99222-1701', 'Rua dos Ipês, 515 - Maceió/AL', NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Larissa Pires', 'larissa.pires@estudio.com', '+55 48 99111-1801', 'Av. Beira-Mar Norte, 900 - Florianópolis/SC', NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Marcos Tavares', 'marcos.tavares@obra.com', '+55 86 99000-1901', 'Av. Frei Serafim, 1122 - Teresina/PI', NOW());

-- Pedidos
INSERT INTO orders ("Id", "Code", "CustomerId", "Status", "TotalAmount", "CreatedAt", "UpdatedAt", "DeliveryDate")
VALUES
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'BEL-2024-001', '11111111-1111-1111-1111-111111111111', 3, 42800.00, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '20 days'),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'BEL-2024-002', '22222222-2222-2222-2222-222222222222', 2, 31250.00, NOW() - INTERVAL '45 days', NOW() - INTERVAL '5 days', NOW() + INTERVAL '10 days'),
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', 'BEL-2024-003', '33333333-3333-3333-3333-333333333333', 1, 28560.00, NOW() - INTERVAL '35 days', NULL, NOW() + INTERVAL '25 days'),
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', 'BEL-2024-004', '44444444-4444-4444-4444-444444444444', 0, 16800.00, NOW() - INTERVAL '20 days', NULL, NULL),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', 'BEL-2024-005', '55555555-5555-5555-5555-555555555555', 3, 55890.00, NOW() - INTERVAL '48 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days'),
  ('a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a6a6', 'BEL-2024-006', '66666666-6666-6666-6666-666666666666', 4, 22500.00, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', NULL),
  ('b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b7b7b7', 'BEL-2024-007', '77777777-7777-7777-7777-777777777777', 3, 38870.00, NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'BEL-2024-008', '88888888-8888-8888-8888-888888888888', 2, 19400.00, NOW() - INTERVAL '12 days', NULL, NOW() + INTERVAL '5 days'),
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d9d9', 'BEL-2024-009', '99999999-9999-9999-9999-999999999999', 1, 62540.00, NOW() - INTERVAL '55 days', NULL, NOW() + INTERVAL '18 days'),
  ('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', 'BEL-2024-010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 0, 18950.00, NOW() - INTERVAL '8 days', NULL, NULL),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'BEL-2024-011', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 2, 45220.00, NOW() - INTERVAL '18 days', NOW() - INTERVAL '4 days', NOW() + INTERVAL '7 days'),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'BEL-2024-012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 0, 27410.00, NOW() - INTERVAL '5 days', NULL, NULL);

-- Itens dos pedidos
INSERT INTO order_items ("Id", "OrderId", "Description", "Quantity", "UnitPrice")
VALUES
  ('01f1a111-aaaa-4bbb-8888-000000000001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Bancada em pedra sintética + armários inferiores', 1, 22800.00),
  ('01f1a111-aaaa-4bbb-8888-000000000002', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', 'Ilha central em MDF com lâmina natural', 1, 20000.00),
  ('02f2b222-bbbb-4ccc-9999-000000000003', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Penteadeira com espelho camarim', 1, 12500.00),
  ('02f2b222-bbbb-4ccc-9999-000000000004', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Painel ripado cabeceira queen', 1, 9600.00),
  ('02f2b222-bbbb-4ccc-9999-000000000005', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Criados suspensos laqueados', 2, 4550.00),
  ('03f3c333-cccc-4ddd-aaaa-000000000006', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', 'Estação home office dupla', 1, 19800.00),
  ('03f3c333-cccc-4ddd-aaaa-000000000007', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', 'Armário aéreo com portas basculantes', 1, 8700.00),
  ('04f4d444-dddd-4eee-bbbb-000000000008', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', 'Bancada de lavabo com cuba esculpida', 1, 8900.00),
  ('04f4d444-dddd-4eee-bbbb-000000000009', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e4e4', 'Armário fechado lavanderia', 1, 7900.00),
  ('05f5e555-eeee-4fff-cccc-000000000010', 'f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', 'Cozinha gourmet com portas em vidro canelado', 1, 38870.00),
  ('06f6f666-ffff-4000-dddd-000000000011', 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a6a6', 'Closet linear em MDF fendi', 1, 22500.00),
  ('07f70707-0000-4111-eeee-000000000012', 'b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b7b7b7', 'Balcão caixa + painel expositivo loja', 1, 21000.00),
  ('08f80808-1111-4222-ffff-000000000013', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Estante modular com iluminação LED', 1, 19400.00),
  ('09f90909-2222-4333-0000-000000000014', 'd9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d9d9', 'Armários corporativos modulares', 4, 15635.00),
  ('10fa0a0a-3333-4444-1111-000000000015', 'e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', 'Painel ripado hall entrada + banco embutido', 1, 18950.00),
  ('11fb1b1b-4444-4555-2222-000000000016', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'Espelho camarim com gaveteiro', 1, 14520.00),
  ('12fc2c2c-5555-4666-3333-000000000017', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'Armário sapateira pivotante', 1, 8800.00),
  ('13fd3d3d-6666-4777-4444-000000000018', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'Parede Biblioteca com portas de correr', 1, 14990.00),
  ('14fe4e4e-7777-4888-5555-000000000019', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'Cristaleira iluminada sob medida', 1, 12420.00);

-- Despesas
INSERT INTO expenses ("Id", "Description", "Amount", "Category", "ExpenseDate", "Notes", "CreatedAt")
VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Compra de MDF Carvalho', 18500.00, 0, NOW() - INTERVAL '40 days', 'Lote fornecedor principal', NOW()),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Pagamento equipe de instalação', 12400.00, 1, NOW() - INTERVAL '32 days', NULL, NOW()),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Frete interestadual módulos planejados', 4600.00, 2, NOW() - INTERVAL '28 days', 'Entrega RJ', NOW()),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Conta de energia do galpão', 2200.00, 3, NOW() - INTERVAL '20 days', NULL, NOW()),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Reparos em máquinas', 3750.00, 1, NOW() - INTERVAL '18 days', 'Troca de rolamentos', NOW()),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Compra de puxadores premium', 5400.00, 0, NOW() - INTERVAL '12 days', NULL, NOW()),
  ('a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a7a7', 'Logística expressa projeto Brasília', 3150.00, 2, NOW() - INTERVAL '9 days', NULL, NOW()),
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b8b8', 'Conta de água galpão', 980.00, 3, NOW() - INTERVAL '7 days', NULL, NOW()),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Treinamento equipe de marcenaria', 8900.00, 1, NOW() - INTERVAL '5 days', 'Workshop ferragens ocultas', NOW()),
  ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'Materiais diversos showroom', 2100.00, 99, NOW() - INTERVAL '2 days', NULL, NOW()),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d1d1', 'Lixa e abrasivos para oficina', 1250.00, 0, NOW() - INTERVAL '3 days', NULL, NOW()),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e2e2', 'Café e lanche equipe fábrica', 420.00, 99, NOW() - INTERVAL '1 day', NULL, NOW());

-- Produtos com composição de peças
INSERT INTO products ("Id", "Name", "Description", "CreatedAt", "UpdatedAt")
VALUES
  ('11111111-aaaa-bbbb-cccc-111111111111', 'Penteadeira Camarim Aurora', 'Estação completa com iluminação embutida e gavetas laterais.', NOW(), NULL),
  ('22222222-bbbb-cccc-dddd-222222222222', 'Armário Modular Boreal', 'Armário multiuso com módulos independentes e iluminação interna.', NOW(), NULL),
  ('33333333-cccc-dddd-eeee-333333333333', 'Balcão Gourmet Atlântida', 'Balcão central para cozinhas abertas com tampo em quartzo branco.', NOW(), NULL);

INSERT INTO product_parts ("Id", "ProductId", "Name", "Measurements", "Quantity")
VALUES
  ('aaaa1111-bbbb-cccc-dddd-000000000001', '11111111-aaaa-bbbb-cccc-111111111111', 'Tampo principal com nicho para espelho', '120 x 55 cm', 1),
  ('aaaa1111-bbbb-cccc-dddd-000000000002', '11111111-aaaa-bbbb-cccc-111111111111', 'Moldura com LED embutido', '120 x 55 cm', 1),
  ('aaaa1111-bbbb-cccc-dddd-000000000003', '11111111-aaaa-bbbb-cccc-111111111111', 'Coluna lateral com gavetas', '35 x 45 cm', 2),
  ('bbbb2222-cccc-dddd-eeee-000000000004', '22222222-bbbb-cccc-dddd-222222222222', 'Módulo vertical 60cm', '60 x 240 cm', 2),
  ('bbbb2222-cccc-dddd-eeee-000000000005', '22222222-bbbb-cccc-dddd-222222222222', 'Módulo gaveteiro 90cm', '90 x 85 cm', 1),
  ('bbbb2222-cccc-dddd-eeee-000000000006', '22222222-bbbb-cccc-dddd-222222222222', 'Porta ripada com dobradiça oculta', '45 x 220 cm', 2),
  ('cccc3333-dddd-eeee-ffff-000000000007', '33333333-cccc-dddd-eeee-333333333333', 'Estrutura base com niveladores', '240 x 70 cm', 1),
  ('cccc3333-dddd-eeee-ffff-000000000008', '33333333-cccc-dddd-eeee-333333333333', 'Tampo em quartzo branco 2,4m', '240 x 80 cm', 1),
  ('cccc3333-dddd-eeee-ffff-000000000009', '33333333-cccc-dddd-eeee-333333333333', 'Painel frontal frisado', '240 x 45 cm', 2);

-- Planejamento de produção
INSERT INTO production_schedules ("Id", "ProductId", "ScheduledDate", "Quantity", "Status", "CreatedAt", "UpdatedAt")
VALUES
  ('44444444-aaaa-bbbb-cccc-444444444444', '11111111-aaaa-bbbb-cccc-111111111111', CURRENT_DATE, 5, 0, NOW(), NULL),
  ('55555555-bbbb-cccc-dddd-555555555555', '22222222-bbbb-cccc-dddd-222222222222', CURRENT_DATE, 3, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),
  ('77777777-dddd-eeee-ffff-777777777777', '11111111-aaaa-bbbb-cccc-111111111111', CURRENT_DATE + INTERVAL '1 day', 2, 0, NOW(), NULL),
  ('66666666-cccc-dddd-eeee-666666666666', '33333333-cccc-dddd-eeee-333333333333', CURRENT_DATE + INTERVAL '2 days', 1, 0, NOW(), NULL);

INSERT INTO production_schedule_parts ("Id", "ProductionScheduleId", "Name", "Measurements", "Quantity")
VALUES
  ('aaaa4444-bbbb-cccc-dddd-000000000001', '44444444-aaaa-bbbb-cccc-444444444444', 'Tampo principal com nicho para espelho', '120 x 55 cm', 5),
  ('aaaa4444-bbbb-cccc-dddd-000000000002', '44444444-aaaa-bbbb-cccc-444444444444', 'Moldura com LED embutido', '120 x 55 cm', 5),
  ('aaaa4444-bbbb-cccc-dddd-000000000003', '44444444-aaaa-bbbb-cccc-444444444444', 'Coluna lateral com gavetas', '35 x 45 cm', 10),
  ('bbbb5555-cccc-dddd-eeee-000000000004', '55555555-bbbb-cccc-dddd-555555555555', 'Módulo vertical 60cm', '60 x 240 cm', 6),
  ('bbbb5555-cccc-dddd-eeee-000000000005', '55555555-bbbb-cccc-dddd-555555555555', 'Módulo gaveteiro 90cm', '90 x 85 cm', 3),
  ('bbbb5555-cccc-dddd-eeee-000000000006', '55555555-bbbb-cccc-dddd-555555555555', 'Porta ripada com dobradiça oculta', '45 x 220 cm', 6),
  ('dddd7777-cccc-bbbb-aaaa-000000000010', '77777777-dddd-eeee-ffff-777777777777', 'Tampo principal com nicho para espelho', '120 x 55 cm', 2),
  ('dddd7777-cccc-bbbb-aaaa-000000000011', '77777777-dddd-eeee-ffff-777777777777', 'Moldura com LED embutido', '120 x 55 cm', 2),
  ('dddd7777-cccc-bbbb-aaaa-000000000012', '77777777-dddd-eeee-ffff-777777777777', 'Coluna lateral com gavetas', '35 x 45 cm', 4),
  ('cccc6666-dddd-eeee-ffff-000000000007', '66666666-cccc-dddd-eeee-666666666666', 'Estrutura base com niveladores', '240 x 70 cm', 1),
  ('cccc6666-dddd-eeee-ffff-000000000008', '66666666-cccc-dddd-eeee-666666666666', 'Tampo em quartzo branco 2,4m', '240 x 80 cm', 1),
  ('cccc6666-dddd-eeee-ffff-000000000009', '66666666-cccc-dddd-eeee-666666666666', 'Painel frontal frisado', '240 x 45 cm', 2);

COMMIT;
