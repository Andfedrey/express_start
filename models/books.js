const {Schema, model} = require('mongoose')

const BookShema = new Schema({
    id: {
        type: String,
        required : true
    },
    title: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    authors: {
        type: String,
        required : true
    },
    favorite: {
        type: String,
        default: 'yes'
    },
    fileCover: {
        type: String,
       
    },
    fileName: {
        type: String,
       
    },
    fileBook: {
        type: String
    }
})

module.exports = model('Books', BookShema)