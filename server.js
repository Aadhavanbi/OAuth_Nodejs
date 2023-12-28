require('dotenv').config();
const express = require('express');
const app = express();
const session = require("express-session");
const flash = require('express-flash');
const path = require('path');
const cookieParser = require("cookie-parser");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var cookie = require('cookie');
const jwt = require('jsonwebtoken'); 
require('./auth')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


app.set('views', path.join(__dirname, 'app\\views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'storage/css')));
app.use(cookieParser());
app.use(session({secret: "secret",saveUninitialized: false ,cookie:{ expires:10000 } ,resave: false}));
app.use(flash());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/google/failure'
  })
);

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});


const posts = [
  {
    username:'Aadhavan',
    title:'Title 1'
  },{
    username:'Arun',
    title:'Title 2'
  }
];

app.get('/posts',(req, res)=>{

  res.json(posts)
})



// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
  },
  // Path to the API specs
  apis: ['./app/routes/routes.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));





const go_home = require('./app/routes/routes');
const { log } = require('winston');
app.use('/',go_home)

const PORT_NUMBER =  process.env.SERVER_PORT;
app.listen({ port: PORT_NUMBER }, async () => {
  console.log(`Server up on http://localhost:${PORT_NUMBER}`)
})

