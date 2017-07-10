import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class ItemActive {
  constructor(opts) {

    this.model = opts.model;
    
    this.view = new View({
      model: this.model,
      container: '.item-active',
      events: {
        'deleteItem:click': function onDelete() {
          this.emit('deleteItem');
        },
        'uploadImg:click': function uploadImg() {
          const container = document.querySelector(this.container);
          const input = container.querySelector('input[type="file"]');
          input.click();
        },
        // TODO: set container class (landscape/portrait)
        // TBD: canvas to allow client-side resize?
        'file:change': function handleFiles(e) {

          const file = e.target.files[0];
          const imageType = /^image\//;

          if (!file || (!imageType.test(file.type))) {
            return;
          }
          const reader = new FileReader();
          reader.onload = function readerOnload(evt) {
            const container = document.querySelector(this.container);
            const img = container.querySelector('.item-active-img');
            img.style.backgroundImage = `url(${evt.target.result})`;
            img.classList.remove('error');

          }.bind(this);
          reader.readAsDataURL(file);
        },
        'updateText:keyup': function updateText(e) {
          // Maybe use input to see realtime change on list?
          // const i = this.model.get('itemActive') | 0;
          // const items = this.model.get('items').slice(0);
          // const item = items[i];

          // item.txt = e.currentTarget.value;
          // items.splice(i, 1, item);
          // this.model.set('items', items);
          if(e.keyCode === 13) {
            e.preventDefault();
            const container = document.querySelector(this.container);
            container.querySelector('button[type="submit"]').click();
          }
        },
        'startEdit:click': function startEdit() {
          this.emit('startEdit');
        },
        'form:submit': function finishEdit(e) {
          e.preventDefault();
          if(this.model.get('itemNew')) {
            if(e.target.querySelector('input[type="file"]').files.length) {
              e.target.querySelector('.item-active-img').classList.remove('error');
              this.emit('addItem', e);
            }
            else {
              e.target.querySelector('.item-active-img').classList.add('error');
            }
          }
          else {
            this.emit('updateItem', e);
          }
        },
      },
      template: require('../../templates/ItemActive.hbs'),
    });
    this.view.on('afterRender', function focusTextarea() {
      const container = document.querySelector(this.container);
      const textarea = container.querySelector('textarea');
      if(textarea) {
        const val = textarea.value;
        textarea.focus();
        textarea.setSelectionRange(0, val.length);
      }

    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
      events: opts.events,
    });
  }
}
