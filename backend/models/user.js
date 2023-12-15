const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: true },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friend_requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friend_requests_sent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);