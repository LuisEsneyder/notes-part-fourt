require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const cors = require('cors')
const app = express()
//creación del middlewere para registrat las entradas
const loggerRecuest = (request, response, next) => {
    console.log('Method', request.method);
    console.log('Path', request.path);
    console.log('Body', request.body);
    console.log('----');
    next()
}
//creación middlewere para controlar el error
const handleError = (error, request, response, next) => {
    console.error(error.message);
    if(error.name === 'CastError'){
        response.status(400).send({error: 'malformatted id'})
    }
    if(error.name === 'ValidationError') {
        response.status(400).json({error: error.message})
    }
    next()
}
//middlerwere
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(loggerRecuest)
//rutas
app.get('/api/notes', (request, response) => {
    Note.find({}).then(result => {
        response.json(result)
    })
})
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(result => {
        response.json(result)
    }).catch(error => next(error))
})
app.post('/api/notes', (request, response, next) => {
    const {content, important} = request.body
    const note = new Note({
        content,
        important: important || false
    })
    note.save().then(result => {
        response.status(200).json(result)
    }).catch(error => next(error))
    
})
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(202).end()
      })
      .catch((error) => next(error))
})
app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body
    const note = {
      content,
      important,
    }
    Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
      runValidators: true,
      context: 'query',
    })
      .then((result) => {
        response.json(result)
      })
      .catch((error) => next(error))
})
app.use(handleError)
const PORT = process.env.PORT || 3001

app.listen(PORT,()=>{
    console.log(`server by to ${PORT}` );
})