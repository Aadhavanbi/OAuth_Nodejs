const db = require('../models/index')
const dbconnect = db.OAuthUser;



//////// Start Oauth CallBack
    module.exports.protected = async(req, res, next )=>{

      const user = await dbconnect.findOne({where:{email: req.user.email}});
      if (req.cookies.register ) {      
        if (user) {
            res.render('alert',{
              email:req.user.email,
              text:"Your Mail Id is Already Register",
            })
        } else {
            const info ={
              user_name: req.user.displayName,
              email: req.user.email,
            }
            const datastore= await dbconnect.create(info);  
            if (datastore) {
              res.redirect('/')
            } else {
              res.status(500).send('Ops... ')
            }
          }
      }else{
        if (user == null) {
          const info ={
            user_name: req.user.displayName,
            email: req.user.email,
          }
          const datastore= await dbconnect.create(info);  
          if (datastore) {
            res.cookie('email', req.user.email, { maxAge: 20000, httpOnly: true });
            res.redirect('/testsession');
          } else {
            res.status(500).send('Ops... ')
          }
        }else{
          res.cookie('email', req.user.email, { maxAge: 20000, httpOnly: true });
          res.redirect('/testsession');
        }
      }
    }
//////// End Oauth CallBack



//////// Start the User Logout 
module.exports.logout =async(req, res, next)=>{
      console.log('Logout');
      res.cookie('email', '', { expires: new Date(0) });
      res.cookie('UserDetial', '', { expires: new Date(0) });
      res.cookie('displayName', '', { expires: new Date(0) });
    //   req.logout();
      req.session.destroy();
      res.redirect('/');
    }
//////// End the User Logout 



///////// Start  Home Page 
module.exports.homepage =async(req, res, next)=>{
      const errorMessage = req.flash('error')[0];

      var user= req.cookies.UserDetial
      var email = req.cookies.email
      if ( user && email) {
        res.redirect('/testsession')
      }

      res.cookie('register', '', { expires: new Date(0) });

      res.render('homepage',{
        title:'User Register...',
        errorMessage
      })
    }
///////// End Home Page 



/////// Start
module.exports.loginview = async(req, res, next )=>{
      try {   
      const emailid=req.body.email;
      const passwordid=req.body.password;
      const user= await dbconnect.findOne({where:{email:emailid,password:passwordid}});
      const id=user.dataValues.id;
      const cookies = req.headers.cookie;
      if (user.length > 0) {  
        // nodeMailer.sendMail(emailid);
        const user = user;
        req.session.user = { id: user.id, email: user.email };
        res.cookie('UserDetial', user, { maxAge: 20000, httpOnly: true });
        res.cookie('email', req.body.email, { maxAge: 20000, httpOnly: true });
        res.redirect('/testsession');
      } else {
        res.send('Invalid username or password');
      }
      return res.send(req.session.dbconnect);
      } catch (error) {
        req.flash('error', 'Invalid username or password');
        res.redirect('/');
      }
    }
/////// End



///////  Start Oauth Login
module.exports.testsession = async(req,res,next)=>{
      if (req.cookies.email) {
        const user= await dbconnect.findOne({where:{email:req.cookies.email,password:null}});
        if (user) {
          // nodeMailer.sendMail(req.cookies.email);
          res.render('authorlogined',{
            user
            })
        }else{
          res.render('alert',{
            email:req.cookies.email,
            text:"Your Email exists but in normal User login",
          })
        }
      }else{
        res.redirect('/')
      }
    }
///////  End Oauth Login



///////// Start Go to Register Page
module.exports.add = async(req,res,next)=>{

      res.cookie('register', 'true', { maxAge: 60000, httpOnly: true });
          res.render('register', {
          title: 'Add Author ...',  
        });
      
    };
///////// End Go to Register Page



///////// Start Store the New User In DB
module.exports.addUser =  async(req,res,next)=> {
    
      const info ={
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        mobile_number: req.body.mobile_number,
      }
      const datastore= await dbconnect.create(info);  
      if (datastore) {
        res.redirect('/')
      } else {
        res.status(500).send('Ops... ')
      }
    }
///////// End Store the New User In DB



