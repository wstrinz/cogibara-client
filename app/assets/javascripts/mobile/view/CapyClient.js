Ext.define('CapyMobile.view.LockableCarousel',{
  extend: 'Ext.Carousel',
  alias: 'widget.lockablecarousel',
  toggleSwipe: function(allow) {
          this.element[allow ? 'on' : 'un']({
              dragstart : 'onDragStart',
              drag      : 'onDrag',
              dragend   : 'onDragEnd',
              scope     : this
          });
      },
});

Ext.define('CapyMobile.view.CapyClient', {
 extend: 'Ext.Container',
 config: {
   itemId: 'CapyClient',
   layout: 'vbox',
   fullscreen: true,
   listeners: {
    painted: function(c){
      var field = Ext.ComponentQuery.query("[type='text']")[0]
      document.querySelector("#"+field.element.first().id).onwebkitspeechchange = function(e) {
        WsConnection.webSocket.trigger('send_text', field.getValue())
        field.setValue('')
        field.setPlaceHolder('')
      }
    }
   },
   items: [
   {
     xtype: 'container',
     flex: 1,
     layout: 'hbox',
     items: [
     {
       xtype: 'lockablecarousel',
       layout: 'fit',
       flex: 3,
       indicator: false,
       items: [
       {
         xtype: 'panel',
         layout: 'vbox',
         items: [
         {
           xtype: 'textfield',
           flex: 3,
           clearIcon: false,
           placeHolder: "Click here, type something and press enter. If you're not sure, try 'what can you do?'",
            listeners: {
                keyup: function(field, e) {
                    if (e.browserEvent.keyCode == 13 || e.browserEvent.keyCode == 10) {
                      WsConnection.webSocket.trigger('send_text', field.getValue())
                      field.setValue('')
                      field.setPlaceHolder('')
                    }
                },

                blur: function(field){
                  field.focus()
                },
            }
         },
        ]
       },
       {
        xtype: 'container',
        items: []
       }
      ]
     },
    {
      xtype: 'image',
      src: '/assets/microphone.svg',
      flex: 1,
      listeners: {
        tap: {
          fn: function(){
            carousel = this.up().items.items[0]
            carousel.setActiveItem(carousel.getActiveIndex() == 0 ? 1 : 0)
          },
          element: 'element'
        }
      }
    },
    ]
  },
  {
   xtype: 'lockablecarousel',
   layout: 'fit',
   flex: 5,
   indicator: false,
   items:[
     {
       xtype: 'list',
       fullscreen:false,
       allowDeselect: true,
       useComponents: true,
       scrollToTopOnRefresh: false,
       itemId: 'messageList',
       itemTpl: '{Message}',
       store: {
         fields: ['Message'],
         data: [
         ]
       },

      listeners: {
        order : 'after',
        select: function(self, record, opts){
          var msg = record.data.Message
          if(msg[0] != 'y'){
            msg = msg.substr(msg.indexOf(" ") + 1)
            this.up().items.items[1].setHtml('<audio src="http://tts-api.com/tts.mp3?q=' + msg + '" autoplay></audio>')
          }
        },
        deselect: function(){
          this.up().items.items[1].setHtml("")
        }
      }
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
  ]
  },

  initialize: function(){
   var self = this
   WsConnection.webSocket = new WebSocketRails(window.location.hostname + ':3000/websocket'),
   WsConnection.webSocket.on_open = function() {
     console.log('the sockets are open')
   };

    var dataview = self.items.items[1].items.items[0]
    var infield = self.items.items[0].items.items[0].items.items[0].items.items[0]
    infield.innerElement.dom.firstChild.childNodes[0].setAttribute('x-webkit-speech','x-webkit-speech')
    infield.innerElement.dom.firstChild.childNodes[0].setAttribute('speech','speech')
    infield.element.first().on('webkitspeechchange', function() {
        alert('webkitspeechchange')
    });

    var success = function(channelID) {
    console.log('assigned id '+ channelID);
    WsConnection.webSocket.id = channelID.toString();
    self.items.items[0].items.items[0].items.items[1].setHtml("<form method='POST' enctype='multipart/form-data' action='process_file'> <input type=file name='upfile' capture='camera'> <input type=submit value=Send></form>")

    self.items.items[1].toggleSwipe(false)
    self.items.items[0].items.items[0].toggleSwipe(false)
    var channel = WsConnection.webSocket.subscribe(channelID.toString());
    channel.bind('event', function(message){
      var dataview = self.items.items[1].items.items[0]
      var scroller = dataview.getScrollable().getScroller()
      dataview.getStore().add({Message: message})

      dataview.select(dataview.getStore().getCount()-1)

      Ext.Function.defer(scroller.scrollToEnd,100,scroller)
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
}

);