document.getElementById("file").onchange = function() {
   document.getElementById("form").submit();
  // cosnt = filePath = document.getElementById("file").value
  // console.log(filePath)
  // fetch('fileUpload', {
  //   method: 'put',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   //puts  objects strings into a form that can be sent 
  //   body: JSON.stringify({
  //     //proprty name is title
  //     'image': filePath

  //   })
  // }).then(function (response) {
  //   // window.location.reload()
  // }).catch( err => {
  //   console.log(err)
  // })
};

// Array.from(save).forEach(function (element) {
//   element.addEventListener('click', function () {
//     console.log(starFav, darkMode)
//     console.log(star)
//     console.log(moon)
//     // const title = this.parentNode.innerText;
//     const title = document.getElementById("title").value;
//     const note = document.getElementById("text").value;
//     // The URLSearchParams() constructor creates and returns a new URLSearchParams object.
//     // window.location.search returns the query string of the current window everything after the '?'
//     const urlParams = new URLSearchParams(window.location.search);
//     console.log('================ urlsearch', urlParams)
//     //this gets everything afer 'noteId' && the '=' in the url allowing us to target just the unique id
//     const qParam = urlParams.get('noteId')
//     console.log("", qParam)
//     fetch('save', {
//       method: 'put',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       //puts  objects strings into a form that can be sent 
//       body: JSON.stringify({
//         //proprty name is title
//         'note': note,
//         'title': title,
//         'qParam': qParam,
//         'darkMode': darkMode,
//         'starFav': starFav

//       })
//     }).then(function (response) {
//       // window.location.reload()
//     })
//   });
// });