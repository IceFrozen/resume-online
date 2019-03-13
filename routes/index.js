'use strict';

module.exports = {
    get: function (request, response) {

      if(request.query.loginout){
        return response.render('index', {message:"不输入密码则是访客系统"});
      }
    	if(request.session.user){
          response.redirect('/resume');
        }else{
        	return response.render('index', {message:"不输入密码则是访客系统"});
        }
    },
    post:function (request, response) {
    	var name = request.body.name
      	var password = request.body.password
      	if(password === "123456"){
      		request.session.user  = true
          request.session.myself = true
      		return response.redirect('/resume');
      	}else{
          request.session.user  = true
          request.session.myself = false
          return response.redirect('/resume');
      	}
    }
};

