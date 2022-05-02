function getLastIndex() {
  let lastIndex = window.localStorage.getItem('lastIndex');
  if (lastIndex) {
    return Number(lastIndex);
  } else {
    window.localStorage.setItem('lastIndex', 0);
    return 0;
  }
}

function setLastIndex(index) {
  window.localStorage.setItem('lastIndex', index);
}

function getPictures() {
  return window.localStorage.getItem('pictures');
}
function setPictures(pictures) {
  try {
    window.localStorage.setItem('pictures', JSON.stringify(pictures));
  } catch (e) {
    alert('Su browser tiene el localstorage lleno, subir este archivo ha fallado');
  }
}

function addNewPic(picture) {
  let pictures = getPictures();
  if (pictures) {
    pictures = JSON.parse(pictures);
    pictures.push(picture);
  } else {
    pictures = [picture];
  }
  setPictures(pictures);
}

document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('modal').setAttribute('style', 'display: none');
});

document.getElementById('open-modal').addEventListener('click', function () {
  document.getElementById('modal').setAttribute('style', 'display: flex');
});

document.getElementById('new-pic-btn').addEventListener('click', function () {
  let title = document.getElementById('title-new-pic').value;
  let author = document.getElementById('author-new-pic').value;
  let description = document.getElementById('desc-new-pic').value;
  let reader = new FileReader();
  let file;
  reader.onload = (event) => {
    console.log('loaded', event.target.result);
    file = event.target.result;
    addNewPic({
      title: title || 'No title',
      author: author || 'No author',
      description: description || 'No description',
      file: file,
    });
    renderPictures(getLastIndex());
    document.getElementById('max-page').innerHTML = Math.ceil(JSON.parse(getPictures()).length / 2);
  };
  reader.readAsDataURL(document.getElementById('file-new-pic').files[0]);
  console.log(document.getElementById('file-new-pic').files[0]);
});

document.getElementById('file-new-pic').addEventListener('change', function () {
  let file = document.getElementById('file-new-pic').files[0];
  if (file) {
    document.getElementById('btn-delete').setAttribute('style', 'display: flex');
  }
});

document.getElementById('btn-delete').addEventListener('click', function () {
  document.getElementById('file-new-pic').value = '';
  document.getElementById('btn-delete').setAttribute('style', 'display: none');
});

function renderPictures(index) {
  let pictures = getPictures();
  let html = '';
  if (pictures) {
    pictures = JSON.parse(pictures);

    for (let i = index * 2; i < index * 2 + 2; i++) {
      if (pictures[i]) {
        html += `
        <div class="w-full relative py-4 flex flex-col justify-center items-center h-auto aspect-square bg-white">
          <img src="${pictures[i].file}" alt="img" class="object-cover w-10/12 h-4/6">
          <div class="w-10/12 h-2/6 flex flex-col gap-y-1 justify-end">
            <div class="sm:text-2xl text-xl w-full h-1/3 flex items-center">
              <span class="truncate mt-1">${pictures[i].title}</span>
            </div>
            <div class=" sm:text-xl text-lg w-full h-1/3 flex items-center">
              <img src="assets/imgs/user.png" alt="user" class="w-3 h-3 object-contain mr-1">  
              <span class="truncate mt-1">By ${pictures[i].author}</span>
            </div>
          </div>
          <div class="text-white flex justify-center items-center text-2xl w-full h-full absolute bg-black opacity-0 transition-all duration-150 ease-in-out hover:opacity-100 bg-opacity-75">
            <div class="w-max h-full overflow-y-auto max-w-full p-6 text-center">
             ${pictures[i].description}
            </div>
          </div>
        </div>
        
      `;
      }
    }
  }
  document.getElementById('pictures-container').innerHTML = html;
}

document.getElementById('next').addEventListener('click', function () {
  let lastIndex = getLastIndex();
  let pictures = JSON.parse(getPictures());
  if (lastIndex < Math.ceil(pictures.length / 2) - 1) {
    lastIndex++;
    setLastIndex(lastIndex);
    renderPictures(lastIndex);
    console.log('newlasstindex:', lastIndex);
    document.getElementById('current-page').innerHTML = lastIndex + 1;
    renderButtons(lastIndex);
  }
});

document.getElementById('previous').addEventListener('click', function () {
  let lastIndex = getLastIndex();
  if (lastIndex > 0) {
    lastIndex--;
    setLastIndex(lastIndex);
    renderPictures(lastIndex);
    document.getElementById('current-page').innerHTML = lastIndex + 1;
    console.log('newlasstindex:', lastIndex);
    renderButtons(lastIndex);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('current-page').innerHTML =
    getLastIndex() == '0' ? '1' : getLastIndex() + 1;
  document.getElementById('max-page').innerHTML = Math.ceil(JSON.parse(getPictures()).length / 2);
  renderPictures(getLastIndex());
  console.log('currentLastIndex: ' + getLastIndex());
  renderButtons(getLastIndex());
});

function renderButtons(index) {
  if (index == 0) {
    document.getElementById('previous').setAttribute('style', 'opacity: 0.5');
    document.getElementById('previous').setAttribute('disabled', 'disabled');
    document.getElementById('previous').classList.add('pointer-events-none');
  } else {
    document.getElementById('previous').setAttribute('style', 'opacity: 1');
    document.getElementById('previous').removeAttribute('disabled');
    document.getElementById('previous').classList.remove('pointer-events-none');
  }
  if (index == Math.ceil(JSON.parse(getPictures()).length / 2) - 1) {
    document.getElementById('next').setAttribute('style', 'opacity: 0.5');
    document.getElementById('next').setAttribute('disabled', 'disabled');
    document.getElementById('next').classList.add('pointer-events-none');
  } else {
    document.getElementById('next').setAttribute('style', 'opacity: 1');
    document.getElementById('next').removeAttribute('disabled');
    document.getElementById('next').classList.remove('pointer-events-none');
  }
}
