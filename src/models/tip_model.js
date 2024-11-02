const { default: mongoose } = require("mongoose");


const tipSchame = new mongoose.Schema({
    thumbnail:{
        type:String
    },
    body_image:{
        type:String
    },
    title: {
        type: String
    },
    content_header: {
        type: String
    },
    content_footer: {
        type: String
    }
}, {timestamps: true})

const TipModel = mongoose.model('tip', tipSchame)
module.exports =  TipModel