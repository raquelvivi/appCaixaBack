INSERT INTO Produto (codigo, nome, validade, quant, precoCompra, precoVenda, categoria, quantMinimo) VALUES
('1','Banana Prata','2026-03-01',120,2.50,4.50,'Fruta',10),
('2','Maçã Gala','2026-03-05',80,3.20,5.80,'Fruta',8),
('3','Laranja Pera','2026-03-03',150,1.90,3.50,'Fruta',15),
('4','Mamão Formosa','2026-02-28',40,4.00,7.00,'Fruta',5),
('5','Abacaxi','2026-03-07',30,5.50,9.50,'Fruta',4),
('6','Melancia','2026-03-02',25,6.00,10.00,'Fruta',3),
('7','Uva Itália','2026-03-06',35,6.50,12.00,'Fruta',4),
('8','Manga Tommy','2026-03-04',60,3.80,6.50,'Fruta',6),
('9','Pera Williams','2026-03-08',45,4.20,7.50,'Fruta',5),
('10','Kiwi','2026-03-09',20,7.00,13.00,'Fruta',3);


INSERT INTO Vendedor (nome, site, cnpj, contato, vindaMes) VALUES
('Sítio Boa Colheita',NULL,'11111111000101','84999990001',4),
('Hortifruti Central','https://horticentral.com','22222222000102','84999990002',8),
('Cooperativa Verde Vida',NULL,'33333333000103','84999990003',6),
('Distribuidora Nordeste',NULL,'44444444000104','84999990004',5),
('Frutas Premium','https://frutaspremium.com','55555555000105','84999990005',7),
('Campo Natural',NULL,'66666666000106','84999990006',3),
('Agro Serra',NULL,'77777777000107','84999990007',4),
('Vale das Frutas',NULL,'88888888000108','84999990008',9),
('HortiBrasil',NULL,'99999999000109','84999990009',6),
('Pomarao Atacado',NULL,'10101010000110','84999990010',5);


INSERT INTO Tem (valor, fkProduto, fkVendedor) VALUES
(2.40,'1',1),
(3.00,'2',2),
(1.80,'3',3),
(3.90,'4',4),
(5.20,'5',5),
(5.80,'6',6),
(6.00,'7',7),
(3.50,'8',8),
(4.00,'9',9),
(6.80,'10',10);


INSERT INTO aquisicao (quant, total, nome, fkTem) VALUES
(50,120.00,'Compra Banana',1),
(40,120.00,'Compra Maçã',2),
(100,180.00,'Compra Laranja',3),
(20,78.00,'Compra Mamão',4),
(15,78.00,'Compra Abacaxi',5),
(10,58.00,'Compra Melancia',6),
(25,150.00,'Compra Uva',7),
(40,140.00,'Compra Manga',8),
(30,120.00,'Compra Pera',9),
(12,81.60,'Compra Kiwi',10);


INSERT INTO despesas (pagou, valor, nome, fkAquisicao) VALUES
('sim',120.00,'Pagamento Banana',1),
('sim',120.00,'Pagamento Maçã',2),
('sim',180.00,'Pagamento Laranja',3),
('nao',78.00,'Mamão pendente',4),
('sim',78.00,'Pagamento Abacaxi',5),
('sim',58.00,'Pagamento Melancia',6),
('nao',150.00,'Uva pendente',7),
('sim',140.00,'Pagamento Manga',8),
('sim',120.00,'Pagamento Pera',9),
('sim',81.60,'Pagamento Kiwi',10);


INSERT INTO CompraT (total, pagamento, fkCliente) VALUES
(20.00,'dinheiro','Cliente 1'),
(35.00,'pix','Cliente 2'),
(50.00,'cartao','Cliente 3'),
(18.00,'dinheiro','Cliente 4'),
(42.00,'pix','Cliente 5'),
(60.00,'cartao','Cliente 6'),
(25.00,'dinheiro','Cliente 7'),
(70.00,'pix','Cliente 8'),
(33.00,'cartao','Cliente 9'),
(90.00,'pix','Cliente 10');


INSERT INTO ItemCompra (quant, preco, fkProduto, fkCompraT) VALUES
(3,4.50,'1',1),
(4,5.80,'2',2),
(6,3.50,'3',3),
(2,7.00,'4',4),
(3,9.50,'5',5),
(2,10.00,'6',6),
(5,12.00,'7',7),
(4,6.50,'8',8),
(3,7.50,'9',9),
(2,13.00,'10',10);

INSERT INTO HistoricoPreco (tipo, preco, fkProduto, fkVendedor) VALUES
('compra',2.20,'1',1),
('compra',2.80,'2',2),
('compra',1.60,'3',3),
('compra',3.70,'4',4),
('compra',5.00,'5',5),
('compra',5.50,'6',6),
('compra',5.80,'7',7),
('compra',3.20,'8',8),
('compra',3.90,'9',9),
('compra',6.50,'10',10);