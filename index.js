// npm install Express, then check package.json file to see that the dependency exists

// At the top of the file, we're going to require the Express module and instantiate the Express app.

require('dotenv').config();
const express = require('express');
const querystring = require('querystring'); 
const axios = require('axios');
const app = express(); // app is an express instance
const port = 8888

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI



// With Express apps, every route definition is structured like this:
//  app.METHOD(PATH, HANDLER)
// handler is a callback function that is run every time a user hits a specific URL
// the callback functions takes in req and res as arguments, you can call them other names but the first argument is always going to be the request and the second will be response


// JSON Response Example:

app.get('/', (req,res) => {  // req argument is an object containing info about whats coming in with the request
    const data = {
        name: 'Mili',
        isTired: false
    }

    res.json(data)
})

// STEP 1: Request Authorisation from Spotify
// Meaning: having our app request authorisation from the Spotify Accounts Service
// -> Means sending a GET request to the Spotify Account Service /authorize endpoint
// GET https://accounts.spotify.com/authorize



// above the login handler, we'll add this utility function called generateRandomString; now that we have an easier way of handling query parameters in our HTTP requests, let's add the optional query params on the /authorize endpoint that we didnt include before

// **  Add state and scope query params

// Generates a ranom string containing numbers and letters
//  @param {number} length ---> The length of the string
//  @return {string} ---> The generated string

const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


const stateKey = 'spotify_auth_state' // this const is assigned the string value and used for storing the generated state in a cookie

// stateKey is just a string used as a key to identify the cookie where the state value is stored. It's essentially a label for retrieving the correct value from the cookie when needed.


// Here we are setting up the /login route handler
app.get('/login', (req, res) => {
    const state = generateRandomString(16) // when user navigates to this route, generateRandomString is called to create a random string of length 16 which represents the state of the authentication process
    res.cookie(stateKey, state); // state is a unique and random value generated for each authentication request

    const scope = 'user-read-private user-read-email'

    const queryParams = querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
    });
    // res.send('Log in to Spotify')
    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
})

// We want to set up our login route to hit the Spotify Account Service /authorize endpoint; to do that we'll replace our res.send with a res.redirect

// 3 Query parameters are required: client_id, response_type, redirect_uri
// Optional parameters: state, scope


//  STEP 2: Have Spotify return access and refresh tokens
//  When the authorization code has been received, you will need to exchange it with an access token by making a POST request to the Spotify Accounts service, this time to its /api/token endpoint: POST https://accounts.spotify.com/api/token

app.get('/callback', (req, res) => {  
    const code = req.query.code || null; // first we store a code variable , which is the value of the authorization code we have on the query parameter, so to access the code query parameter on our request, we can just use req.query.code and if it doesnt exist, we'll just default to null


    //  Axios library: provides a simpler API. Other than being easy to use, Axios also works both client-side (in the browser) and server-side (in our Express app). [ npm install axios] as a dependency; then require at the top of file

    axios({ 
        method: 'post',
        url: 'https://accounts.spotify.com/api/token', 
        data: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      })
      
      .then(response => {
        if (response.status === 200) {
          res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
        } else {
          res.send(response);
        }
      })
      .catch(error => {
        res.send(error);
      });
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