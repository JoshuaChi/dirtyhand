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

