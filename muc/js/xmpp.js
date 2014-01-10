var xmpp = (function(){
  return {
    onConnect: function (data) {
        Muc._initLoginName(data.jid);
        var conn = new Strophe.Connection('http://strophejs.lab:5280/http-bind');
        conn.connect(data.jid+"@strophejs.lab", data.password, function (status) {
          if (status == Strophe.Status.CONNECTING) {
            console.log('Connecting...');
          } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Failed to connect!');
          } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Disconnecting...');
          } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Disconnected');
            xmpp.onDisconnected();
          } else if (status == Strophe.Status.CONNECTED) {
            console.log('Connected');
            xmpp.onConnected();
          }
          return true;
        });
        Muc.connection = conn;
        Muc.plugin = conn.muc
    },
    onConnected: function () {
        $('#disconnect').removeAttr('disabled');
        /*$('#list-room').removeAttr('disabled');*/

         Muc.plugin.listRooms("conference.strophejs.lab", Muc._listRooms, function(error){
           console.log(error);
         });
         /*var rooms = [new RoomClient("joshuaroom@conference.strophejs.lab"),*/
         /*new RoomClient("jessicaroom@conference.strophejs.lab")];*/

         /*var gotPresence = false;*/
         /*var gotMessage = false;*/
         /*Muc.plugin.join(rooms[0].name(), "Joshua", rooms[0].onMessage, rooms[0].onPresence);*/
         /*rooms[0].presence.promise.then(function() {*/
         /*gotPresence = true;*/
         /*Muc.plugin.groupchat(rooms[0].name(), "Hello, world!");*/
         /*return true;*/
         /*}.bind(this));*/
         /*rooms[0].message.promise.then(function() {*/
         /*gotMessage = true;*/
         /*return true;*/
         /*});*/
         /*Muc.plugin.join(rooms[0].name(), "David", rooms[0].onMessage, rooms[0].onPresence);*/
         /*Muc.plugin.join(rooms[1].name(), "Jessica", rooms[1].onMessage, rooms[1].onPresence);*/
    },
    onDisconnected : function () {
        Muc.connection = null;
        $('#roster').empty();
        $('#login_dialog').dialog('open');
    },
  }
})();
