'use strict';


module.exports = {
    get: function (request, response) {
      return   response.render('resume',{fileName:"/upload/person.pdf"});    
    }
};

