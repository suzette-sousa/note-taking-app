window.addEventListener("DOMContentLoaded", getNotes());

function getNotes() {
  fetch(`/notes`)
  .then((response) => response.json())
  .then(function(data) {
    document.getElementById("notes").innerHTML = '';
    if(data.length !== 0) {
      var notesCtr = document.createElement("ul");
      notesCtr.setAttribute("id", "notes-list")
      for(var i in data) {
        notesCtr.innerHTML +=  '<li class="notes-item">' + data[i].noteContent + `<button type="button" class="btn-del" name="noteDel" value="${data[i]._id}" onclick="deletePost(event)">x</button></li>`;
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
    .then(function(data) {
        var notesList = document.getElementById("notes-list");
        notesList.innerHTML += '<li class="notes-item">' + data.noteContent + `<button type="button" class="btn-del" name="noteDel" value="${data._id}" onclick="deletePost(event)">x</button></li>`;
    })
    .then(err => console.log(err))
}


function deletePost(event) {
  event.preventDefault();
  var noteIdDel = event.target.value;
  const options = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      noteIdDel: noteIdDel
    })
  }
  const URL = `/notes/${noteIdDel}/delete`;
  fetch(URL, options)
  .then(res => res.json())
  .then(data => console.log(data))
  .then(event.currentTarget.parentNode.remove())
}
