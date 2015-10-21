messageList = new Mongo.Collection("messages");

if (Meteor.isClient) {

  function blink() {
      $('.blink').fadeOut(500).fadeIn(500);
  }
  setInterval(blink, 1000);

  var curMessageId = 0;
  function createNewEmptyMessage() {
    return messageList.insert({from:Meteor.user().username,text:"",date:(new Date()).valueOf(),state:"standby"});
  }

  Tracker.autorun(function() {
    if (Meteor.user()!=undefined) {
      curMessageId = createNewEmptyMessage();
    }
  });

  Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });

  Template.main.helpers({
    userDefined: function() {
      return Meteor.user()!=undefined;
    }
  });

  Template.messages.helpers({
    messages: function () {
      return messageList.find({text:{$ne:""}},{sort:{date:-1},limit:10}).fetch();
    },
    formattedDate: function() {
      return (new Date(this.date)).toLocaleTimeString();
    }
  });

  Template.inputForm.events({
    'keyup #inputText' : function(event) {
        messageList.update({_id:curMessageId},{$set:{text:$("#inputText").val()}});
    },
    'click button' : function(event) {
        event.preventDefault();
        $("#inputText").val("");
        messageList.update({_id:curMessageId},{$set:{state:"submitted"}});
        curMessageId = createNewEmptyMessage();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
