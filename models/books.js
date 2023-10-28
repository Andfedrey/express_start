const {Schema, model} = require('mongoose')

const BookShema = new Schema({
    id: {
        type: String,
        requred: true
    },
    title: {
        type: String,
        requred: true
    },
    description: {
        type: String,
        requred: true
    },
    authors: {
        type: String,
        requred: true
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
       
    }
})

module.exports = model('Books', BookShema)