const moment = require('moment');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// HANDLING ERRORS

const handleErrors = (err) => {
	console.log(err.message, err.code);
	let errors = { email: '', password: '' };

	// Duplicate Error Code
	if (err.code === 11000) {
		errors.email = 'Email is already registered';
		return errors;
	}

	// Validation Errors

	if (err.message.includes('User validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

// Create JWT Token function - for each user logged in
const maxAge = 3 * 24 * 60 * 60; // 3 dias em segundos
const createToken = (id) => {
	return jwt.sign({ id }, 'fake user creation', { expiresIn: maxAge });
};

// CREATE AND SAVE NEW USER

exports.create = (req, res) => {
	// validate request
	if (!req.body) {
		res.status(400).send({ message: 'Content can not be empty!' });
		return;
	}

	// new user
	const newUser = new User({
		nickname: req.body.nickname,
		email: req.body.email,
		password: req.body.password,
	});

	// save user in the database
	newUser
		.save()
		.then((result) => {
			// Create JWT and send in the cookies
			const token = createToken(newUser._id);
			res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
			console.log('Novo usuário criado com sucesso!');
			res.status(201).redirect('/');
		})
		.catch((err) => {
			const errors = handleErrors(err);
			res.status(500).json({ errors });
		});
};

// FIND ALL USERS

exports.findAll = (req, res) => {
	// User.find().sort({createdAt: -1}) - É possível ordenar de forma diferente os dados, nesse caso pela ordem inversa de criação.
	User.find()
		.then((result) => {
			res.render('index', { title: 'Home', users: result });
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while getting the users.',
			});
		});
};

// FIND BY ID

exports.findById = (req, res) => {
	const id = req.params.id;
	User.findById(id)
		.then((result) => {
			res.render('details', { users: result, title: 'User Details', moment });
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while getting the user.',
			});
		});
};

// UPDATE USER

exports.update = (req, res) => {
	if (!req.body) {
		res.status(400).send({ message: 'Form can not be empty!' });
		return;
	}

	const id = req.params.id;
	User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
		.then((result) => {
			if (!result) {
				res.status(404).send({
					message: `Cannot update user with id ${id}. Maybe user not found`,
				});
			} else {
				res.redirect(`/users/${id}`);
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Error updating user information.',
			});
		});
};

// DELETE USER

exports.delete = (req, res) => {
	const id = req.params.id;
	User.findByIdAndDelete(id)
		.then((result) => {
			if (!result) {
				res.status(404).send({
					message: `Cannot delete user with id ${id}. Maybe user not found`,
				});
			} else {
				console.log('Usuário deletado com sucesso!');
				res.redirect('/');
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Error deleting user with id ${id}.',
			});
		});
};

// AUTH CONTROLLERS

module.exports.login_get = (req, res) => {
	res.render('login', { title: 'Log In' });
};

module.exports.login_post = async function (req, res) {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({});
	}
};

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', { maxAge: 1 });
	res.redirect('/');
};
