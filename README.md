# 🖥️ App Caixa 

#### O App Caixa Back é o Back end do ecossistema App Caixa. O projeto completo é integrado ao repositório: [App Caixa Front](https://github.com/raquelvivi/AppCaixaFront).

#### Este sistema web foi desenvolvido especificamente para a gestão comercial de mercados e kitandas. A solução surgiu da necessidade real de mapear o fluxo de vendas, controle de estoque e margem de lucro de um comércio local. O projeto consolida anos de experiência no setor de vendas, traduzindo necessidades práticas em funcionalidades de controle financeiro, gestão de perdas, compras e conformidade com taxas governamentais.

#### O principal objetivo do projeto é implementar uma gestão estratégica na Kitanda do Vitor (empresa de médio porte). Anteriormente, a empresa operava sem métricas de diagnóstico ou previsões futuras, enfrentando um cenário de endividamento crescente. O sistema visa sanar lacunas de inteligência de negócio, respondendo a perguntas fundamentais como: "Qual o lucro real da operação?" e "Qual a viabilidade financeira do modelo de negócio?".

#### Atualmente, o sistema encontra-se em fase de desenvolvimento, com as funcionalidades principais de interface já operacionais. O projeto adota a metodologia ágil Scrum, focando em ciclos de entrega rápidos e melhoria contínua do produto.

## 🛠️ Tecnologias Utilizadas
<div align="center">
<table border="0">
  <tr>
<td valign="top">

#### 🎨 Back-End
<a href="https://github.com/search?q=user%3Araquelvivi+language%3APostgreSQL"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-5e60ce.svg?logo=postgresql&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Araquelvivi+language%3ATypeScript"><img src="https://img.shields.io/badge/NestJS-e63946.svg?logo=nestjs&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Araquelvivi+language%3AJavaScript"><img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-f72585.svg?logo=javascript&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Araquelvivi+language%3ATypeScript"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-7209b7.svg?logo=typescript&logoColor=white"></a>
<a href="https://github.com/search?q=user%3Araquelvivi+language%3APLpgSQL"><img alt="PLpgSQL" src="https://img.shields.io/badge/PLpgSQL-336791.svg?logo=postgresql&logoColor=white"></a>




</td>
<!-- <td valign="top">-->
   
<!--#### 😶‍🌫️ Outros

<img src="https://img.shields.io/badge/Dark%20Mode-212529.svg?logo=darkreader&logoColor=white"> 
<img src="https://img.shields.io/badge/MVC-c625cc.svg"> 
<img src="https://img.shields.io/badge/Clean%20Code-822608.svg"> 
<img src="https://img.shields.io/badge/Validação%20de%20Dados-fffd70.svg"> 

<br/>

</td> -->
 </tr>
</table>
</div>

<br/><br/>

## 🚀 Executar

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npm run start:dev
   ```

<br/><br/>
## 🖼️ Imagens

<img width="1845" height="925" alt="image" src="https://github.com/user-attachments/assets/d2e76460-d6af-4fb7-8fed-d177fbfdddc9" />
<img width="1847" height="872" alt="image" src="https://github.com/user-attachments/assets/ef76ab51-41a4-455c-ab57-524e4c948cf2" />
<img width="1613" height="792" alt="image" src="https://github.com/user-attachments/assets/5ba09c8d-e58b-40b0-a561-8f1712ea3c3e" />

</br></br>

## Problemas E Aprendizagens 

#### Este projeto foi uma verdadeira oficina para a vida, onde enfrentei diversos desafios e encontrei soluções valiosas. Nele, compreendi a gravidade das vulnerabilidades de SQL Injection e descobri o QueryRunner, percebendo que nem sempre há necessidade de utilizá-lo manualmente no Node.js.

#### Aprendi a evitar inserções maliciosas que poderiam comprometer meu banco de dados e descobri como o NestJS permite garantir a atomicidade das operações, evitando que apenas parte dos dados seja inserida enquanto outra é ignorada. Hoje estou melhor que ontem, e amanhã estarei melhor que hoje. 

<!--
## Problemas
#### Neste projeto, enfrentei um desafio baseado no clássico "na minha máquina funciona". O aplicativo operava perfeitamente no computador e no Expo, mas o cenário mudou na transformação para APK. Durante a execução do APK, a tela dinâmica /pg/[id] não carregava corretamente: ao navegar para ela, o aplicativo exibia a mensagem “Carregando...” indefinidamente.

#### O erro não estava relacionado à navegação ou ao parâmetro id, mas sim às requisições HTTP feitas para o backend hospedado na Render. Enquanto no ambiente de teste tudo fluía, no ambiente real a história era outra. O próprio Android bloqueava a requisição HTTP, o que, consequentemente, impedia a resposta e o carregamento da tela. A solução foi rápida: substituir o HTTP por sua versão segura e criptografada, o HTTPS.

#### Com isso, aprendi que ambientes de desenvolvimento são mais permissivos e aceitam HTTP, enquanto em produção as restrições são maiores. Este episódio serve como um lembrete para mim mesma: mesmo tendo estudado protocolos como HTTP, HTTPS, UDP e TCP, acabei caindo na cilada de utilizar uma conexão não segura em um ambiente restrito.


</br></br>


## Futuro
#### Para o futuro, planejo criar uma página com informações como: quantidade de compras, quantidade de pagamentos, número de fichas, valor total de dinheiro preso, entre outros dados relevantes. Além disso, pretendo incorporar ao aplicativo Fixas Caloteiro um gerenciador de estoque e preços para o mesmo mercado.

#### Para isso, será melhor unificar os dois bancos de dados, pois assim será mais fácil modificar, por exemplo, o preço da banana diretamente pelo celular, fazendo com que o valor seja automaticamente atualizado em todos os computadores do mercado.
-->
