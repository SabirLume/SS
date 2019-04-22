var trash = document.getElementsByClassName("fas fa-trash");
var save = document.getElementsByClassName("takeNote");
var star = document.getElementsByClassName("fa-star");
var moon = document.getElementsByClassName("fa-moon")
Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function(){
      // const note = this.parentNode.parentNode.childNodes[3].innerText;
      const title = this.parentNode.parentNode.childNodes[1].innerText || null; 
      const user = this.getAttribute("data-user");
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

Array.from(save).forEach(function(element) {
    element.addEventListener('click', function(){
      // const title = this.parentNode.innerText;
      const title= document.getElementById("title").value;
      const note = document.getElementById("text").value;
      // The URLSearchParams() constructor creates and returns a new URLSearchParams object.
      // window.location.search returns the query string of the current window everything after the '?'
      const urlParams = new URLSearchParams(window.location.search);
      console.log('================ urlsearch', urlParams)
      //this gets everything afer 'noteId' && the '=' in the url allowing us to target just the unique id
      const qParam = urlParams.get('noteId')
      console.log("",qParam)
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
          'qParam': qParam
        })
      }).then(function (response) {
        // window.location.reload()
      })
    });
  });

  Array.from(star).forEach(function(element) {
    element.addEventListener('click', function(){
 
    element.classList.toggle("star")
    // fetch('star',{
    //   method: 'put',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     'star': star,
    //   })

    // })
   
 })

})
Array.from(moon).forEach(function(element) {
  element.addEventListener('click', function(){
  const body = document.querySelectorAll('.dark-mode')
  body.classList.add("dark-body")
 
})

})

var selected

function dragOver( e ) {
  if ( isBefore( selected, e.target ) ) e.target.parentNode.insertBefore( selected, e.target )
  else e.target.parentNode.insertBefore( selected, e.target.nextSibling )
}

function dragEnd() {
  selected = null
}

function dragStart( e ) {
  //(e) is the short var reference for event object which will be passed to event handlers. Keeps track of events that
  //occur on the page and allows you to react to them using scripts
  e.dataTransfer.effectAllowed = "move"
  // dataTransfer is used to hold the data that is being dragged during a drag && drop operation
  //effectAllowed provides all the types of operations possible -- none , copy, copyLink, copyMove, move, all , or unititialized
  e.dataTransfer.setData( "text/plain", null )
  //dtaTransfer.setData - sets the data for a given type. if data doesnt exist, it is added to the end, so that the last item
  //item in the types list will be the new format. if data for the type already exists the existing data is replaced inthe same postion
  selected = e.target
  //e.target referes to the clicked <li> element
}

function isBefore( el1, el2 ) {
  var cur
  if ( el2.parentNode === el1.parentNode ) {
    for ( cur = el1.previousSibling; cur; cur = cur.previousSibling ) {
      //previousSibiling shows the node for the node immdediately preceding specified in its parent's childNode list
      if (cur === el2) return true
    }
  } else return false;
}