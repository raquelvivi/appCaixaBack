create table Produto (
codigo varchar(200) Primary Key ,
nome varchar(100) not null,  
validade date null,
quant INTEGER not null DEFAULT 0,
precoCompra double precision null,
precoVenda double precision not null,
categoria varchar (50) null,
quantMinimo Integer not null DEFAULT 3 ,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION atualiza_horarioDia()
 RETURNS trigger AS $$
	 BEGIN
	 	NEW.atualizado_em = NOW();
		 
	 	RETURN NEW;
	 END;
 $$ LANGUAGE plpgsql

;

CREATE TRIGGER trigger_atualiza_data_modificacao
BEFORE UPDATE ON Produto
FOR EACH ROW
EXECUTE FUNCTION atualiza_horarioDia();


create table Vendedor (

id serial Primary Key,
nome varchar(100) not null,
site varchar (200) null,
cnpj varchar (20) unique,
contato varchar (12) null,
vindaMes int null,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TRIGGER trigger_atualiza_data_modificacao
BEFORE UPDATE ON Vendedor
FOR EACH ROW
EXECUTE FUNCTION atualiza_horarioDia();


create table Tem (

id serial Primary Key,
valor double precision not null,
fkProduto varchar(200) not null,
fkVendedor int not null,
FOREIGN key (fkProduto) references Produto (codigo),
FOREIGN key (fkVendedor) references Vendedor (id),
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TRIGGER trigger_atualiza_data_modificacao
BEFORE UPDATE ON Tem
FOR EACH ROW
EXECUTE FUNCTION atualiza_horarioDia();


create table aquisicao (

	id serial primary key,
	quant INTEGER not null,
	total double precision not null,
	data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	nome varchar (50) null,
	fkTem integer,
	FOREIGN (fkTem) REFERENCES Tem (id)

);


create table despesas (

	id serial primary key,
	pagou varchar (10)  DEFAULT 'sim' ,
	valor double precision not null,
	data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	nome varchar (50) null,
    fkAquisicao integer,
	FOREIGN (fkAquisicao) REFERENCES aquisicao(id)

);


create table CompraT (

	id serial primary key,
	total double precision,
	pagamento varchar (50),
	data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	fkCliente varchar(50) null

);



create table ItemCompra (

	id serial primary key,
	quant integer not null,
	preco double precision,
	fkProduto varchar(200),
	fkCompraT integer,
	FOREIGN key (fkProduto) REFERENCES Produto (codigo),
	FOREIGN key (fkCompraT) REFERENCES CompraT (id)
);

create table HistoricoPreco (
id serial Primary Key ,
tipo varchar(50) not null,  
preco double precision not null,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
fkProduto varchar(200),
fkVendedor integer,
FOREIGN key (fkProduto) REFERENCES Produto (codigo),
FOREIGN key (fkVendedor) REFERENCES Vendedor (id)
);