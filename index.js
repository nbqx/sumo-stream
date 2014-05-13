var _differ = require('lodash.difference');

var fork = require('child_process').fork;
var c = fork(__dirname+'/lib/crawl.js');
var _past = [];

var Readable = require('stream').Readable;

module.exports = function(opts){
  try{
    var s = new Readable({objectMode:true});
    s._read = function(){};
    
    c.on('message',function(data){
      var now = data.val;
      var diff = _differ(now,_past);

      if(diff.length!==0){
        diff.forEach(function(o){
          s.push(o.split('-'));
        });
      }

      _past = now;
    });
    
    c.send({msg:'start',opts:opts});

    return s;
  }catch(e){
    process.exit();
  }
};

