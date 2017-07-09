export function bindKeyToState(app, keys) {

  for (const i in keys) {
    window.addEventListener('keyup', (e)=> {
      if (e.keyCode === (i | 0)) {
        app.setModel(keys[i]);
      }
    });
  }
}
