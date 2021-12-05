const moment = require('moment');
const User = require('../models/user');

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
			console.log('Novo usuário criado com sucesso!');
			res.redirect('/');
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the user.',
			});
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
