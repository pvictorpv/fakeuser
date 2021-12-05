// 1. IMPORTAR OS PACOTES NECESSÁRIOS
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');

const User = require('./server/models/user');

const connectDB = require('./server/database/connection');

// 2. CONFIGURAÇÃO DO SERVIDOR

// Express app - Invoca uma instância da função contida no pacote express e associa à varável 'app'
const app = express();

// Setting Up View Engine
app.set('view engine', 'ejs');

// Configurando o pacote dotenv
dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

// Conectando à base de dados - Async Await retorna uma promise que ativará o servidor - Configuração transferida para /database/connection.
connectDB();

// 2.1 MIDDLEWARE

// Configurando a pasta pública para arquivos estáticos (ex: css, img)
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true })); // Body-Parser built-in - Dá acesso ao req.body

// [OPCIONAL] Mudando a pasta padrão 'views'
// app.set('views', 'nome-da-pasta')

// [OPCIONAL] Middleware e next() - Ao usar um middleware, o servidor não sabe o que fazer em seguida. Então se usa 'next()' para o servidor seguir a rota.
// app.use((req, res, next) => {
//   console.log('Middleware in action. Using next() to move on.');
//   next();
// })

// [OPCIONAL] Middleware de Terceiros - Exemplo: Morgan - OBS: Já possui a função next() embutida.
//app.use(morgan('dev'));

// IMPORTANDO ROTAS (TRANSFERIDAS PARA /server/routes)

app.use('/', require('./server/routes/router'));

// TUDO PRONTO? INICIANDO SERVIDOR

app.listen(PORT, () => {
	console.log(`Servidor ativo em http://localhost:${PORT}`);
});

// TESTES DE INTERAÇÃO COM A BASE DE DADOS

// Testando Schema e Model e Salvando na base de dados

// app.get('/add-user', (req, res) => {
//   const user = new User ({
//     email: 'paulovictor_net@hotmail.com',
//     password: '415263'
//   });

//   user.save()
//     .then((result) => {
//       res.send(result)
//     })
//     . catch((err) => {
//       console.log(err)
//     });
// });

// Consultando a base de dados

// app.get('/search', (req, res) => {
//   User.find()
//     .then ((result) => {
//       res.send(result);
//     })
//     .catch ((err) => {
//       console.log(err)
//     });
// });

// Consultando a base de dados por ID

// app.get('/search-byid', (req, res) => {
//   User.findById('61a7be90bf5b03bf8e62e76c')
//     .then ((result) => {
//       res.send(result);
//     })
//     .catch ((err) => {
//       console.log(err)
//     });
// });
