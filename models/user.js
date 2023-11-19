const {Schema, model} = require('mongoose')
const { array } = require('../middleware/file')

const UserSchema = new Schema({
    username: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    displayName: {
        type: String,
    },
    emails: {
        type: [String],
    }
})

module.exports = model('User', UserSchema)