const express = require('express');
const methodOverride = require('method-override');
const moment = require('moment');

const route = express.Router();
const controller = require('../controller/controller');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { auth, requiresAuth } = require('express-openid-connect');

const User = require('../models/user');

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'fea1f163b60dc7ea79d25c8f80e4d0645ed003667719ea7202eb185b34962edf',
	baseURL: 'http://localhost:5000',
	clientID: 'pMxcVEOwD7fhTWMkKh7npYUut1xcRlkt',
	issuerBaseURL: 'https://dev-1owo8qev.us.auth0.com',
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
route.use(auth(config));

route.get('/profile', requiresAuth(), (req, res) => {
	res.send(JSON.stringify(req.oidc.user));
});

/**
 * @description create user route
 * @method GET /create-user
 */
route.get('/create-user', requiresAuth(), (req, res) => {
	res.render('create-user', {
		title: 'Create User',
		loggedUser: req.oidc.user,
	});
});

/**
 * @description update user route
 * @method GET /update-user
 */
route.get('/update-user/:id', requiresAuth(), (req, res) => {
	const id = req.params.id;
	User.findById(id)
		.then((result) => {
			res.render('update-user', {
				users: result,
				title: 'User Details',
				loggedUser: req.oidc.user,
			});
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

route.post('/create-user', requiresAuth(), controller.create);
route.get('/', controller.findAll);
route.get('/users/:id', controller.findById);
route.put('/update-user/:id', requiresAuth(), controller.update);
route.delete('/:id', requiresAuth(), controller.delete);

// Auth Routes

// route.get('/login', controller.login_get);
// route.post('/login', controller.login_post);
// route.get('/logout', controller.logout_get);

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
