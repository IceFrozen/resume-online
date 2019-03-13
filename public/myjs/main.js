window.onload = function(){
	newVm()
	initSocket()

}
var data = {
    currentServer:"all",
    logs:{
      "all":[]
    },
    messShow:[],
    filter:[],
    //checkServer:[],
    //windowHeight:$(window).height(),
    autoRoll:true
  };
var  newVm  = function(){
	
	
  $(window).resize(function() {
    //data.windowHeight = $(window).height();
  });

  var regex = [];
	var vm = new Vue({
    el:'#logshow',
    data:data,
    methods: {
      changeFilter:function(value){
        this.currentServer = value
      },
      showNice : function(value){
        var message = value.split(",")
        for(var i = 0;i < message.length;i++){
            this.messShow.push(message[i])
        }
      }
    },
    computed: {
      checkServer:function(){
        return data.logs[data.currentServer] || []
      
      }
    }
  });
	window.vm = vm
	return vm

}


var initSocket  = function(){
  //链接
  if(window.socket){
  	return 
  }
  var socket = io();
  socket.on("error",function(){
    console.log("error")
    window.socket = null
  })
  socket.on("disconnect",function(){
    console.log("disconnect")
    window.socket = null
  })
  window.socket = socket
  socket.on('logsInit', function (infos) {

    for (var i = infos.length - 1; i >= 0; i--) {
      dealOneMessage(infos[i])
    }
    

  })



  socket.on('log', function (info) {
      dealOneMessage(info)
    });
}


var dealOneMessage = function(info){
  var dataInfo = {
      timestamp:info["@timestamp"],
      serverId:info.fields.sid,
      level:info.fields.level,
      message:info.message,
      color:"red"
    }

    if(!_.contains(data.filter,dataInfo.serverId)){
      data.filter.push(dataInfo.serverId)
      data.logs[dataInfo.serverId]=[]
    }
    color(dataInfo)
    data.logs.all.unshift(dataInfo);
    if(data.logs.all.length > 500){
      data.logs.all.pop();
    }
    data.logs[dataInfo.serverId].unshift(dataInfo)
    if(data.logs[dataInfo.serverId].length > 500){
      data.logs[dataInfo.serverId].pop()
    }
  };



var color = function(dataInfo){
  
  if(dataInfo.level === 'DEBUG'){
    dataInfo.color="#4A4AFF"
  }
  if(dataInfo.level === 'INFO'){
    dataInfo.color="#00DB00"
  }
  if(dataInfo.level === 'ERROR'){
    dataInfo.color="#FF0000"
  }
  var message = dataInfo.message.replace("\\","").replace("\\\"","\"").replace(/\\\"/g,"\"").split('|')
  if(message.length === 1){
    dataInfo.path = "console"
    dataInfo.message = message[0]
  }else{
    dataInfo.path = message[1]
    dataInfo.message = ""
    for(var i =2; i < message.length; i++){
      dataInfo.message +=(message[i]+" ")
    }
  }
  //var messages = message.split('|')
}

