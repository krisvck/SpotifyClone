const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());

// app.use(express.urlencoded({extended: true}));
// app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(bodyParser.json());

app.post('/refresh', (req, res) => {
    console.log("hi")
    const refreshToken = req.body.refreshToken
    //console.log(refreshToken);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'a1e6e8179af44be5ade5659fad3dd960',
        clientSecret: '561ed79705b2417d80f27ce1622e83ce',
        refreshToken
})

// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
spotifyApi.refreshAccessToken().then(
    (data) => {
      res.json({ 
          accessToken: data.body.accessToken,
          expriresIn: data.body.expriresIn
      })
    }).catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'a1e6e8179af44be5ade5659fad3dd960',
        clientSecret: '561ed79705b2417d80f27ce1622e83ce'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400);
    })
})

app.listen(3001)