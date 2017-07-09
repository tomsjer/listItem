import EventEmitter from 'events';

export default class Model extends EventEmitter {
  constructor(opts) {
    super(opts);
    this.attributes = opts.attributes;
  }
  set(attr, value, bulk = false) {
    this.attributes[attr] = value;
    if(!bulk) {
      this.emit('change', attr);
      console.log('modelChanged: ', attr, value);
    }
  }
  setBulk(props) {
    for (const i in props) {
      this.set(i, props[i], true);
    }
    this.emit('change');
    console.log('modelChanged: ', this.getJSON());
  }
  get(attr) {
    return this.attributes[attr];
  }
  getJSON() {
    return this.attributes;
  }
}
