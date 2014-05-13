var through2 = require('through2'),
    growl = require('growl');

function toOneLine(a,kimarite){
  if(kimarite){
    return [a[0],a[1],"|",a[2],"|",a[3],a[4]].join(" ");
  }else{
    return [a[0],a[1],"-",a[3],a[4]].join(" ");
  }
};

var notify = through2.obj(function(o,e,next){
  if(o[2]!==''){
    growl(toOneLine(o),{title:'sumo-stream'});
  }
  this.push(o);
  next();
});

var sumo = require('.');
var opt = {interval: 30000};

sumo(opt).pipe(notify).on('data',function(data){
  if(data[2]!==''){
    console.log(toOneLine(data,true));
  }
});

console.log('[Start Sumo Stream]');
