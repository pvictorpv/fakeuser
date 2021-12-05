const mongoose = require('mongoose');

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
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
); // Propriedade embutida no mongoose para determinar data e hora de criação ou atualização

// Criação de Model usando o mongoose
const User = mongoose.model('User', userSchema);

// Exportando conteúdo do arquivo para usar em outros arquivos (ex: app.js)
module.exports = User;
