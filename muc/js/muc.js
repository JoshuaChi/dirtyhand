MultiCast = {
  connection: null,
  plugin: null,
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
};

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

  this.onMessage = function(stanza, room) {
    if(room.name != name) {
      wrongHandler = true;
      this.fail.resolver.resolve();
      this.fail = when.defer();
      return false;
    }

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
    return true;
  }.bind(this);
};


$(document).ready(function () {
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
  $('#disconnect').click(function () {
    $('#disconnect').attr('disabled', 'disabled');
    MultiCast.connection.disconnect();
  });
});

$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection('http://pubsub.lab:5280/http-bind');
    conn.connect(data.jid, data.password, function (status) {
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
        $(document).trigger('connected');
      }
      return true;
    });
    MultiCast.connection = conn;
    MultiCast.plugin = conn.muc
});
$(document).bind('connected', function () {
    $('#disconnect').removeAttr('disabled');
    var rooms = [new RoomClient("room-1@localhost"),
                 new RoomClient("room-2@localhost")];

    var gotPresence = false;
    var gotMessage = false;
    MultiCast.plugin.join(rooms[0].name(), "dima", rooms[0].onMessage, rooms[0].onPresence);
    rooms[0].presence.promise.then(function() {
      gotPresence = true;
      MultiCast.plugin.groupchat(rooms[0].name(), "Hello, world!");
      return true;
    }.bind(this));
    rooms[0].message.promise.then(function() {
      gotMessage = true;
      return true;
    });
    MultiCast.plugin.join(rooms[1].name(), "dima", rooms[1].onMessage, rooms[1].onPresence);
});
$(document).bind('disconnected', function () {
    MultiCast.connection = null;
    $('#roster').empty();
    $('#login_dialog').dialog('open');
});
