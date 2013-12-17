MultiCast = {
  connection: null,
  _onMessage: function(msg) {
              console.log(msg);//{type:multicast, user:110, status:available, pool:pool1}
              var elements = msg.getElementsByTagName('body');
              if (0 < elements.length) {
                var data = elements[0].text || elements[0].textContent;
                data = jQuery.parseJSON(data);
  
                if ('multicast' == data.type){
                  if('available' == data.status){
                    console.log(data.user+"available");
                    $('#fav_'+data.user+ ' > span').removeClass('disabled').removeClass('offline').addClass('online');
                  }else{
                    console.log(data.user+"unavailable");
                    $('#fav_'+data.user+ ' > span').removeClass('online').removeClass('disabled').addClass('offline');
                  }
                }

              }
              // We must return true to keep the handler alive.
              // Returning false would remove it after it finishes.
              return true;
            },
  _onPresence: function(pres) {
               // console.log(pres);
               // var elements = pres.getElementsByTagName('show');
               // if (0 < elements.length) {
               //   var data = elements[0].text || elements[0].textContent;
               //   var to = pres.getAttribute("to");
               //   ary = to.split('@');
               //   if('available' == data){
               //      $('#'+ary[0]).removeClass('inactive').addClass('active');
               //   }else{
               //      $('#'+ary[0]).removeClass('active').addClass('inactive');
               //   }
               // }
             },
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
          jid: $('#jid').val()+"@master.joshua.kaufmich.lab",
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
        console.log('Connected');
        $("#iam").text(data.jid);
        $(document).trigger('connected');
      }
      return true;
    });
    MultiCast.connection = conn;
});
$(document).bind('connected', function () {
    $('#disconnect').parent().removeClass('disabled');
    MultiCast.connection.send($pres());
    MultiCast.connection.addHandler(MultiCast._onMessage, null, 'message', null, null,  null);
    MultiCast.connection.addHandler(MultiCast._onPresence, null, 'presence', null, null,  null);
});
$(document).bind('disconnected', function () {
    MultiCast.connection = null;
    $('#login_dialog').dialog('open');
});
