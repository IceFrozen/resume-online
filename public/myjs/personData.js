var newVm  = function(data){
	var vm = new Vue({
    el:'#person',
    data:data,
    methods: {
      leaveMessage:function () {
        document.getElementById('leaveMessage').submit();
        top.location.href = "message"
      },
      jumpto:function(url) {
        top.location.href = url
      }
    },
    computed: {

    }
  });
	window.person = vm
	return person
}
// window.$.getJSON("./upload/person.json").then(function(data){ 
//   data.photo_pic_tmp = [1]  //fix bug
//   newVm(data)
// })


window.onload = function(){
	window.$.getJSON("/upload/person.json").then(function(data){ 
    data.photo_pic_tmp = [1]  //fix bug
    newVm(data)
  })
}


