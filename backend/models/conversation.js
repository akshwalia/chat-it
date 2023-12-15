const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    owner: {type: Schema.ObjectId, ref: 'User', required: true},
    friend_name: {type: String, required: true},
    last_message: {type: String},
    last_sent_user: {type: Schema.ObjectId, ref: 'User'},
    last_sent_time: {type: Date, default: Date.now()},
    unread_count: {type: Number, default: 0},
    conversation_hash: {type: String, required: true},
});

module.exports = mongoose.model('Conversation', ConversationSchema);