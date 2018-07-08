const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
	Обратите внимание, что у нас нет никаких ID. Это потому, что MongoDB автоматически
	присвоит индексы всем схемам

*/

const PaintingSchema = new Schema({
	name: String,
	url: String,
	technique: String
});

module.exports = mongoose.model('Painting', PaintingSchema);