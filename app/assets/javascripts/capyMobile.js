// console.log("capystart")
Ext.define('WsConnection',{
  singleton: true,
  // webSocket: new WebSocketRails(window.location.hostname + ':3000/websocket'),
  id: '',
  gameChannel: '',
  sendEvent: function(method,args,successCB,failureCB){
    WsConnection.webSocket.trigger(method, 'blank', successCB,failureCB);

  }

});

Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    views: [
        'CapyClient'
    ],
    name: 'CapyMobile',
    appFolder: '/assets/mobile',

    launch: function() {

        Ext.create('CapyMobile.view.CapyClient', {fullscreen: true});
    }

});