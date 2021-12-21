const express = require('express');
const methodOverride = require('method-override');
const moment = require('moment');

const route = express.Router();
const controller = require('../controller/controller');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const User = require('../models/user');

// Rota para mostrar usuário logado ou opção de login
route.get('*', checkUser);

/**
 * @description create user route
 * @method GET /create-user
 */
route.get('/create-user', requireAuth, (req, res) => {
	res.render('create-user', { title: 'Create User' });
});

/**
 * @description update user route
 * @method GET /update-user
 */
route.get('/update-user/:id', requireAuth, (req, res) => {
	const id = req.params.id;
	User.findById(id)
		.then((result) => {
			res.render('update-user', { users: result, title: 'User Details' });
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while getting the user.',
			});
		});
});

route.use(
	methodOverride('_method', {
		methods: ['POST', 'GET'],
	})
);

// API

route.post('/create-user', requireAuth, controller.create);
route.get('/', controller.findAll);
route.get('/users/:id', controller.findById);
route.put('/update-user/:id', requireAuth, controller.update);
route.delete('/:id', requireAuth, controller.delete);

// Auth Routes

route.get('/login', controller.login_get);
route.post('/login', controller.login_post);
route.get('/logout', controller.logout_get);

/**
 * @description 404 page route
 * @method GET /
 */
// Página 404 - route.use é um Middleware executado em toda request, porém só é utilizado caso não haja uma request compatível anterior na ordem do código.
// ATENÇÃO COM A POSIÇÃO DO MIDDLEWARE NO CÓDIGO.
route.use((req, res) => {
	res.status(404).render('404', { title: 'Page not found' });
});

module.exports = route;
