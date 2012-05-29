(function(c,s,j){c.addEvent=function(a,b){this.__bindEvents||(this.__bindEvents={});var d=a.split(".")[0];this.__bindEvents[d]||(this.__bindEvents[d]=[]);this.__bindEvents[d].push({handler:b,name:a});return this};c.removeEvent=function(a,b){if(this.__bindEvents){for(var d=0,c=this.__bindEvents[a.split(".")[0]],e;d<c.length;)e=c[d],b&&e.handler===b||!b&&e.name===a?c.splice(d,1):d++;return this}};c.dispatch=function(a){if(this.__bindEvents){var b=this.__bindEvents[a.type.split(".")[0]]||[],d=this,f=
[a].concat(a.data||[]);c.each(b,function(b,c){a.data=f.slice(1);c.handler.apply(d,f)})}};var o=document.createElement("table"),A=document.createElement("tr"),U={tr:document.createElement("tbody"),tbody:o,thead:o,tfoot:o,td:A,th:A,"*":document.createElement("div")},sa=/^\s*<(\w+)[^>]*>/,ta=function(a,b){b===j&&(b=sa.test(a)&&RegExp.$1);b in U||(b="*");var d=U[b];d.innerHTML=""+a;return[].slice.call(d.childNodes)};c.buildFragment=function(a){var a=ta(a[0]),b=document.createDocumentFragment();a.forEach(function(a){b.appendChild(a)});
return{fragment:b}};c.trim=function(a){return a&&a.trim()};c.makeArray=Array.from;c.isArray=function(a){return"array"===typeOf(a)};c.inArray=function(a,b){return b.indexOf(a)};c.map=function(a,b){return Array.from(a||[]).map(b)};c.each=function(a,b){var d;if("number"==typeof a.length&&a.pop)for(d=0;d<a.length&&!1!==b(d,a[d]);d++);else for(d in a)if(!1===b(d,a[d]))break;return a};c.extend=function(a){if(!0===a){var b=c.makeArray(arguments);b.shift();return Object.merge.apply(Object,b)}return Object.append.apply(Object,
arguments)};c.param=function(a){return Object.toQueryString(a)};c.isEmptyObject=function(a){return 0===Object.keys(a).length};c.proxy=function(a){var b=c.makeArray(arguments),a=b.shift();return a.bind.apply(a,b)};c.isFunction=function(a){return"function"==typeOf(a)};c.bind=function(a,b){this.bind&&this.bind!==c.bind?this.bind(a,b):this.addEvent?this.addEvent(a,b):c.addEvent.call(this,a,b);return this};c.unbind=function(a,b){this.unbind&&this.unbind!==c.unbind?this.unbind(a,b):this.removeEvent?this.removeEvent(a,
b):c.removeEvent.call(this,a,b);return this};c.trigger=function(a,b,d,f){f=f===j?!0:f;d=d||[];if(a.fireEvent)for(a=a[0]||a;a;){b.type||(b={type:b,target:a});var e=a.retrieve("events");e&&e[b.type]&&e[b.type].keys.each(function(a){a.apply(this,[b].concat(d))},this);a=f&&a.parentNode}else"string"===typeof b&&(b={type:b}),b.data=d,c.dispatch.call(a,b)};c.delegate=function(a,b,d){this.delegate?this.delegate(a,b,d):this.addEvent&&this.addEvent(b+":relay("+a+")",d);return this};c.undelegate=function(a,
b,d){this.undelegate?this.undelegate(a,b,d):this.removeEvent&&this.removeEvent(b+":relay("+a+")",d);return this};var V={type:"method",success:j,error:j},H=function(a,b){for(var d in a)b[d]="function"==typeof b[d]?function(){a[d].apply(a,arguments)}:d[a]};c.ajax=function(a){var b=c.Deferred(),d=c.extend({},a),f;for(f in V)d[f]!==j&&(d[V[f]]=d[f],delete d[f]);var e=a.success,g=a.error;d.onSuccess=function(d){"json"===a.dataType&&(d=eval("("+d+")"));H(h.xhr,b);b.resolve(d,"success",h.xhr);e&&e(d,"success",
h.xhr)};d.onError=function(){H(h.xhr,b);b.reject(h.xhr,"error");g(h.xhr,"error")};var h=new Request(d);h.send();H(h.xhr,b);return b};c.$=function(a){return a===s?s:$$(a)};var ua=document.id;document.id=function(a){return a&&11===a.nodeType?a:ua.apply(document,arguments)};c.append=function(a,b){"string"===typeof b&&(b=c.buildFragment([b],[]).fragment);return a.grab(b)};c.filter=function(a,b){return a.filter(b)};c.data=function(a,b,d){return d===j?a[0].retrieve(b):a.store(b,d)};c.addClass=function(a,
b){return a.addClass(b)};c.remove=function(a){return a.filter(function(a){if(1!==a.nodeType)a.parentNode.removeChild(a);else return!0}).destroy()};var va=Element.prototype.destroy;Element.prototype.destroy=function(){c.trigger(this,"destroyed",[],!1);for(var a=this.getElementsByTagName("*"),b=0,d;(d=a[b])!==j;b++)c.trigger(d,"destroyed",[],!1);va.apply(this,arguments)};c.get=function(a,b){return a[b]};var v=function(a){if(!(this instanceof v))return new v;this._doneFuncs=[];this._failFuncs=[];this._resultArgs=
null;this._status="";a&&a.call(this,this)};c.Deferred=v;c.when=v.when=function(){var a=c.makeArray(arguments);if(2>a.length){var b=a[0];return b&&c.isFunction(b.isResolved)&&c.isFunction(b.isRejected)?b:v().resolve(b)}var d=v(),f=0,e=[];c.each(a,function(b,c){c.done(function(){e[b]=2>arguments.length?arguments[0]:arguments;++f==a.length&&d.resolve.apply(d,e)}).fail(function(){d.reject(arguments)})});return d};o=function(a,b){return function(d){var c=this._resultArgs=1<arguments.length?arguments[1]:
[];return this.exec(d,this[a],c,b)}};A=function(a,b){return function(){var d=this;c.each(arguments,function(c,e,g){e&&(e.constructor===Array?g.callee.apply(d,e):(d._status===b&&e.apply(d,d._resultArgs||[]),d[a].push(e)))});return this}};c.extend(v.prototype,{pipe:function(a,b){var d=c.Deferred();this.done(function(){d.resolve(a.apply(this,arguments))});this.fail(function(){b?d.reject(b.apply(this,arguments)):d.reject.apply(d,arguments)});return d},resolveWith:o("_doneFuncs","rs"),rejectWith:o("_failFuncs",
"rj"),done:A("_doneFuncs","rs"),fail:A("_failFuncs","rj"),always:function(){var a=c.makeArray(arguments);a.length&&a[0]&&this.done(a[0]).fail(a[0]);return this},then:function(){var a=c.makeArray(arguments);1<a.length&&a[1]&&this.fail(a[1]);a.length&&a[0]&&this.done(a[0]);return this},isResolved:function(){return"rs"===this._status},isRejected:function(){return"rj"===this._status},reject:function(){return this.rejectWith(this,arguments)},resolve:function(){return this.resolveWith(this,arguments)},
exec:function(a,b,d,f){if(""!==this._status)return this;this._status=f;c.each(b,function(b,c){c.apply(a,d)});return this}});var wa=/==/,xa=/([A-Z]+)([A-Z][a-z])/g,ya=/([a-z\d])([A-Z])/g,za=/([a-z\d])([A-Z])/g,W=/\{([^\}]+)\}/g,r=/"/g,Aa=/'/g,X;c.extend(c,{esc:function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(r,"&#34;").replace(Aa,"&#39;")},getObject:X=function(a,b,d){var a=a?a.split("."):[],f=a.length,e,g,h,i=0,b=c.isArray(b)?b:[b||s];if(0==f)return b[0];
for(;e=b[i++];){for(h=0;h<f-1&&/^f|^o/.test(typeof e);h++)e=a[h]in e?e[a[h]]:d&&(e[a[h]]={});if(/^f|^o/.test(typeof e)&&(g=a[h]in e?e[a[h]]:d&&(e[a[h]]={}),g!==j))return!1===d&&delete e[a[h]],g}},capitalize:function(a){return a.charAt(0).toUpperCase()+a.slice(1)},underscore:function(a){return a.replace(wa,"/").replace(xa,"$1_$2").replace(ya,"$1_$2").replace(za,"_").toLowerCase()},sub:function(a,b,d){var c=[],d="boolean"==typeof d?!d:d;c.push(a.replace(W,function(a,g){var h=X(g,b,d);return/^f|^o/.test(typeof h)?
(c.push(h),""):""+h}));return 1>=c.length?c[0]:c},replacer:W,undHash:/_|-/});var I=0;c.Construct=function(){if(arguments.length)return c.Construct.extend.apply(c.Construct,arguments)};c.extend(c.Construct,{newInstance:function(){var a=this.instance(),b;a.setup&&(b=a.setup.apply(a,arguments));a.init&&a.init.apply(a,b||arguments);return a},_inherit:function(a,b,d){c.extend(d||a,a||{})},setup:function(a){this.defaults=c.extend(!0,{},a.defaults,this.defaults)},instance:function(){I=1;var a=new this;I=
0;return a},extend:function(a,b,d){function f(){if(!I)return this.constructor!==f&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.constructor.newInstance.apply(this.constructor,arguments)}"string"!=typeof a&&(d=b,b=a,a=null);d||(d=b,b=null);var d=d||{},e=this.prototype,g,h,i,l;l=this.instance();this._inherit(d,e,l);for(g in this)this.hasOwnProperty(g)&&(f[g]=this[g]);this._inherit(b,this,f);if(a){i=a.split(".");h=i.pop();i=e=c.getObject(i.join("."),s,!0);var J=c.underscore(a.replace(/\./g,
"_")),D=c.underscore(h);e[h]=f}c.extend(f,{prototype:l,namespace:i,shortName:h,_shortName:D,_fullName:J,constructor:f,fullName:a});f.prototype.constructor=f;h=[this].concat(c.makeArray(arguments));l=f.setup.apply(f,h);f.init&&f.init.apply(f,l||h);return f}});var t=function(a){return a&&"object"===typeof a&&!(a instanceof Date)},K=function(a,b){return c.each(a,function(a,c){c&&c.unbind&&c.unbind("change"+b)})},L=function(a,b,d){a instanceof w?K([a],d._namespace):a=c.isArray(a)?new w.List(a):new w(a);
a.bind("change"+d._namespace,function(f,e){var g=c.makeArray(arguments),f=g.shift();g[0]="*"===b?d.indexOf(a)+"."+g[0]:b+"."+g[0];c.trigger(d,f,g)});return a},Y=0,x=j,Z=function(){if(!x)return x=[],!0},m=function(a,b,d){if(!a._init)if(x)x.push([a,{type:b,batchNum:aa},d]);else return c.trigger(a,b,d)},aa=1,ba=function(){var a=x.slice(0);x=j;aa++;c.each(a,function(a,d){c.trigger.apply(c,d)})},E=function(a,b,d){a.each(function(a,e){d[a]=t(e)&&c.isFunction(e[b])?e[b]():e});return d},o=function(a){return function(){return c[a].apply(this,
arguments)}},B=o("addEvent"),o=o("removeEvent"),M=function(a){return c.isArray(a)?a:(""+a).split(".")},w=c.Construct("can.Observe",{setup:function(){c.Construct.setup.apply(this,arguments)},bind:B,unbind:o,id:"id"},{setup:function(a){this._data={};this._namespace=".observe"+ ++Y;this._init=1;this.attr(a);delete this._init},attr:function(a,b){if(~"ns".indexOf((typeof a).charAt(0))){if(b===j)return w.__reading&&w.__reading(this,a),this._get(a);this._set(a,b);return this}return this._attrs(a,b)},each:function(){return c.each.apply(j,
[this.__get()].concat(c.makeArray(arguments)))},removeAttr:function(a){var a=M(a),b=a.shift(),d=this._data[b];if(a.length)return d.removeAttr(a);delete this._data[b];b in this.constructor.prototype||delete this[b];m(this,"change",[b,"remove",j,d]);m(this,b,j,d);return d},_get:function(a){var a=M(a),b=this.__get(a.shift());return a.length?b?b._get(a):j:b},__get:function(a){return a?this._data[a]:this._data},_set:function(a,b){var d=M(a),c=d.shift(),e=this.__get(c);if(t(e)&&d.length)e._set(d,b);else{if(d.length)throw"can.Observe: Object does not exist";
this.__convert&&(b=this.__convert(c,b));this.__set(c,b,e)}},__set:function(a,b,d){if(b!==d){var c=this.__get().hasOwnProperty(a)?"set":"add";this.___set(a,t(b)?L(b,a,this):b);m(this,"change",[a,c,b,d]);m(this,a,b,d);d&&K([d],this._namespace)}},___set:function(a,b){this._data[a]=b;a in this.constructor.prototype||(this[a]=b)},bind:B,unbind:o,serialize:function(){return E(this,"serialize",{})},_attrs:function(a,b){if(a===j)return E(this,"attr",{});var a=c.extend(!0,{},a),d,f=Z(),e=this,g;this.each(function(d,
c){g=a[d];g===j?b&&e.removeAttr(d):(t(c)&&t(g)?c.attr(g,b):c!=g&&e._set(d,g),delete a[d])});for(d in a)g=a[d],this._set(d,g);f&&ba();return this}}),Ba=[].splice,N=w("can.Observe.List",{setup:function(a,b){this.length=0;this._namespace=".observe"+ ++Y;this._init=1;this.bind("change",c.proxy(this._changes,this));this.push.apply(this,c.makeArray(a||[]));c.extend(this,b);delete this._init},_changes:function(a,b,d,c,e){~b.indexOf(".")||("add"===d?(m(this,d,[c,+b]),m(this,"length",[this.length])):"remove"===
d?(m(this,d,[e,+b]),m(this,"length",[this.length])):m(this,d,[c,+b]))},__get:function(a){return a?this[a]:this},___set:function(a,b){this[a]=b},serialize:function(){return E(this,"serialize",[])},splice:function(a,b){var d=c.makeArray(arguments),f;for(f=2;f<d.length;f++){var e=d[f];t(e)&&(d[f]=L(e,"*",this))}b===j&&(b=d[1]=this.length-a);f=Ba.apply(this,d);0<b&&(m(this,"change",[""+a,"remove",j,f]),K(f,this._namespace));2<d.length&&m(this,"change",[""+a,"add",d.slice(2),f]);return f},_attrs:function(a,
b){if(a===j)return E(this,"attr",[]);var a=a.slice(0),d=Math.min(a.length,this.length),c=Z(),e;for(e=0;e<d;e++){var g=this[e],h=a[e];t(g)&&t(h)?g.attr(h,b):g!=h&&this._set(e,h)}a.length>this.length?this.push(a.slice(this.length)):a.length<this.length&&b&&this.splice(a.length);c&&ba()}});c.each({push:"length",unshift:0},function(a,b){N.prototype[a]=function(){for(var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),f=b?this.length:0,e=0;e<d.length;e++){var g=d[e];t(g)&&(d[e]=
L(g,"*",this))}if(1==d.length&&this.comparator)return this.splice(this.sortedIndex(d[0]),0,d[0]),this.length;e=[][a].apply(this,d);this.comparator&&1<d.length?(this.sort(null,!0),m(this,"reset",[d])):m(this,"change",[""+f,"add",d,j]);return e}});c.each({pop:"length",shift:0},function(a,b){N.prototype[a]=function(){var d=arguments[0]&&c.isArray(arguments[0])?arguments[0]:c.makeArray(arguments),f=b&&this.length?this.length-1:0,d=[][a].apply(this,d);m(this,"change",[""+f,"remove",j,[d]]);d&&d.unbind&&
d.unbind("change"+this._namespace);return d}});N.prototype.indexOf=[].indexOf||function(a){return c.inArray(a,this)};var Ca=function(a,b,d){var f=new c.Deferred;a.then(function(){arguments[0]=b[d](arguments[0]);f.resolve.apply(f,arguments)},function(){f.resolveWith.apply(this,arguments)});return f},Da=0,ca=/change.observe\d+/,da=function(a,b,d,c,e){var g;g=[a.serialize()];var h=a.constructor,i;"destroy"==b&&g.shift();"create"!==b&&g.unshift(a[a.constructor.id]);i=h[b].apply(h,g);g=i.pipe(function(d){a[e||
b+"d"](d,i);return a});i.abort&&(g.abort=function(){i.abort()});return g.then(d,c)},Ea={create:{url:"_shortName",type:"post"},update:{data:function(a,b){var b=b||{},d=this.id;b[d]&&b[d]!==a&&(b["new"+c.capitalize(a)]=b[d],delete b[d]);b[d]=a;return b},type:"put"},destroy:{type:"delete",data:function(a){return{}[this.id]=a}},findAll:{url:"_shortName"},findOne:{}},Fa=function(a,b){return function(d){var d=a.data?a.data.apply(this,arguments):d,f=b||this[a.url||"_url"],e=d,g=a.type||"get";if("string"==
typeof f){var h=f.split(" "),f={url:h.pop()};h.length&&(f.type=h.pop())}f.data="object"==typeof e&&!c.isArray(e)?c.extend(f.data||{},e):e;f.url=c.sub(f.url,f.data,!0);return c.ajax(c.extend({type:g||"post",dataType:"json",success:void 0,error:void 0},f))}};c.Observe("can.Model",{setup:function(){c.Observe.apply(this,arguments);if(this!==c.Model){var a=this;c.each(Ea,function(b,d){c.isFunction(a[b])||(a[b]=Fa(d,a[b]))});var b=c.proxy(this._clean,a);c.each({findAll:"models",findOne:"model"},function(d,
c){var f=a[d];a[d]=function(d,e,J){a._reqs++;return Ca(f.call(a,d),a,c).then(e,J).then(b,b)}});"can.Model"==a.fullName&&(a.fullName="Model"+ ++Da);if(s.jQuery){var d={},f="* "+a.fullName+".model";d[f+"s"]=c.proxy(a.models,a);d[f]=c.proxy(a.model,a);$.ajaxSetup({converters:d})}this.store={};this._reqs=0;this._url=this._shortName+"/{"+this.id+"}"}},_clean:function(){this._reqs--;if(!this._reqs)for(var a in this.store)this.store[a]._bindings||delete this.store[a]},models:function(a){if(a){var b=this,
d=new (b.List||ea),f=c.isArray(a),e=a instanceof ea,e=f?a:e?a.serialize():a.data;c.each(e,function(a,c){d.push(b.model(c))});f||c.each(a,function(a,b){"data"!==a&&(d[a]=b)});return d}},model:function(a){if(a){a instanceof this&&(a=a.serialize());var b=this.store[a.id]||new this(a);this._reqs&&(this.store[a.id]=b);return b}}},{isNew:function(){var a=this[this.constructor.id];return!(a||0===a)},save:function(a,b){return da(this,this.isNew()?"create":"update",a,b)},destroy:function(a,b){return da(this,
"destroy",a,b,"destroyed")},bind:function(a){ca.test(a)||(this._bindings||(this.constructor.store[this[this.constructor.id]]=this,this._bindings=0),this._bindings++);return c.Observe.prototype.bind.apply(this,arguments)},unbind:function(a){ca.test(a)||(this._bindings--,this._bindings||delete this.constructor.store[this[this.constructor.id]]);return c.Observe.prototype.unbind.apply(this,arguments)},___set:function(a,b){c.Observe.prototype.___set.call(this,a,b);a===this.constructor.id&&this._bindings&&
(this.constructor.store[this[this.constructor.id]]=this)}});c.each(["created","updated","destroyed"],function(a,b){c.Model.prototype[b]=function(a){var f=this.constructor;a&&"object"==typeof a&&this.attr(a.attr?a.attr():a);c.trigger(this,b);c.trigger(this,"change",b);c.trigger(f,b,this)}});var ea=c.Observe.List("can.Model.List",{setup:function(){c.Observe.List.prototype.setup.apply(this,arguments);var a=this;this.bind("change",function(b,d){/\w+\.destroyed/.test(d)&&a.splice(a.indexOf(b.target),1)})}}),
Ga=/^\d+$/,Ha=/([^\[\]]+)|(\[\])/g,Ia=/([^?#]*)(#.*)?$/,fa=function(a){return decodeURIComponent(a.replace(/\+/g," "))};c.extend(c,{deparam:function(a){var b={};a&&Ia.test(a)&&(a=a.split("&"),c.each(a,function(a,c){var e=c.split("="),g=fa(e.shift()),h=fa(e.join("="));current=b;for(var e=g.match(Ha),g=0,i=e.length-1;g<i;g++)current[e[g]]||(current[e[g]]=Ga.test(e[g+1])||"[]"==e[g+1]?[]:{}),current=current[e[g]];lastPart=e.pop();"[]"==lastPart?current.push(h):current[lastPart]=h}));return b}});var ga=
/\:([\w\.]+)/g,ha=/^(?:&[^=]+=[^&]*)+/,Ja=function(a){return c.map(a,function(a,d){return("className"===d?"class":d)+'="'+c.esc(a)+'"'}).join(" ")},ia=!0,O=s.location,u=c.each,p=c.extend;c.route=function(a,b){var d=[],f=a.replace(ga,function(a,b){d.push(b);return"([^\\/\\&]*)"});c.route.routes[a]={test:RegExp("^"+f+"($|&)"),route:a,names:d,defaults:b||{},length:a.split("/").length};return c.route};p(c.route,{param:function(a){delete a.route;var b,d=0,f,e=a.route;(!e||!(b=c.route.routes[e]))&&u(c.route.routes,
function(c,e){a:{for(var g=0,h=0;h<e.names.length;h++){if(!a.hasOwnProperty(e.names[h])){f=-1;break a}g++}f=g}f>d&&(b=e,d=f)});if(b){var g=p({},a),e=b.route.replace(ga,function(d,c){delete g[c];return a[c]===b.defaults[c]?"":encodeURIComponent(a[c])}),h;u(b.defaults,function(a,b){g[a]===b&&delete g[a]});h=c.param(g);return e+(h?"&"+h:"")}return c.isEmptyObject(a)?"":"&"+c.param(a)},deparam:function(a){var b={length:-1};u(c.route.routes,function(d,c){c.test.test(a)&&c.length>b.length&&(b=c)});if(-1<
b.length){var d=a.match(b.test),f=d.shift(),e=(f=a.substr(f.length-("&"===d[d.length-1]?1:0)))&&ha.test(f)?c.deparam(f.slice(1)):{},e=p(!0,{},b.defaults,e);u(d,function(a,d){d&&"&"!==d&&(e[b.names[a]]=decodeURIComponent(d))});e.route=b.route;return e}"&"!==a.charAt(0)&&(a="&"+a);return ha.test(a)?c.deparam(a.slice(1)):{}},data:new c.Observe({}),routes:{},ready:function(a){!1===a&&(ia=a);(!0===a||!0===ia)&&ja();return c.route},url:function(a,b){b&&(a=p({},P,a));return"#!"+c.route.param(a)},link:function(a,
b,d,f){return"<a "+Ja(p({href:c.route.url(b,f)},d))+">"+a+"</a>"},current:function(a){return O.hash=="#!"+c.route.param(a)}});u("bind,unbind,delegate,undelegate,attr,removeAttr".split(","),function(a,b){c.route[b]=function(){return c.route.data[b].apply(c.route.data,arguments)}});var ka,P,ja=function(){P=c.route.deparam(O.hash.split(/#!?/).pop());c.route.attr(P,!0)};c.bind.call(s,"hashchange",ja);c.route.bind("change",function(){clearTimeout(ka);ka=setTimeout(function(){O.hash="#!"+c.route.param(c.route.data.serialize())},
1)});c.bind.call(document,"ready",c.route.ready);var B=function(a,b,d){c.bind.call(a,b,d);return function(){c.unbind.call(a,b,d)}},y=c.isFunction,p=c.extend,u=c.each,Ka=[].slice,La=c.getObject("$.event.special")||{},la=function(a,b,d,f){c.delegate.call(a,b,d,f);return function(){c.undelegate.call(a,b,d,f)}},Q=function(a,b){var d="string"==typeof b?a[b]:b;return function(){a.called=b;return d.apply(a,[this.nodeName?c.$(this):this].concat(Ka.call(arguments,0)))}},R;c.Construct("can.Control",{setup:function(){c.Construct.setup.apply(this,
arguments);if(this!==c.Control){var a;this.actions={};for(a in this.prototype)"constructor"!=a&&y(this.prototype[a])&&this._isAction(a)&&(this.actions[a]=this._action(a))}},_isAction:function(a){return La[a]||S[a]||/[^\w]/.test(a)},_action:function(a,b){if(b||!/\{([^\}]+)\}/g.test(a)){var d=b?c.sub(a,[b,s]):a,f=c.isArray(d),e=(f?d[1]:d).match(/^(?:(.*?)\s)?([\w\.\:>]+)$/);return{processor:S[e[2]]||R,parts:e,delegate:f?d[0]:j}}},processors:{},defaults:{}},{setup:function(a,b){var d=this.constructor,
f=d.pluginName||d._fullName;this.element=c.$(a);f&&"can_control"!==f&&this.element.addClass(f);c.data(this.element,"controls")||c.data(this.element,"controls",[this]);this.options=p({},d.defaults,b);this.on();return[this.element,this.options]},on:function(a,b,d,f){if(!a){this.off();var a=this.constructor,b=this._bindings,d=a.actions,f=this.element,e=Q(this,"destroy");for(funcName in d)d.hasOwnProperty(funcName)&&(ready=d[funcName]||a._action(funcName,this.options),b.push(ready.processor(ready.delegate||
f,ready.parts[2],ready.parts[1],funcName,this)));c.bind.call(f,"destroyed",e);b.push(function(a){c.unbind.call(a,"destroyed",e)});return b.length}"string"==typeof a&&(f=d,d=b,b=a,a=this.element);"string"==typeof f&&(f=Q(this,f));this._bindings.push(b?la(a,c.trim(b),d,f):B(a,d,f));return this._bindings.length},off:function(){var a=this.element[0];u(this._bindings||[],function(b,d){d(a)});this._bindings=[]},destroy:function(){var a=this.constructor,a=a.pluginName||a._fullName;this.off();a&&"can_control"!==
a&&this.element.removeClass(a);a=c.data(this.element,"controls");a.splice(c.inArray(this,a),1);c.trigger(this,"destroyed");this.element=null}});var S=c.Control.processors;R=function(a,b,d,f,e){f=Q(e,f);return d?la(a,c.trim(d),b,f):B(a,b,f)};u("change,click,contextmenu,dblclick,keydown,keyup,keypress,mousedown,mousemove,mouseout,mouseover,mouseup,reset,resize,scroll,select,submit,focusin,focusout,mouseenter,mouseleave".split(","),function(a,b){S[b]=R});c.Control.processors.route=function(a,b,d,f,e){c.route(d||
"");var g,h=function(a){if(c.route.attr("route")===(d||"")&&(a.batchNum===j||a.batchNum!==g))g=a.batchNum,a=c.route.attr(),delete a.route,e[f](a)};c.route.bind("change",h);return function(){c.route.unbind("change",h)}};var y=c.isFunction,Ma=c.makeArray,ma=1,k=c.view=function(a,b,d,f){a=k.render(a,b,d,f);return c.isDeferred(a)?a.pipe(function(a){return k.frag(a)}):k.frag(a)};c.extend(k,{frag:function(a){a=c.buildFragment([a],[document.body]).fragment;a.childNodes.length||a.appendChild(document.createTextNode(""));
return k.hookup(a)},hookup:function(a){var b=[],d,f,e,g=0;for(c.each(a.childNodes?c.makeArray(a.childNodes):a,function(a,d){1===d.nodeType&&(b.push(d),b.push.apply(b,c.makeArray(d.getElementsByTagName("*"))))});e=b[g++];)if(e.getAttribute&&(d=e.getAttribute("data-view-id"))&&(f=k.hookups[d]))f(e,d),delete k.hookups[d],e.removeAttribute("data-view-id");return a},hookups:{},hook:function(a){k.hookups[++ma]=a;return" data-view-id='"+ma+"'"},cached:{},cache:!0,register:function(a){this.types["."+a.suffix]=
a},types:{},ext:".ejs",registerScript:function(){},preload:function(){},render:function(a,b,d,f){y(d)&&(f=d,d=j);var e=Na(b);if(e.length){var g=new c.Deferred;e.push(na(a,!0));c.when.apply(c,e).then(function(a){var e=Ma(arguments),h=e.pop();if(c.isDeferred(b))b=oa(a);else for(var D in b)c.isDeferred(b[D])&&(b[D]=oa(e.shift()));e=h(b,d);g.resolve(e);f&&f(e)});return g}var h,e=y(f),g=na(a,e);e?(h=g,g.then(function(a){f(a(b,d))})):g.then(function(a){h=a(b,d)});return h}});c.isDeferred=function(a){return a&&
y(a.then)&&y(a.pipe)};var pa=function(a,b){if(!a.length)throw"can.view: No template or empty template:"+b;},na=function(a,b){var d=a.match(/\.[\w\d]+$/),f,e,g,h=function(a){var a=f.renderer(g,a),b=new c.Deferred;b.resolve(a);k.cache&&(k.cached[g]=b);return b};if(e=document.getElementById(a))d="."+e.type.match(/\/(x\-)?(.+)/)[2];d||(a+=d=k.ext);c.isArray(d)&&(d=d[0]);g=a.split(/\/|\./g).join("_");if(a.match(/^\/\//))var i=a.substr(2),a=!s.steal?"/"+i:steal.root.mapJoin(i);f=k.types[d];if(k.cached[g])return k.cached[g];
if(e)return h(e.innerHTML);var l=new c.Deferred;c.ajax({async:b,url:a,dataType:"text",error:function(b){pa("",a);l.reject(b)},success:function(b){pa(b,a);l.resolve(f.renderer(g,b));k.cache&&(k.cached[g]=l)}});return l},Na=function(a){var b=[];if(c.isDeferred(a))return[a];for(var d in a)c.isDeferred(a[d])&&b.push(a[d]);return b},oa=function(a){return c.isArray(a)&&"success"===a[1]?a[0]:a},Oa=function(a){eval(a)},p=c.extend,qa=/\s*\(([\$\w]+)\)\s*->([^\n]*)/,ra=/([^\s]+)=$/,Pa=/__!!__/g,Qa={"":"span",
table:"tr",tr:"td",ol:"li",ul:"li",tbody:"tr",thead:"tr",tfoot:"tr"},F=function(a,b,d){c.each(a,function(a,b){b.obj.bind(b.attr,d)});c.bind.call(b,"destroyed",function(){c.each(a,function(a,b){b.obj.unbind(b.attr,d)})})},Ra=function(a){return"string"==typeof a||"number"==typeof a?c.esc(a):T(a)},T=function(a){if("string"==typeof a)return a;if(!a&&0!=a)return"";var b=a.hookup&&function(b,c){a.hookup.call(a,b,c)}||"function"==typeof a&&a;return b?c.view.hook(b):""+a},q=function(a){if(this.constructor!=
q){var b=new q(a);return function(a,c){return b.render(a,c)}}"function"==typeof a?this.template={fn:a}:(p(this,a),this.template=Sa(this.text,this.name))};c.EJS=q;q.prototype.render=function(a,b){a=a||{};return this.template.fn.call(a,a,new q.Helpers(a,b||{}))};p(q,{txt:function(a,b,d,f,e){c.Observe&&(c.Observe.__reading=function(a,b){g.push({obj:a,attr:b})});var g=[],h=f.call(d),a=Qa[a]||"span";c.Observe&&delete c.Observe.__reading;if(!g.length)return(e||0!==b?Ra:T)(h);if(0==b)return"<"+a+c.view.hook(e?
function(a){var b=a.parentNode,c=document.createTextNode(h);b.insertBefore(c,a);b.removeChild(a);F(g,b,function(){c.nodeValue=f.call(d)})}:function(a){var b=function(a,b){var d=c.view.frag(a),f=c.$(c.map(d.childNodes,function(a){return a})),e=b[b.length-1];e.nextSibling?e.parentNode.insertBefore(d,e.nextSibling):e.parentNode.appendChild(d);c.remove(c.$(b));return f},e=b(h,[a]);F(g,a.parentNode,function(){e=b(f.call(d),e)})})+"></"+a+">";if(1===b){var i=f.call(d).replace(/['"]/g,"").split("=")[0];
C.push(function(a){F(g,a,function(){var b=(f.call(d)||"").replace(/['"]/g,"").split("="),c=b[0];c!=i&&i&&a.removeAttribute(i);c&&a.setAttribute(c,b[1])})});return h}C.push(function(a){var e=c.$(a),i;(i=c.data(e,"hooks"))||c.data(e,"hooks",i={});var k=a.getAttribute(b),e=k.split("__!!__"),n;i[b]?i[b].funcs.push(f):i[b]={render:function(){var a=0;return k.replace(Pa,function(){return T(n.funcs[a++].call(d))})},funcs:[f],batchNum:j};n=i[b];e.splice(1,0,h);a.setAttribute(b,e.join(""));F(g,a,function(d){if(d.batchNum===
j||d.batchNum!==n.batchNum){n.batchNum=d.batchNum;a.setAttribute(b,n.render())}})});return"__!!__"},esc:function(a,b,d,c){return q.txt(a,b,d,c,!0)},pending:function(){if(C.length){var a=C.slice(0);C=[];return c.view.hook(function(b){c.each(a,function(a,c){c(b)})})}return""}});var Ta=/(<%%|%%>|<%==|<%=|<%#|<%|%>|<|>|"|')/,z=null,G=r=null,C=[],Sa=function(a,b){var d=a.replace(/(\r|\n)+/g,"\n").split(Ta),c="",e=["var ___v1ew = [];"],g=function(a,b){e.push("___v1ew.push(",'"',a.split("\\").join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("\t").join("\\t"),
'"'+(b||"")+");")},h=[],i,l=null,k=!1,m="",o=0,n;for(z=r=G=null;(n=d[o++])!==j;){if(null===l)switch(n){case "<%":case "<%=":case "<%==":k=1;case "<%#":l=n;0<c.length&&g(c);c="";break;case "<%%":c+="<%";break;case "<":0!==d[o].indexOf("!--")&&(z=1,k=0);c+=n;break;case ">":z=0;k?(g(c,',can.EJS.pending(),">"'),c=""):c+=n;break;case "'":case '"':z&&(r&&r===n?r=null:null===r&&(r=n,G=i));default:"<"===i&&(m=n.split(" ")[0]),c+=n}else switch(n){case "%>":switch(l){case "<%":i=--c.split("{").length- --c.split("}").length;
1==i?(e.push("___v1ew.push(","can.EJS.txt('"+m+"',"+(r?"'"+G.match(ra)[1]+"'":z?1:0)+",this,function(){","var ___v1ew = [];",c),h.push({before:"",after:"return ___v1ew.join('')}));"})):(l=h.length&&-1==i?h.pop():{after:";"},l.before&&e.push(l.before),e.push(c,";",l.after));break;case "<%=":case "<%==":(i=--c.split("{").length- --c.split("}").length)&&h.push({before:"return ___v1ew.join('')",after:"}));"}),qa.test(c)&&(c=c.match(qa),c="function(__){var "+c[1]+"=can.$(__);"+c[2]+"}"),e.push("___v1ew.push(",
"can.EJS."+("<%="===l?"esc":"txt")+"('"+m+"',"+(r?"'"+G.match(ra)[1]+"'":z?1:0)+",this,function(){ return ",c,i?"var ___v1ew = [];":"}));")}l=null;c="";break;case "<%%":c+="<%";break;default:c+=n}i=n}0<c.length&&g(c);e.push(";");d={out:"with(_VIEW) { with (_CONTEXT) {"+e.join("")+" return ___v1ew.join('')}}"};Oa.call(d,"this.fn = (function(_CONTEXT,_VIEW){"+d.out+"});\r\n//@ sourceURL="+b+".js");return d};q.Helpers=function(a,b){this._data=a;this._extras=b;p(this,b)};q.Helpers.prototype={view:function(a,
b,c){return $View(a,b||this._data,c||this._extras)},list:function(a,b){a.attr("length");for(var c=0,f=a.length;c<f;c++)b(a[c],c,a)}};c.view.register({suffix:"ejs",script:function(a,b){return"can.EJS(function(_CONTEXT,_VIEW) { "+(new q({text:b,name:a})).template.out+" })"},renderer:function(a,b){return q({text:b,name:a})}})})(can={},this);
