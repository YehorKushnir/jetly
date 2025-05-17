const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'}
})

module.exports = model('User', UserSchema)