const mongoose = require('mongoose')
const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connection Successfull')
    }
    catch(err){
        console.log(err)
        process.exit()
    }
}

module.exports = connectDb