const config = require('../../../config.json');

function init() {
  const list = document.querySelector('.list');

  function deleteItem(i) {
    fetch('/item',{
      method: 'delete',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index: i })
    })
    .then(response => response.json())
    .then((result)=>{
      list.innerHTML = '';
      result.forEach((item, i)=>{
        list.append(newItem(item, i));
      });
    });
  }

  function newItem(data, i) {
    const item = document.createElement('div');
    item.className = 'item-list';
    const img = document.createElement('img');
    img.src = data.img;
    const p = document.createElement('p');
    p.innerHTML = data.txt;
    item.append(img, p);
    item.addEventListener('click', ()=> {
      deleteItem(i);
    });
    return item;
  }

  function getItems() {
    fetch('/items', {
      method: 'get',
      credentials: 'include',
    })
    .then((response)=>{
      return response.json();
    })
    .then((result)=>{
      result.forEach((item, i)=>{
        list.append(newItem(item, i));
      });
    });
  }

  getItems();

  /*      TESTING MULTEOR UPLOAD       */
  function handleFiles(e) {
    const file = e.target.files[0];
    const imageType = /^image\//;
    const imageSize = 12 * 1000000; // edit number for MB

    if (!file || (!imageType.test(file.type) || file.size > imageSize)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function readerOnload(evt) {
      imgPreviewSrc: evt.target.result;
    };
    reader.readAsDataURL(file);
  }
  document.querySelector('input[type="file"]').addEventListener('change', handleFiles);
  document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault();
    const file = e.target.querySelector('input[type="file"]').files[0];
    const name = 'img';
    const fd = new FormData();
    fd.append(name, file);
    fd.append('txt', 'txsdasdasd asdsa asd');

    fetch('/item', {
      method: 'post',
      credentials: 'include',
      body: fd,
    })
    .then(response => response.json())
    .then((result)=>{
      list.innerHTML = '';
      result.forEach((item, i)=>{
        list.append(newItem(item, i));
      });
    });
  });
}

/* development */
if(config.livereload) {

  const wsServer = `ws://${config.ip}:${config.port}`;
  const WsConnection = require('./wsconnection');
  const ws = new WsConnection({
    wsServer: wsServer,
  });
  ws.init()
  .then(()=>{
    init();
  });

}
else {
  init();
}
