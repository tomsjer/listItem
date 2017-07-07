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
      noUpdate: true,
      model: this.model,
      container: document.querySelector('body'),
      events: {
        'addItem:click': (e) => {
          e.preventDefault();
          console.log(e);
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

    setTimeout(()=>{
      this.controller.model.set('items',[0,1,2,3])
    }, 1000);
  }
}
