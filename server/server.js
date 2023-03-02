const express = require('express')
const app = express()
const path = require('path')

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '4c51ebeabf62446cb90125396a806e76',
  captureUncaught: true,
  captureUnhandledRejections: true,
})


app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy', 'Reavis', 'Bert', 'Beavis']
    rollbar.log('site is up')


app.get('/', (req, res) => {
    rollbar.log('site visit')
    res.sendFile(path.join(__dirname, '../public/devOps.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
    rollbar.info('list is sent')
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
           rollbar.info('added successfully')

       } else if (name === ''){
           res.status(400).send('You must enter a name.')
           rollbar.error('attempted to add')

       } else {
           res.status(400).send('That student already exists.')
           rollbar.warning('attempted duplicate')
       }
   } catch (err) {
       console.log(err)
       rollbar.error(err)
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 4009

app.listen(port, () => console.log(`Server listening on ${port}`))
