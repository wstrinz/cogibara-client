



Ext.define('CapyMobile.view.CapyClient', {
     extend: 'Ext.Container',
     // requires: ['Ext.ux.Fileup'],
    config: {
       itemId: 'CapyClient',
       layout: 'vbox',
       fullscreen: true,
       items: [
           // {
           //             xtype: 'list',

          //             items: {
           //                 xtype: 'toolbar',
           //                 docked: 'top',
           //                 title: 'Sencha Touch Team'
           //             },

          //             store: {
           //                 fields: ['name'],
           //                 data: [
           //                     {name: 'Rob'},
           //                     {name: 'Ed'},
           //                     {name: 'Jacky'},
           //                     {name: 'Jamie'},
           //                     {name: 'Tommy'},

         //                     {name: 'Abe'}
           //                 ]
           //             },

          //             itemTpl: '{name}'
           //         },
           {
             xtype: 'container',
             flex: 1,
             // width: 325,
            // height: 75,
           layout: 'hbox',
           items: [
          {
             xtype: 'carousel',
             layout: 'fit',
             flex: 4,
             indicator: false,
             items: [
             {
               xtype: 'container',
                 // html: "<iframe width='100%' height='100%' src='file_upload' frameborder='0' allowfullscreen></iframe>",
                 // width: 200,
                 // height: 55,
                 // flex: 3,
                 items: []
               },
               {
                 xtype: 'panel',
                 layout: 'vbox',
                 items: [
                 {
                   xtype: 'textfield',
                   flex: 3,
                 },
                 {
                   xtype: 'button',
                   text: 'Send',
                     flex: 1,
                   handler: function(){
                     success = function(){
                       console.log('successful!')
                     };
                     WsConnection.webSocket.trigger('send_text', this.up().items.items[0], success)
                   }
                 }
                 ]
               },
               ]
             },
           {
             xtype: 'image',
             src: '/assets/microphone.svg',
             // width: 100,
             flex: 1,
             listeners: {
               tap: {
                 fn: function(){
                   // console.log('imgtap')
                   carousel = this.up().items.items[0]
                   carousel.setActiveItem(carousel.getActiveIndex() == 0 ? 1 : 0)
                   },
                 element: 'element'
               }
             }
           },
           ]
         },
         // {
         //     xtype: 'carousel',
         //     minwidth: 350,
         //     height: 200,
         //     defaults: {
         //         styleHtmlContent: true
         //     },
         //     items: [
         //         {
         //             html : 'Item 1',
         //             style: 'background-color: #5E99CC'
         //         },
         //         {
         //             html : 'Item 2',
         //             style: 'background-color: #759E60'
         //         },
         //         {
         //             html : 'Item 3'
         //         }
         //     ]
         // }
         {
           xtype: 'carousel',
           layout: 'fit',
           // height: 275,
           flex: 6,
           items:[
             {
               xtype: 'dataview',
               fullscreen:false,
               itemId: 'messageList',
               // height: 300,
               // width: 100,
                   store: {
                       fields: ['Message'],
                       data: [
                           // {Message: 'test'},
                       ]
                   },
                   itemTpl: '{Message}',
             },
             {
               xtype: 'formpanel',
               items: [
               {
                 xtype: 'selectfield',
                 label: 'Method',
                 options: [
                 {text: 'Chat', value:'chat'},
                 {text: 'Translate', value:'translate'},
                 ],
                 listeners: {
                   change: function(selectbox,newValue,oldValue){
                     WsConnection.sendEvent("set_method",newValue)
                   }
                 }
                 },
               {
                 xtype: 'spacer',
                 height: 38,
                 width: 282
               },
               {
                 xtype: 'selectfield',
                 label: 'Language',
                 options: [
                 {text: 'English', value:'english'},
                 {text: 'Spanish', value:'spanish'},
                 {text: 'Japanese', value:'japanse'},
                 {text: 'German', value:'german'},
                 {text: 'Dutch', value:'dutch'},
                 {text: 'Guess', value:'guess'},
                 ],
                 listeners: {
                   change: function(selectbox,newValue,oldValue){
                     WsConnection.sendEvent("set_language",newValue)
                   }
                 }
               }
               ]
             }
           ]
         }
           // {
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },
         // {
         //     xtype: 'panel',
         //     itemId: 'displayContainer',
         //     id: 'dipcontainer',
         //     layout: 'default',
         //     height: 100,
         //     width: 318,
         //     html: "asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>asdf<br>",
         //     items: [
         //       {
         //   xtype: 'button',
         //   height: 100,
         //   width: 30,
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'panel'
         // },{
         //   xtype: 'button'
         // },{
         //   xtype: 'button'
         // },
         //     ],
         //     // autoScroll: true,
         //     // scrollable: true
         //     scrollable: {
         //       direction: 'vertical',
         //       directionLock: false,
         //       scroller : {
         //           bounces: false,
         //           listeners: {
         //               scroll : function(scroller, x, y) {
         //                   // console.log('scrolling!');
         //               }
         //           }
         //       }
         //     },
         // },
     ]
 },
   initialize: function(){
   var self = this
     // var store =
    WsConnection.webSocket = new WebSocketRails(window.location.hostname + ':3000/websocket'),
     WsConnection.webSocket.on_open = function() {
       console.log('the sockets are open')
         // Ext.getCmp('connectWindow').incCounter()
       // Ext.get('connectWindow').dom.incCounter()
       // var loadRecord = Ext.data.StoreManager.lookup('loadStore').getAt(0)
       // loadRecord.set("data1", loadRecord.get("data1") + 1 )
     };
     var success = function(channelID) {
           console.log('assigned id '+ channelID);
             WsConnection.webSocket.id = channelID.toString();
           self.items.items[0].items.items[0].setHtml( "<iframe width='100%' height='100%' src='file_upload?clid=" + WsConnection.webSocket.id + "' frameborder='0' allowfullscreen></iframe>") //.getStore().add({Message: message})

            var channel = WsConnection.webSocket.subscribe(channelID.toString());
           // console.log(channel)
             // Ext.getCmp('connectWindow').incCounter();
             channel.bind('event', function(message){
             // console.log(self.query('displayContainer'))
             // console.log(Ext.ComponentQuery.query('displayContainer'))
             // Ext.ComponentQuery.query('displayContainer').update(message)
             // console.log(Ext.getCmp('dipcontainer'))
             // Ext.getCmp('dipcontainer').update(message)
             // console.log(self.items.items[1])
             // var currentmsgs = self.items.items[1].getHtml() ? self.items.items[1].getHtml() : ""
             // console.log(self.items.items[1].items)
             self.items.items[1].items.items[1].getStore().add({Message: message})
             // Ext.ComponentQuery.query('messageList')[0].getStore().add({Message: message})
               // Ext.MessageBox.alert(message)
             // var json = JSON.parse(message);
             // var index;
             // // console.log( self.networkEvents)
             // for (index = 0; index < self.networkEvents.length; index++) {
             //   var ne = self.networkEvents[index];
             //   if (!json.event.localeCompare(ne.name)) {
             //     ne.processor.call(ne.scope, json);
             //   }
             // }
           });
             channel.bind('progress', function(message){
             var image = self.items.items[0].items.items[1];
             if(message == "transcribe"){
               image.setSrc('/assets/write.svg')
             }
             else if(message == "think"){
               image.setSrc('/assets/thought.svg')
             }
             else if(message == "search"){
               image.setSrc('/assets/search.svg')
             }
             else if(message == "listen"){
               image.setSrc('/assets/microphone.svg')
             }
           });
         }
         WsConnection.webSocket.trigger('get_new_id', 'blank', success);
 }

);