const mongoose = require(`mongoose`)
const { connectionUrl } = require(`../config/keys`)

const connectMongodb = async () => {
    try {
        await mongoose.connect(connectionUrl)
        console.log(`connected ya`)
    }catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectMongodb