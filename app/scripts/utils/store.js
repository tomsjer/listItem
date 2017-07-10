const store = {
  getItems:function(){
    return new Promise((resolve, reject)=>{
      fetch('/items', {
        method: 'get',
        credentials: 'include',
      })
      .then(response => response.json())
      .then((result)=>{
        resolve(result);
      });
    });
  },
  saveItem:function(fd) {
    return new Promise((resolve, reject)=> {
      fetch('/item', {
        method: 'post',
        credentials: 'include',
        body: fd,
      })
      .then(response => response.json())
      .then((result)=>{
        resolve(result);
      });
    });
  },
  saveItems:function(prevIndex, currIndex) {
    return new Promise((resolve, reject)=> {
      fetch('/items', {
        method: 'put',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prevIndex: prevIndex,
          currIndex: currIndex,
        }),
      })
      .then(response => response.json())
      .then((result)=>{
        resolve(result);
      });
    });
  },
  updateItem:function(fd) {
    return new Promise((resolve, reject)=> {
      fetch('/item', {
        method: 'put',
        credentials: 'include',
        body: fd,
      })
      .then(response => response.json())
      .then((result)=>{
        resolve(result);
      });
    });
  }
};

export default store;
