/**
 *
 * Websockets Connections
 *
 */
const WsConnection = require(`${__dirname}/wsconnection.js`);

module.exports = {
  init: function(server){

    const wsconnection = new WsConnection({
      server: {
        perMessageDeflate: false,
        server: server,
        clientTracking: true
      },
    });
    /**
     *
     * Messages arriving from gulp tasks
     *
     */

    process.on('message', (msg)=>{
      if(wsconnection.wss.clients.size) {
        if(msg.reload) {
          wsconnection.wss.clients.forEach((connection)=>{
            connection.send(JSON.stringify({
              event: 'client:reload',
              args: {
                reload: true,
              },
            }));
          });
        }
      }
      else{
        console.log('no connections');
      }
    });
  }
}