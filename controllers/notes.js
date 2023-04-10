const notesRoutes = require('express').Router()
const Note = require('../models/note')

notesRoutes.get('/', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
      })
})
notesRoutes.get('/:id', (request, response, next) => {
    Note.findById(request.params.id).then(result => {
        response.json(result)
    }).catch(error => next(error))
})
notesRoutes.post('/', (request, response, next) => {
    const {content, important} = request.body
    const note = new Note({
        content,
        important: important || false
    })
    note.save().then(result => {
        response.status(200).json(result)
    }).catch(error => next(error))
    
})
notesRoutes.delete('/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(202).end()
      })
      .catch((error) => next(error))
})
notesRoutes.put('/:id', (request, response, next) => {
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
module.exports = notesRoutes