var Muc = (function(){
    return {
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
              xmpp.onConnect({
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
    }
  })();


$(document).ready(function () {
  Muc._initDialogs();
  Muc._bindLinks();
});

