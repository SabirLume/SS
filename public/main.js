var trash = document.getElementsByClassName("fas fa-trash");
var save = document.getElementsByClassName("takeNote");
var star = document.getElementsByClassName("fa-star");
var starFav = star[0].id == 'true' ? true : false;


Array.from(save).forEach(function (element) {
  element.addEventListener('click', function () {
    console.log(starFav, darkMode)
    console.log(star)
    console.log(moon)
    // const title = this.parentNode.innerText;
    const title = document.getElementById("title").value;
    const note = document.getElementById("text").value;
    // The URLSearchParams() constructor creates and returns a new URLSearchParams object.
    // window.location.search returns the query string of the current window everything after the '?'
    const urlParams = new URLSearchParams(window.location.search);
    console.log('================ urlsearch', urlParams)
    //this gets everything afer 'noteId' && the '=' in the url allowing us to target just the unique id
    const qParam = urlParams.get('noteId')
    console.log("", qParam)
    fetch('save', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      //puts  objects strings into a form that can be sent 
      body: JSON.stringify({
        //proprty name is title
        'note': note,
        'title': title,
        'qParam': qParam,
        'darkMode': darkMode,
        'starFav': starFav

      })
    }).then(function (response) {
      // window.location.reload()
    })
  });
});

Array.from(star).forEach(function (element) {
  element.addEventListener('click', function () {
    element.classList.toggle("star");
    // ! is syntaxatacital sugar allows me to switch from true and false (switch case)
    starFav = !starFav;
    console.log("this is the star favvvvvvvvv", starFav)
  })

})
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    // const note = this.parentNode.parentNode.childNodes[3].innerText;
    const title = this.parentNode.parentNode.childNodes[1].innerText || null;
    // const user = this.getAttribute("data-user");
    console.log("this is the title:", title)
    fetch('folders', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      //puts  objects strings into a form that can be sent 
      body: JSON.stringify({
        //proprty name is title   
        // 'note': note,
        'title': title
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

