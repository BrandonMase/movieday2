const express = require("express");
const bodyParser = require("body-parser");
const mc = require(__dirname + "/controllers/mc_controller");
var cors = require('cors');
const axios = require('axios');
const massive = require('massive');
const session = require('express-session')
require('dotenv').config();

massive(process.env.CONNECTION_STRING).then(db => app.set('db',db))

const app = express();
app.use(bodyParser.json());
// app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave:false,
}))
// app.use(express.static(__dirname + "/../public/build"))

const baseURL = "/api/getList";
app.get("/api/getList", mc.read);
app.get("/api/getListName", mc.getListName);
app.post("/api/addToList", mc.create);
app.put("/api/updateListName/:id", mc.updateListName);
app.delete("/api/deleteFromList/:id",mc.remove);

app.get('/auth/callback', (req, res) => {
  axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`, {
    client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
    client_secert: process.env.AUTH0_CLIENT_SECRET,
    code: req.query.code,
    grant_type: 'authorization_code',
    redirect_uri:`http://${req.headers.host}/auth/callback`
  }).then(accessTokenResponse => {
    return axios.post(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo/?access_token=${accessTokenResponse.data.access_token}`)
      .then(userInfoResponse => {
        const userData = userInfoResponse.data;
        return req.app.get('db').find_user_by_auth0_id(userData.sub)
          .then(users => {
            if (users.length) {
              const user = {
                name: userData.name,
                email: userData.email,
                picture:userData.picture,
              }
              req.session.user = user;
              res.redirect('/');
            } else {
              return req.app.get('db').create_user([userData.sub,userData.email,userData.name,userData.picture])
                .then(newUsers => {
                  const user = {
                    name: newUsers[0].profile_name,
                    email: newUsers[0].email,
                    picture:newUsers[0].picture,
                  }

                  req.session.user = user;
                  res.redirect('/');
                })
            }
          })
      }).catch(e => {
        console.log("server error",e)
        res.send("an error")
      })
  })
})

app.get('/api/user-data', (req, res) => {
  res.json({ user: req.session.user });
})

const port = 6000;
app.listen(port, () => console.log(`Listening on port ${port}`));