import Model from './Models/Model.js';
import View from './Views/View.js';
import AppController from './Controllers/AppController.js';
import ItemList from './itemList.js';
import ItemActive from './itemActive.js';
import Counter from './counter.js';
import Notifications from './notifications.js';

export default class App {
  constructor(opts) {

    this.model = new Model({
      attributes: opts.model.attributes,
    });

    this.view = new View({
      // noUpdate: true,
      model: this.model,
      container: document.querySelector('.app'),
      events: {
        'addItem:click': function addItem(e) {
          e.preventDefault();
          const items = this.model.get('items').slice(0);
          items.push({
            img: null,
            txt: null,
          });
          this.model.setBulk({
            'items': items,
            'itemEdit': true,
            'itemActive': items.length - 1,
          });
        },
      },
      template: require('../../templates/App.hbs'),
    });

    this.store = opts.store;
    this.notifications = new Notifications({
      model: {
        attributes: {
          action: 'in',
          state: 'info',
          msg: 'Loading items...',
          autohide: false,
        },
      },
      view: {
        container: '.notifications-container',
        template: require('../../templates/Notifications.hbs'),
      },
    });
    
    const self = this;
    const children = [
      new ItemList({
        model: this.model,
        events: {
          'deleteItem': function deleteItem(e) {

            // Move this logic to BE
            // This should just call: store.deleteItem()
            const i = this.model.get('itemActive') | 0;
            const items = this.model.get('items').slice(0);
            items.splice(i, 1);
            this.model.setBulk({
              'items': items,
              'itemActive': items.length ? items.length - 1 : 0,
              'itemEdit': items.length ? true : false 
            });
            e.cancelBubble = true;
          },
          'reorderItem': this.reorderItem,
          'startEdit': function startEdit() {
            console.log(this, self);
          },
        },
      }),
      new ItemActive({
        model: this.model,
        events: {
          'addItem': this.addItem
        },
      }),
      new Counter({
        model: this.model,
        events: {

        },
      }),
    ];

    this.controller = new AppController({
      model: this.model,
      view: this.view,
      children: children,
    });
  }
  getModel() {
    return this.controller.model.getJSON();
  }
  setModel(props) {
    this.controller.model.setBulk(props);
    return this.controller.model.getJSON();
  }
  getItems() {
    this.store.getItems()
    .then((result)=> {

    });
  }
  addItem(e) {

    const file = e.target.querySelector('input[type="file"]').files[0];
    const name = 'img';
    const txt = e.target.querySelector('textarea').value; // No safe string checks?
    const fd = new FormData();

    fd.append(name, file);
    fd.append('txt', txt);

    fetch('/item', {
      method: 'post',
      credentials: 'include',
      body: fd,
    })
    .then(response => response.json())
    .then((result)=>{
      console.log(result);
    });
  }
  reorderItem(prevIndex, currIndex) {
    // Move this to BE
    const items = self.model.get('items').slice(0);
    const item = items[prevIndex];
    currIndex = currIndex === -1 ? items.length - 1 : currIndex;
    items.splice(prevIndex, 1);
    items.splice(currIndex, 0, item); // FIXME: when dropping below item substr 1?
    self.emit('change', 'items', items);
  }
}
