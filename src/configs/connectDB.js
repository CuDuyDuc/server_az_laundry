const {mongoose} = require('mongoose')
require('dotenv').config();

const dbUrl = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.kxtyiif.mongodb.net/${process.env.DATABASE_NAME}`

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(dbUrl); 

        console.log('Connect to mongodb successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;