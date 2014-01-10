function RoomClient(name) {
  var messages = [];
  var presences = [];
  var wrongHandler = false;

  this.message = when.defer();
  this.presence = when.defer();
  this.fail = when.defer();

  this.messages = function() { return messages.slice(); }
  this.presences = function() { return presences.slice(); }
  this.wrongHandler = function() { return wrongHandler; }
  this.name = function() { return name; }

  this.onCreateSuccess = function(stanza, room) {
    console.log("create room success!"+stanza+"; room:"+room);
  }

  this.onCreateError = function(stanza, room) {
    console.log("create room error!"+stanza+"; room:"+room);
  }
  this.onMessage = function(stanza, room) {
    if(room.name != name) {
      wrongHandler = true;
      this.fail.resolver.resolve();
      this.fail = when.defer();
      return false;
    }

    console.log("room:"+room+" get message: "+stanza);

    messages.push(stanza);
    this.message.resolver.resolve();
    this.message = when.defer();
    return true;
  }.bind(this);

  this.onPresence = function(stanza, room) {
    if(room.name != name) {
      wrongHandler = true;
      this.fail.resolver.resolve();
      this.fail = when.defer();
      return false;
    }

    presences.push(stanza);
    this.presence.resolver.resolve();
    this.presence = when.defer();
    Muc.plugin.listRooms("conference.strophejs.lab", Muc._listRooms, function(error){
     console.log(error);
    });
    return true;
  }.bind(this);
};

Muc = {
  chatDialog: null,
  connection: null,
  plugin: null,

  joinChat: function(self){
      var chartRoomName = self.attr('data-jid');
      var myNickName = $('#myname').val();
      var roomClient = new RoomClient(chartRoomName);
      Muc.plugin.join(chartRoomName, myNickName, roomClient.onMessage, function(stanza, room){ roomClient.onPresence(stanza, room);Muc._listOccupants(chartRoomName);});
  },
  _onMessage: function(msg) {
              console.log(msg);
              var elements = msg.getElementsByTagName('body');
              if (0 < elements.length) {
                var data = elements[0].text || elements[0].textContent;
                ary = data.split('#');
                if('available' == ary[1]){
                  $('#'+ary[0]).removeClass('inactive').addClass('active');
                }else{
                  $('#'+ary[0]).removeClass('active').addClass('inactive');
                }
                /*var jsonData = data.evalJSON();*/
                /*rtns[jsonData.body.event_name](jsonData.body.event_body);*/
              }
              // We must return true to keep the handler alive.
              // Returning false would remove it after it finishes.
              return true;
            },
  _onPresence: function(pres) {
               console.log(pres);
               var elements = pres.getElementsByTagName('show');
               if (0 < elements.length) {
                 var data = elements[0].text || elements[0].textContent;
                 var to = pres.getAttribute("to");
                 ary = to.split('@');
                 if('available' == data){
                    $('#'+ary[0]).removeClass('inactive').addClass('active');
                 }else{
                    $('#'+ary[0]).removeClass('active').addClass('inactive');
                 }
               }
             },
  _listRooms: function(rooms){
                $(rooms).find('item').each(function(){
                    var roomJid = $(this).attr('jid');
                    var roomName = $(this).attr('name');

                    var jidClassName = roomJid.toLowerCase().replace('@', '-').replace('.', '_').replace('.', '_');

                    if($('ul#rooms').find("li#"+jidClassName).length < 1) {
                  $('ul#rooms').append('<li id="'+jidClassName+'" class="room list-group-item"><a class="available btn btn-link" href="#" onclick="Muc.joinChat($(this));return false;"data-jid="'+roomJid+'">'+roomJid+'</a></li>');
                    }
                });
           },
  _listOccupants: function(name) {
     Muc.plugin.queryOccupants(name, function(data){
        $(data).find('item').each(function(){
            var occupantJid = $(this).attr('jid');
            var ocupantName = $(this).attr('name');
            var jidClassName = occupantJid.toLowerCase().replace('@', '-').replace('.', '_').replace('.', '_').replace('/', '_');
            if($('ul#chat-dialog').find("li#"+jidClassName).length < 1) {
              $('ul#chat-dialog').append('<li id="'+jidClassName+'"><a href="#" class="available">'+ocupantName+'</a></li>');
            }
         });
         Muc.chatDialog.dialog("open");
     });
  },
  _initLoginName: function(name){
    $('input#myname').val(name);
    $('p#my-name-label').text(name);
  },

  _initDialogs: function(){
    $('#login_dialog').dialog({
      autoOpen: true,
      draggable: false,
      model: true,
      title: 'Connect to XMPP',
      buttons: {
        "Connect": function () {
          $(document).trigger('connect', {
            jid: $('#jid').val(),
            password: $('#password').val()
          });
          $('#password').val('');
          $(this).dialog('close');
        }
      }
    });
    Muc.chatDialog = $("#chat-dialog-div");
    Muc.chatDialog.dialog({
      autoOpen: false,
      width: 800,
      height: 300,
    });
    $('#create-room-dialog').dialog({
      autoOpen: false,
      buttons: {
        "Create": function() {
          var roomName = $(this).find("input.name").first().val();
          var roomClient = new RoomClient(roomName+"@conference.strophejs.lab");
          var myNickName = $('#myname').val();
          Muc.plugin.join(roomClient.name(), myNickName, roomClient.onMessage, roomClient.onPresence);
          $( this ).dialog( "close" );
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    });
  },

  _bindLinks: function(){
    $('#create-room').click(function(){
      $('#create-room-dialog').dialog('open');
    });
    $('#disconnect').click(function () {
      $('#disconnect').attr('disabled', 'disabled');
      $('input#myname').val('');
      $('span#my-name-label').text('');
      Muc.connection.disconnect();
    });
  },
};


$(document).ready(function () {
  Muc._initDialogs();
  Muc._bindLinks();
});

$(document).bind('connect', function (ev, data) {
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
        $(document).trigger('disconnected');
      } else if (status == Strophe.Status.CONNECTED) {
        console.log('Connected');
        $(document).trigger('connected');
      }
      return true;
    });
    Muc.connection = conn;
    Muc.plugin = conn.muc
});
$(document).bind('connected', function () {
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
});
$(document).bind('disconnected', function () {
    Muc.connection = null;
    $('#roster').empty();
    $('#login_dialog').dialog('open');
});
