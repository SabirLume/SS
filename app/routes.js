let ObjectId = require('mongodb').ObjectId;
module.exports = function (app, passport, db) {
  const multer = require('multer');
  const upload = multer({
    dest: 'uploads/' // this saves your file into a directory called "uploads"
  });

  var Tesseract = require('tesseract.js')

  // normal routes ===============================================================

  // MULTER
  // It's very crucial that the file name matches the name attribute in your html
  app.post('/fileUpload', upload.single('file-to-upload'), (req, res) => {
    console.log("file upload", req.file)
    // Recognize text of any language in any format
    //tesseract is grabbing the file from the path the image is being saved
    Tesseract.recognize(req.file.path)
      .then(function (result) {
        console.log(result.text)
        db.collection('documents').save({ user: req.session.passport.user, title: req.body.title, note: result.text }, (err, result) => {
          if (err) return console.log(err)
          console.log('saved to database')
          res.redirect('/my-notes');
        })
      });
  });
  // app.get('/my-notes', isLoggedIn, function (req, res){
  //   db.colletion('documents').find({user: req.session.passport.user }).toArray((err, result) =>{
  //     if(err) return console.log(err)
  //     res.render('my-notes.ejs', {
  //       documents: result
  //     })
  //   })
  // });

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });
  // folders SECTION =========================
  app.get('/folders', isLoggedIn, function (req, res) {
    db.collection('documents').find({ user: req.session.passport.user }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('folders.ejs', {
        // user : req.user,

        //passing the array of objects into file to use it
        documents: result
      })
      // console.log("this is showing the results", result)
      // console.log("this is showing the results" , result)
    })
  });
  app.put('/save', (req, res) => {
    db.collection('documents')
    .findOneAndUpdate({note: req.body.note, title: req.body.title }, {
      $set: {
        note:req.body.note, 
        title:req.body.title
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

// sent the user to the db  
//askeed the db for inforamtion and got it back
//Twitter example
  app.get('/new-note', function (req, res) {
  db.collection('documents').insertOne({ user: req.session.passport.user })
  
  //this is a promise 
  //then asks for a function what to do when the promise is done  
  .then(function(note){
    //whatever db.collection does wait for it then pass it through the function
    console.log(note._id);
      res.redirect('/my-notes?noteId=' + note._id)
    }, () => {})
   
  });


  app.get('/my-notes', function (req, res) {
    // couldnn't  search mongo by id because they store it as a object . 
    //find is giving every note that has the same id
    const objId = new ObjectId(req.query.noteId)
    console.log("current: ",objId);
    db.collection('documents').find({ "_id": objId  }).toArray((err, result) => {
    // res.render('my-notes.ejs');
    console.log("showing resultssss", result[0]);
    res.render('my-notes.ejs',{result: result})
  })
  });

  app.post('/my-notes', (req, res) => {
    db.collection('documents').save({ user: req.session.passport.user, title: req.body.title, note: req.body.note }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/my-notes')
    })

  })


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.delete('/my-notes', (req, res) => {
    // console.log('Looking for message id', req.body.messageid)
    //  converting string into a special object mongo can use id string to id object
    db.collection('documents').findOneAndDelete({ title: req.body.title, note: req.body.note, user: req.session.passport.user}, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
      console.log('Message Deleted')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/folders', // redirect to the secure folders section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/folders', // redirect to the secure folders section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/folders');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
