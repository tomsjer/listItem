import View from './Views/View.js';
import Controller from './Controllers/Controller.js';

export default class ItemActive {
  constructor(model) {
    this.model = model;
    this.view = new View({
      model: this.model,
      container: '.item-active',
      events: {
        'deleteItem:click': function onDelete() {
          // Move this logic to BE
          const i = this.model.get('itemActive') | 0;
          const items = this.model.get('items').slice(0);
          items.splice(i, 1);
          this.model.setBulk({
            'items': items,
            'itemActive': items.length - 1,
          });
        },
        'uploadImg:click': function uploadImg() {
          const container = document.querySelector(this.container);
          const input = container.querySelector('input[type="file"]');
          input.click();
        },
        'file:change': function handleFiles(e) {
          const i = this.model.get('itemActive') | 0;
          const items = this.model.get('items').slice(0);
          const file = e.target.files[0];
          const imageType = /^image\//;

          if (!file || (!imageType.test(file.type))) {
            return;
          }
          const reader = new FileReader();
          reader.onload = function readerOnload(evt) {
            items[i].img = evt.target.result;
            this.emit('change', 'items', items);
          }.bind(this);
          reader.readAsDataURL(file);
        },
        'updateText:change': function updateText(e) {
          // Maybe use input to see realtime change on list?
          const i = this.model.get('itemActive') | 0;
          const items = this.model.get('items').slice(0);
          const item = items[i];

          item.txt = e.currentTarget.value;
          items.splice(i, 1, item);
          // this.model.set('items', items);
        },
        'startEdit:click': function startEdit() {
          this.model.set('itemEdit', true);
        },
        'finishEdit:click': function finishEdit() {
          // TODO: submit changes
          this.model.set('itemEdit', false);
        },
      },
      template: require('../../templates/ItemActive.hbs'),
    });
    this.controller = new Controller({
      model: this.model,
      view: this.view,
    });
  }
}
