
var trash = document.getElementsByClassName("fa-trash");
var save = document.getElementsByClassName("takeNote");

Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function(){
      const note = this.parentNode.parentNode.childNodes[3].innerText;
      const title = this.parentNode.parentNode.childNodes[1].innerText;
      const user = this.getAttribute("data-user");
      console.log("user: ", user)
      console.log("this is the title:", title)
      console.log("this is the note" , note)
      fetch('my-notes', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        //puts  objects strings into a form that can be sent 
        body: JSON.stringify({
            //proprty name is title   
          'note': note,
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
      // const noteId = this.parentNode.parentNode.childNodes[3].value
      // const note = this.parentNode.childNode[2].childNode.innerText;
      console.log("this is the noteeeeeeee: ",note)
      console.log("this is the titleeeeeeee: ", title)
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

        })
      }).then(function (response) {
        // window.location.reload()
      })
    });
  });