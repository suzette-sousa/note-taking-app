window.addEventListener("DOMContentLoaded", getNotes());

function getNotes() {
  fetch(`/notes`)
  .then((response) => response.json())
  .then(function(data) {
    document.getElementById("notes").innerHTML = '';
    if(data.length !== 0) {
      var notesCtr = document.createElement("ul");
      for(var i in data) {
        notesCtr.innerHTML +=  '<li class="notes-item">' + data[i].noteContent + '</li>';
      }
      document.getElementById("notes").append(notesCtr);
    } else {
      document.getElementById("notes").append("Vous n'avez pas de notes.");
    }
  })
}

var postButton = document.getElementById('user_form_post');
postButton.addEventListener('submit', newPost);

function newPost(event, post) {
  event.preventDefault();
  var noteContent = event.target.noteContent.value;
  post = {
    noteContent: noteContent
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(post),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }
  return fetch('/notes/create', options)
    .then(res => res.json())
    .then(getNotes())
    .then(err => console.log(err))
}
