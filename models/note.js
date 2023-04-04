const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URL

console.log(`connecting to ${url}`);
//conección
mongoose.connect(url).then(result => {
    console.log(`conected to mongodb`);
}).catch(error => {
    console.log(`error connecting to MongoDb`, error.message);
})

const noteSchema = mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean
})

noteSchema.set('toJSON',(document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
})

module.exports = mongoose.model('Note', noteSchema)