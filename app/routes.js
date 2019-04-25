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
  // app.put('/fileUpload', upload.single('file-to-upload'), (req, res) => {
  //   const { image } = req.body;
  //   console.log(image)
  //   Tesseract.recognize(image)
  //   .then(function(result){
  //     console.log("translation------------",result)
  //     db.collection('documents').findOneAndUpdate({ "_id": ObjectId('5cbe6bd77b5204b709a7e085')  }, {
  //       $set: {
  //        image: result.text
  //       }
  //     }, {
  //       sort: {_id: -1},
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })

  //   }).catch( err => {
  //     console.log(err)
  //   })
  //   // console.log("imagee ----", image)
  // })
  app.post('/fileUpload', upload.single('file-to-upload'), (req, res) => {
    console.log("file upload", req.file)
    console.log(req.body.noteId)
    var id =  req.body.noteId.trim()
    console.log("the id", typeof id )
    // Recognize text of any language in any format
    //tesseract is grabbing the file from the path the image is being saved
    Tesseract.recognize(req.file.path)
    //figures what words are in the image
    .then(function (result) {
        console.log(result.text)
        // db.collection('documents').save({ user: req.session.passport.user, title: req.body.title, note: result.text }, (err, result) => {
        //   if (err) return console.log(err)
        //   console.log('saved to database')
        //   res.redirect('/my-notes');
        // })
        db.collection('documents').findOneAndUpdate({ "_id": ObjectId(id)  }, {
                $set: {
                 textFromImage: result.text
                }
              
      });
      res.redirect('/my-notes?noteId=' + id)
    });
  });

    // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });


  // folders SECTION =========================
  app.get('/folders', isLoggedIn, function (req, res) {
    db.collection('documents').find({ user: req.session.passport.user }).toArray((err, result) => {
      if (err) return console.log(err)
      console.log(result)
      const favorites = result.filter((document) => document.starFav ).sort((a, b) => b.title - a.title)
      const notFavorites = result.filter((document) => !document.starFav).sort((a, b) => b.title - a.title)
      const sortedByFavorites = favorites.concat(notFavorites)
      res.render('folders.ejs', {
        //passing the array of objects into file to use it
        documents: sortedByFavorites
      })
    })
  });


  // sent the user to the db  
  //askeed the db for inforamtion and got it back
  //Twitter example -- when you see links to different websites on twitter they direct you to their server first
  //then to the link so they can collect data on how many people click the link

  //we are using GET with a insertOne because we can only get an mongoDB id by creating a document . INSERTONE inserts a 
  // document into a collection. Now we  want to 
  //get the id from that new document and incorporate it into our my-notes route because we want our notes to have a
  //unique Id.


  //why didn't we just use a post request to create the doc? because we would of already made the doc without 
  //being able to grab the unique id and putting it into the url
    app.get('/new-note', function (req, res) {

    db.collection('documents').insertOne({user: req.session.passport.user,title: null, note: null})
    //this is a promise 
    //then asks for a function what to do when the promise is done  
    .then(function({ops}){
      const objId = ops[0]._id
      console.log("get note: ", objId)
      //whatever db.collection does wait for it then pass the information from the document into the function
      //redirect us to a my-notes page with the unique id
      res.redirect('/my-notes?noteId=' + objId)
      }, () => {})
     
    });
  
    //this is the route where we go to when we already have a note and want to look it up.
    app.get('/my-notes', function (req, res) {
      // couldnn't  search mongo by id because they store it as a object. 
      //find is giving every note that has the same id
      // not using new becuase new was giving us another new hash different from the one we already have.
      const objId = ObjectId(req.query.noteId)
      console.log("my note: ",objId);
      db.collection('documents').find({ "_id": objId  }).toArray((err, result) => {
        //grabing the [0] index of result because we made objId into an array
        console.log("result", result)
      res.render('my-notes.ejs',{result: result[0]})
    })
    });

  app.put('/save', (req, res) => {
    console.log("put: ", req.body.qParam)
    const { note, title, darkMode, starFav, textFromImage, qParam} = req.body;
    console.log(req.body)
    db.collection('documents')
    //finding that qParam we put in our main.js in our DB and updating that DOC in mongo with the information in $set
    .findOneAndUpdate({ "_id": ObjectId(qParam)  }, {
      $set: {
        note,
        title,
        darkMode,
        starFav,
        textFromImage 
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

    app.delete('/folders', (req, res) => {
      console.log('Looking for message id', req.body.title)
      //  converting string into a special object mongo can use id string to id object
      db.collection('documents').findOneAndDelete({ title: req.body.title }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
        console.log('Message Deleted')
        console.log(req.body.title, req.body.note)
      })
    })




    


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


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
