window.addEventListener("DOMContentLoaded", getNotes());

function getNotes() {
  fetch('/notes')
  .then((response) => response.json())
  .then(function(data) {
    document.getElementById("notes").innerHTML = '';
    if(data.length !== 0) {
      var notesCtr = document.getElementById("notes");
      for(var i in data) {
        notesCtr.innerHTML +=  
        '<div class="notes-item">' 
          + data[i].noteContent +
          `<button type="button" class="btn-del" name="noteDel" value="${data[i]._id}" onclick="deletePost(event)">x</button>
          <button type="button" class="btn-edit" name="noteEdit" value="${data[i]._id}" onclick="editPost(event)">Editer</button>
        </div>`;
      }
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
    .then(function(err) {
      console.log(err)
        if(err.message) {
          var errorMsg = document.getElementById("error");
          errorMsg.innerHTML = "Erreur dans la saisie de votre nouvelle note";
          console.log(err.message)
        } else {
          location.reload()
        }
      })
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
  .then(event.currentTarget.parentNode.remove())
  .then(location.reload())
}
