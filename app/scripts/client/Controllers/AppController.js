import Controller from './Controller.js';

export default class AppController extends Controller {
  constructor(opts) {
    super(opts);

    this.children = opts.children;
    this.views = this.children.map(children => children.view);

    this.view.on('beforeDestroy', this.destroySubViews.bind(this));
    this.view.on('afterRender', this.appendSubViews.bind(this));

  }
  destroySubViews() {

    this.views.forEach(view => view.destroy());
  }
  appendSubViews() {
    console.log('after render');
    this.views.forEach(view => view.render());
  }
}
