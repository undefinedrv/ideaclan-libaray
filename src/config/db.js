const mongoose = require("mongoose")

const ConnectToDB = async()=>{
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URI}/ideaclan-new`);
        console.log(`Connected to the DB ${connect.connection.host}`);
    } catch (error) {
        console.log(`Unable to connect the DB`, error);
    }
}

module.exports = {ConnectToDB}