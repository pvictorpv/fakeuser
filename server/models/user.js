const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Criação de Schema usando o mongoose
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		nickname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: [true, 'You need to enter an email'],
			unique: [true, 'This email is already registered'],
			lowercase: true,
		},
		password: {
			type: String,
			required: [true, 'You need to enter an password'],
			minlength: [6, 'Enter at least 6 characters'],
		},
	},
	{ timestamps: true }
); // Propriedade embutida no mongoose para determinar data e hora de criação ou atualização

// Encriptar senha com bcrypt e Mongoose Hooks

userSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Método estático para logar Usuário
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('incorrect password');
	}
	throw Error('incorrect email');
};

// Criação de Model usando o mongoose
const User = mongoose.model('user', userSchema);

// Exportando conteúdo do arquivo para usar em outros arquivos (ex: app.js)
module.exports = User;
