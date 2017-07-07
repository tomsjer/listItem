import EventEmitter from 'events';

export default class Model extends EventEmitter {
  constructor(opts) {
    super(opts);
    this.attributes = opts.attributes;
  }
  set(attr, value) {
    this.attributes[attr] = value;
    this.emit('change', attr);
    console.log('modelChanged: ', attr, value);
  }
  get(attr) {
    return this.attributes[attr];
  }
  getJSON() {
    return this.attributes;
  }
}
