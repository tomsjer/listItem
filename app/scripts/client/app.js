import Model from './Models/Model.js';
import View from './Views/View.js';
import AppController from './Controllers/AppController.js';
import ItemList from './itemList.js';
import ItemActive from './itemActive.js';
import Counter from './counter.js';

import store from '../utils/store.js';
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
            'itemNew': true
          });
        },
      },
      template: require('../../templates/App.hbs'),
    });

    // Maintaining a consistent interface, store could be  localStorage/DB/...
    this.store = store;
    
    this.notifications = new Notifications({
      model: {
        attributes: {
          action: 'in',
          state: 'info',
          msg: 'Loading items...',
          autohide: true,
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
          'reorderItem': this.reorderItem.bind(this),
          'startEdit': function startEdit() {
            this.model.setBulk({
              'itemEdit': true,
              'itemNew': false
            });
          }.bind(this),
        },
      }),
      new ItemActive({
        model: this.model,
        events: {
          'addItem': this.addItem.bind(this),
          'startEdit': function startEdit() {
            this.model.set('itemEdit', true);
          }.bind(this),
          'updateItem': this.updateItem.bind(this),
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

    this.preloaderWrapper = document.querySelector('.preloader-wrapper');
    this.getItems();
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
      this.setModel({
        loading: false,
        items: result.items,
      });
      this.notifications.model.setBulk({
        action: 'out',
        msg: 'Done!',
        state: 'success',
      });
      this.preloaderWrapper.style.opacity = 0;
      setTimeout(()=>{
        this.preloaderWrapper.remove();
      }, 1000);
    });
  }
  addItem(e) {

    const fd = this.prepareFormSubmit(e);

    this.notifications.model.setBulk({
      action: 'in',
      state: 'info',
      msg: 'Saving item...',
    });

    this.store.saveItem(fd)
    .then((response)=>{
      if(!response.code) {
        this.setModel({ items: response.items, itemEdit: false });
        this.notifications.model.setBulk({
          action: 'out',
          state: 'success',
          msg: 'Saved! :)',
        });
      }
      else {
        this.notifications.model.setBulk({
          autohide: false,
          action: 'out',
          state: 'error',
          msg: 'Something went wrong... :(',
        });
      }
    });
  }
  reorderItem(prevIndex, currIndex) {
    this.notifications.model.setBulk({
      action: 'in',
      state: 'info',
      msg: 'Saving list...',
    });
    this.store.saveItems(prevIndex, currIndex)
    .then((response)=>{
      if(!response.code) {
        this.setModel({ items: response.items });
        this.notifications.model.setBulk({
          action: 'out',
          state: 'success',
          msg: 'Saved! :)',
        });
      }
      else {
        this.notifications.model.setBulk({
          autohide: false,
          action: 'out',
          state: 'error',
          msg: 'Something went wrong... :(',
        });
      }
    });
  }
  updateItem(e) {
    const fd = this.prepareFormSubmit(e);
    const index = this.model.get('itemActive');
    fd.append('index', index);

    this.notifications.model.setBulk({
      action: 'in',
      state: 'info',
      msg: 'Saving item...',
    });
    this.store.updateItem(fd)
    .then((response)=>{
      if(!response.code) {
        this.setModel({ items: response.items });
        this.notifications.model.setBulk({
          action: 'out',
          state: 'success',
          msg: 'Saved! :)',
        });
      }
      else {
        this.notifications.model.setBulk({
          autohide: false,
          action: 'out',
          state: 'error',
          msg: 'Something went wrong... :(',
        });
      }
    });
  }
  prepareFormSubmit(e) {
    const file = e.target.querySelector('input[type="file"]').files[0];
    const name = 'img';
    const txt = e.target.querySelector('textarea').value; // No safe string checks?
    const fd = new FormData();

    fd.append(name, file);
    fd.append('txt', txt);

    return fd;
  }
}
