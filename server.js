const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config() // to hide mongodb string and any private data. Also needs install

var db, collection;

const url = process.env.DB_STRING // gets connectionString from .env;
const dbName = "palindrome";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('palindrome-words').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})


app.post('/api', (req, res) => {


  // Hold the value the user enteres. JS is sending us this value with the fetch call
  let userValue = req.body.userWord

  // Function check is a word is palindrome. Returns true or false
  const isPalindrome = (x) => {
      return x.split("").reverse().join("").toLowerCase() === x.toLowerCase() ? true : false
  }

  // Pass in the query parameter the user passed in and check if the word is palindrome. Store the value in a variable to send back to the user
  let result = isPalindrome(userValue)

  // If the word is a palindrome add it to the database
  if(result){

    db.collection('palindrome-words').insertOne(req.body)
    .then(result => {
        console.log(result)

        const objToJson = {
          palindrome: result // Sends true or false
        }
        res.send(JSON.stringify(objToJson));
    })
    .catch(error => console.error(error))

  }else { // If it's not a palindrome do not add it to the database and let the user know
    const objToJson = {
      palindrome: result // Sends true or false
    }
    res.send(JSON.stringify(objToJson));
  }

})


app.delete('/deleteEntry', (req, res) => {
  db.collection('palindrome-words').findOneAndDelete({userWord: req.body.word}, (err, result) => {
    if (err) return res.send(500, err)
    res.send(JSON.stringify({deleted: `${req.body.word} deleted`}))
  })
})
