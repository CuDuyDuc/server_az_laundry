const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
    },
    givenName: {
        type: String,
    },
    familyName: {
        type: String,
    },
    photo: {
        type: String,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone_number: {
        type : String,
    },
    address: {
        type: String,
    },
    data_user: {
        type: Object
    },
    latitude: {
        type: String,
    }, 
    longitude: {
        type: String,
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
    },
}, {
    timestamps: true
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;