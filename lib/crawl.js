var request = require('request'),
    jsdom = require('jsdom'),
    _defaults = require('lodash.defaults'),
    _map = require('lodash.map'),
    _reduce = require('lodash.reduce');

const URL = "http://www.sumo.or.jp/";
var opts = {
  interval: 5000
};

function getHoshitori(done){
  jsdom.env(URL,["http://code.jquery.com/jquery.js"],function(err,root){
    var $ = root.$;
    var trs = $("div[class='cover'] table tr");
    var data = _reduce(trs,function(m,o){
      var d = {};
      var tds = _map($(o).find('td'),function(td){ 
        if($(td).find('img').length===0){
          return $(td).text().replace(/\r\n|\r|\n|\t/g,'');
        }else{
          var hoshi = $(td).find('img').attr('alt');
          return (hoshi==='白丸')? '◯' : '×';
        }
      });
      m.push(tds.join('-'));
      return m
    },[]);
    done(data);
  });
};

process.on('message',function(obj){
  var m = obj.msg;
  var t;
  
  if(m==='start'){
    opts = _defaults(obj.opts || {}, opts);
    getHoshitori(function(data){
      process.send({val:data});
      t = setInterval(function(){
        getHoshitori(function(data){
          process.send({val:data});
        });
      },opts.interval);
    });
  }
  else if(m==='stop'){
    clearInterval(t);
    process.exit();
  }
});

process.on('exit',function(){
  process.exit(1);
});

process.on('exit',function(){
  console.log('bye!');
});
