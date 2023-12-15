const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    body: {type: String, required: true},
    time: {type: Date, required: true, default: Date.now()},
    conversation_hash: {type: String, required: true},
    sender: {type: Schema.ObjectId, ref: 'User', required: true},
});

module.exports = mongoose.model('Message', messageSchema);