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
          `<div class="notes-item-ctr">
            <div class="notes-item">
              <span class="notes-content">${data[i].noteContent}</span>
              <div class="notes-item-btns">
                <button type="button" class="btn-edit" name="noteEdit" value="${data[i]._id}" onclick="displayEditPost(event)">Editer</button>
                <button type="button" class="btn-del" name="noteDel" value="${data[i]._id}" onclick="deletePost(event)">Supprimer</button>
              </div>
            </div>
            <form class="notes-form-edit" onsubmit="editPost(event)" hidden>
              <label for="noteContent-${data[i]._id}">Editer la note ci-dessous</label>
              <textarea id="noteContent-${data[i]._id}" name="noteContent" placeholder="Modifier la note">${data[i].noteContent}</textarea>
              <label for="noteId-${data[i]._id}" class="hidden">Note Id</label>
              <input id="noteId-${data[i]._id}" type="text" name="noteId" value="${data[i]._id}" placeholder="note id" class="hidden" />
              <button type="submit" class="btn-submit">Modifier</button>
            </form>
          </div>
        `;
      }
    } else {
      document.getElementById("notes").append("Vous n'avez pas de notes.");
    }
  })
}

var postButton = document.getElementById('form_post');
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

function displayEditPost(event) {
  const currentTarget = event.currentTarget;
  const postFormEdit = currentTarget.closest(".notes-item-ctr").querySelector(".notes-form-edit");
  if (postFormEdit.hidden === true) {
    postFormEdit.hidden = false;
  } else {
    postFormEdit.hidden = true;
  }
}

function editPost(event) {
  event.preventDefault();
  var noteId = event.target.noteId.value;
  var noteContent = event.target.noteContent.value;
  post = {
    noteContent: noteContent
  }
  const options = {
    method: 'PATCH',
    body: JSON.stringify(post),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }
  const URL = `/notes/${noteId}/edit`;
  const currentTarget = event.currentTarget;
  return fetch(URL, options)
  .then(res => res.json())
  .then(data => {
    let noteContent = data.updatedNote.noteContent
    return noteContent
  })
  .then(noteContent => {
    currentTarget.closest(".notes-item-ctr").querySelector(".notes-content").innerHTML = noteContent;
    currentTarget.hidden = true;
  })
}
