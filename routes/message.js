'use strict';

const  messageObject  = []

const log = require('log4js').getLogger('message');

module.exports = {
    get: function (request, response) {
      // if(request.session.user && request.session.myself){
      //    return 
      // }
      return response.render('message', {messages:messageObject,messageback:"Hello, please leave a message, I will reply you as soon as possible and leave your contact information please."});
        
    },
    post:function (request, response) {
        if(!request.body.message && request.body.message.length > 0){
          return response.render('message', {messages:messageObject,messageback:"no world!"});
        }else {
          let date = new Date()
          let username = request.body.username
          let email = request.body.email
          let message = request.body.message
          let msg = [username,email,message];
          let ret = msg.filter(msg => msg != null)
          .filter(msg => msg.length>0)
          .filter(msg => msg.trim().length > 0)
          .join(":")
          messageObject.unshift({
            Date: date.toLocaleString(),
            message:ret
          });
          log.info(ret)
          return response.render('message', {messages:messageObject,messageback:"SUCCESS!"});
        }
    }
};

