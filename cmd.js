var through2 = require('through2'),
    growl = require('growl');

function toOneLine(a,kimarite){
  if(kimarite){
    return [a.east.name,a.east.hoshi,"|",a.kimarite,"|",a.west.name,a.west.hoshi].join(" ");
  }else{
    return [a.east.name,a.east.hoshi,"-",a.west.name,a.west.hoshi].join(" ");
  }
};

var notify = through2.obj(function(o,e,next){
  if(o.kimarite!==''){
    growl(toOneLine(o),{title:'sumo-stream'});
  }
  this.push(o);
  next();
});

var sumo = require('.');
var opt = {interval: 30000};

sumo(opt).pipe(notify).on('data',function(data){
  if(data.kimarite!==''){
    console.log(toOneLine(data,true));
  }
});

console.log('[Start Sumo Stream]');
