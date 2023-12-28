const express = require('express');
const router = express.Router();
const Mycontroller = require('../controllers/oauthController');


router.get('/testsession', Mycontroller.testsession)   

router.get('/protected', Mycontroller.protected)    

router.get('/', Mycontroller.homepage)

router.get('/add', Mycontroller.add)


router.post('/loginview',Mycontroller.loginview); 

router.get('/logout',Mycontroller.logout);  

router.post('/addUser',Mycontroller.addUser)  


module.exports = router