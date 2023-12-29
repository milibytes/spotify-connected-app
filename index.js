// npm install Express, then check package.json file to see that the dependency exists

// At the top of the file, we're going to require the Express module and instantiate the Express app.

const express = require('express');
const app = express(); // app is an express instance
const port = 8888

// With Express apps, every route definition is structured like this:
//  app.METHOD(PATH, HANDLER)
// handler is a callback function that is run every time a user hits a specific URL
// the callback functions takes in req and res as arguments, you can call them other names but the first argument is always going to be the request and the second will be response


// JSON Response Example:

app.get('/', (req,res) => {  // req argument is an object containing info about whats coming in with the request
    const data = {
        name: 'Mili',
        isTired: true
    }

    res.json(data)
})

// Code here tells Express to do two things:
// 1. Handle the get request on the home page/index route
// 2. Send a 'Hello World' string back with the response


// app.get('/', (req,res) => {  
//     res.send('Hello World!')
// })

// Next, tell Express to listen for a connection on a port 8888

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`)
})

// to run this app locally with the terminal, run 'node index.js'