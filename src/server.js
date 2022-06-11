const express  = require('express')
const app = express();
const cors = require('cors');
 const path  = require('path')

const fs = require('fs');
let personsDB = require('../data/db.json')


const port = 3001

app.use(cors())
app.use(express.json());
//send data
app.get('/api/persons', async(req, res) => {
    console.log(req.method)
  res.json(personsDB)
})

//save contact 
app.post('/api/persons', (req, res,next) => {
const {name ,number} = req.body;

const existingName = personsDB.persons.find(x=>x.name.toLowerCase()===name.toLowerCase())
const existingNumber = personsDB.persons.find(x=>x.name===name)
if(!name || !number){
    res.status(404).json({"message":"name and number is required"})
}
if(existingName||existingNumber){
    res.status(404).json({"error":"name must be unique "})
}
const newContact = {
    name:name,
    number:number,
    id:Math.floor(Math.random() * 10001)
}
const contactJson = newContact
let newDB ={...personsDB}
newDB.persons = [...personsDB.persons ,contactJson]
personsDB = newDB;

 fs.writeFileSync(path.join(__dirname,'..','data','db.json'),JSON.stringify(personsDB),"utf-8")
   res.json(`message:${name} added to database`)
   next()
  })
  app.get('/api/persons/:id', (req, res) => {
      const person = personsDB.persons.find(x=>x.id===+req.params.id)
      if(!person){
         res.status(404).json({"message":"contact not found"})
      }
      res.end();
  })

//Delete contact

  app.delete('/api/persons/:id', (req, res,next) => {
    const person = personsDB.persons.find(x=>x.id===+req.params.id)
  
    console.log("Here")
      if(!person){
         res.status(404).json({"message":"contact not found"})
      }
   const filteredDB= personsDB.persons.filter(x=>x.id!==+req.params.id)
    fs.writeFileSync(path.join(__dirname,'..','data','db.json'),JSON.stringify(filteredDB),"utf-8")
    
    res.status(204).json(`message:${person.name} has been deleted`)
    })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })