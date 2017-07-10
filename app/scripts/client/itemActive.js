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

          }.bind(this);
          reader.readAsDataURL(file);
        },
        'updateText:change': function updateText(e) {
          // Maybe use input to see realtime change on list?
          // const i = this.model.get('itemActive') | 0;
          // const items = this.model.get('items').slice(0);
          // const item = items[i];

          // item.txt = e.currentTarget.value;
          // items.splice(i, 1, item);
          // this.model.set('items', items);
        },
        'startEdit:click': function startEdit() {
          this.emit('startEdit');
        },
        'form:submit': function finishEdit(e) {
          e.preventDefault();
          if(e.target.querySelector('input[type="file"]').files.length) {
            if(this.model.get('itemNew')) {
              this.emit('addItem', e);
            }
            else {
              this.emit('updateItem', e);
            }

          }
          else {
            console.log('no img.. show error');
          }
        },
      },
      template: require('../../templates/ItemActive.hbs'),
    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
      events: opts.events,
    });
  }
}
