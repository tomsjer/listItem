import Model from './Models/Model.js';
import View from './Views/View.js';
import AppController from './Controllers/AppController.js';
import ItemList from './itemList.js';
import ItemActive from './itemActive.js';
import Counter from './counter.js';

export default class App {
  constructor(opts) {

    this.model = new Model({
      attributes: opts.model.attributes,
    });

    this.view = new View({
      // noUpdate: true,
      model: this.model,
      container: document.querySelector('body'),
      events: {
        'addItem:click': function addItem(e) {
          e.preventDefault();
          const items = this.model.get('items').slice(0);
          items.push({
            img: '',
            txt: '',
          });
          this.model.setBulk({
            'items': items,
            'itemEdit': true,
            'itemActive': items.length - 1
          });
        },
      },
      template: require('../../templates/App.hbs'),
    });

    const children = [new ItemList(this.model), new ItemActive(this.model), new Counter(this.model)];
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
}
