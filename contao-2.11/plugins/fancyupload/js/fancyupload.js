/* Swiff.Uploader 3.0, Fx.ProgressBar 1.1, FancyUpload 3.0, MIT License, Harald Kirschner <http://digitarald.de>, Valerio Proietti, <http://mad4milk.net> */
Swiff.Uploader=new Class({Extends:Swiff,Implements:Events,options:{path:"Swiff.Uploader.swf",target:null,zIndex:9999,height:30,width:100,callBacks:null,params:{wMode:"opaque",menu:"false",allowScriptAccess:"always"},typeFilter:null,multiple:!0,queued:!0,verbose:!1,url:null,method:null,data:null,mergeData:!0,fieldName:null,fileSizeMin:1,fileSizeMax:null,allowDuplicates:!1,timeLimit:Browser.Platform.linux?0:30,buttonImage:null,policyFile:null,fileListMax:0,fileListSizeMax:0,instantStart:!1,appendCookieData:!1,fileClass:null},initialize:function(a){this.addEvent("load",this.initializeSwiff,!0).addEvent("select",this.processFiles,!0).addEvent("complete",this.update,!0).addEvent("fileRemove",function(a){this.fileList.erase(a)}.bind(this),!0),this.setOptions(a),this.options.callBacks&&Hash.each(this.options.callBacks,function(a,b){this.addEvent(b,a)},this),this.options.callBacks={fireCallback:this.fireCallback.bind(this)};var b=this.options.path;b.contains("?")||(b+="?noCache="+$time()),this.options.container=this.box=(new Element("span",{"class":"swiff-uploader-box"})).inject($(this.options.container)||document.body),this.target=$(this.options.target);if(this.target){var c=window.getScroll();this.box.setStyles({position:"absolute",visibility:"visible",zIndex:this.options.zIndex,overflow:"hidden",height:1,width:1,top:c.y,left:c.x}),this.parent(b,{params:{wMode:"transparent"},height:"100%",width:"100%"}),this.target.addEvent("mouseenter",this.reposition.bind(this,[])),this.addEvents({buttonEnter:this.targetRelay.bind(this,["mouseenter"]),buttonLeave:this.targetRelay.bind(this,["mouseleave"]),buttonDown:this.targetRelay.bind(this,["mousedown"]),buttonDisable:this.targetRelay.bind(this,["disable"])}),this.reposition(),window.addEvent("resize",this.reposition.bind(this,[]))}else this.parent(b);this.inject(this.box),this.fileList=[],this.size=this.uploading=this.bytesLoaded=this.percentLoaded=0,Browser.Plugins.Flash.version<9?this.fireEvent("fail",["flash"]):this.verifyLoad.delay(1e3,this)},verifyLoad:function(){if(this.loaded)return;this.object.parentNode?this.object.style.display=="none"?this.fireEvent("fail",["hidden"]):this.object.offsetWidth||this.fireEvent("fail",["empty"]):this.fireEvent("fail",["disabled"])},fireCallback:function(a,b){if(a.substr(0,4)=="file"){b.length>1&&this.update(b[1]);var c=b[0],d=this.findFile(c.id);this.fireEvent(a,d||c,5);if(d){var e=a.replace(/^file([A-Z])/,function(a,b){return b.toLowerCase()});d.update(c).fireEvent(e,[c],10)}}else this.fireEvent(a,b,5)},update:function(a){return $extend(this,a),this.fireEvent("queue",[this],10),this},findFile:function(a){for(var b=0;b<this.fileList.length;b++)if(this.fileList[b].id==a)return this.fileList[b];return null},initializeSwiff:function(){this.remote("initialize",{width:this.options.width,height:this.options.height,typeFilter:this.options.typeFilter,multiple:this.options.multiple,queued:this.options.queued,url:this.options.url,method:this.options.method,data:this.options.data,mergeData:this.options.mergeData,fieldName:this.options.fieldName,verbose:this.options.verbose,fileSizeMin:this.options.fileSizeMin,fileSizeMax:this.options.fileSizeMax,allowDuplicates:this.options.allowDuplicates,timeLimit:this.options.timeLimit,buttonImage:this.options.buttonImage,policyFile:this.options.policyFile}),this.loaded=!0,this.appendCookieData()},targetRelay:function(a){this.target&&this.target.fireEvent(a)},reposition:function(a){a=a||this.target&&this.target.offsetHeight?this.target.getCoordinates(this.box.getOffsetParent()):{top:window.getScrollTop(),left:0,width:40,height:40},this.box.setStyles(a),this.fireEvent("reposition",[a,this.box,this.target])},setOptions:function(a){return a&&(a.url&&(a.url=Swiff.Uploader.qualifyPath(a.url)),a.buttonImage&&(a.buttonImage=Swiff.Uploader.qualifyPath(a.buttonImage)),this.parent(a),this.loaded&&this.remote("setOptions",a)),this},setEnabled:function(a){this.remote("setEnabled",a)},start:function(){this.fireEvent("beforeStart"),this.remote("start")},stop:function(){this.fireEvent("beforeStop"),this.remote("stop")},remove:function(){this.fireEvent("beforeRemove"),this.remote("remove")},fileStart:function(a){this.remote("fileStart",a.id)},fileStop:function(a){this.remote("fileStop",a.id)},fileRemove:function(a){this.remote("fileRemove",a.id)},fileRequeue:function(a){this.remote("fileRequeue",a.id)},appendCookieData:function(){var a=this.options.appendCookieData;if(!a)return;var b={};document.cookie.split(/;\s*/).each(function(a){a=a.split("="),a.length==2&&(b[decodeURIComponent(a[0])]=decodeURIComponent(a[1]))});var c=this.options.data||{};$type(a)=="string"?c[a]=b:$extend(c,b),this.setOptions({data:c})},processFiles:function(a,b,c){var d=this.options.fileClass||Swiff.Uploader.File,e=[],f=[];a&&(a.each(function(a){var b=new d(this,a);b.validate()?(this.size+=a.size,this.fileList.push(b),f.push(b),b.render()):(b.remove.delay(10,b),e.push(b))},this),this.fireEvent("selectSuccess",[f],10));if(b||e.length)e.extend(b?b.map(function(a){return new d(this,a)},this):[]).each(function(a){a.invalidate().render()}),this.fireEvent("selectFail",[e],10);this.update(c),this.options.instantStart&&f.length&&this.start()}}),$extend(Swiff.Uploader,{STATUS_QUEUED:0,STATUS_RUNNING:1,STATUS_ERROR:2,STATUS_COMPLETE:3,STATUS_STOPPED:4,log:function(){window.console&&console.info&&console.info.apply(console,arguments)},unitLabels:{b:[{min:1,unit:"B"},{min:1024,unit:"kB"},{min:1048576,unit:"MB"},{min:1073741824,unit:"GB"}],s:[{min:1,unit:"s"},{min:60,unit:"m"},{min:3600,unit:"h"},{min:86400,unit:"d"}]},formatUnit:function(a,b,c){var d=Swiff.Uploader.unitLabels[b=="bps"?"b":b],e=b=="bps"?"/s":"",f,g=d.length,h;if(a<1)return"0 "+d[0].unit+e;if(b=="s"){var i=[];for(f=g-1;f>=0;f--){h=Math.floor(a/d[f].min);if(h){i.push(h+" "+d[f].unit),a-=h*d[f].min;if(!a)break}}return c===!1?i:i.join(c||", ")}for(f=g-1;f>=0;f--){h=d[f].min;if(a>=h)break}return(a/h).toFixed(1)+" "+d[f].unit+e}}),Swiff.Uploader.qualifyPath=function(){var a;return function(b){return(a||(a=new Element("a"))).href=b,a.href}}(),Swiff.Uploader.File=new Class({Implements:Events,initialize:function(a,b){this.base=a,this.update(b)},update:function(a){return $extend(this,a)},validate:function(){var a=this.base.options;return a.fileListMax&&this.base.fileList.length>=a.fileListMax?(this.validationError="fileListMax",!1):a.fileListSizeMax&&this.base.size+this.size>a.fileListSizeMax?(this.validationError="fileListSizeMax",!1):!0},invalidate:function(){return this.invalid=!0,this.base.fireEvent("fileInvalid",this,10),this.fireEvent("invalid",this,10)},render:function(){return this},setOptions:function(a){return a&&(a.url&&(a.url=Swiff.Uploader.qualifyPath(a.url)),this.base.remote("fileSetOptions",this.id,a),this.options=$merge(this.options,a)),this},start:function(){return this.base.fileStart(this),this},stop:function(){return this.base.fileStop(this),this},remove:function(){return this.base.fileRemove(this),this},requeue:function(){this.base.fileRequeue(this)}}),Fx.ProgressBar=new Class({Extends:Fx,options:{text:null,url:null,transition:Fx.Transitions.Circ.easeOut,fit:!0,link:"cancel"},initialize:function(a,b){this.element=$(a),this.parent(b);var c=this.options.url;c&&this.element.setStyles({"background-image":"url("+c+")","background-repeat":"no-repeat"});if(this.options.fit){c=c||this.element.getStyle("background-image").replace(/^url\(["']?|["']?\)$/g,"");if(c){var d=new Image;d.onload=function(){this.fill=d.width,d=d.onload=null,this.set(this.now||0)}.bind(this),d.src=c,!this.fill&&d.width&&d.onload()}}else this.set(0)},start:function(a,b){return this.parent(this.now,arguments.length==1?a.limit(0,100):a/b*100)},set:function(a){this.now=a;var b=this.fill?(this.fill/-2+a/100*(this.element.width||1)||0).round()+"px":100-a+"%";this.element.setStyle("backgroundPosition",b+" 0px").title=Math.round(a)+"%";var c=$(this.options.text);return c&&c.set("text",Math.round(a)+"%"),this}});var FancyUpload2=new Class({Extends:Swiff.Uploader,options:{queued:1,limitSize:0,limitFiles:0,validateFile:$lambda(!0)},initialize:function(a,b,c){this.status=$(a),this.list=$(b),c.fileClass=c.fileClass||FancyUpload2.File,c.fileSizeMax=c.limitSize||c.fileSizeMax,c.fileListMax=c.limitFiles||c.fileListMax,this.parent(c),this.addEvents({load:this.render,select:this.onSelect,cancel:this.onCancel,start:this.onStart,queue:this.onQueue,complete:this.onComplete})},render:function(){this.overallTitle=this.status.getElement(".overall-title"),this.currentTitle=this.status.getElement(".current-title"),this.currentText=this.status.getElement(".current-text");var a=this.status.getElement(".overall-progress");this.overallProgress=new Fx.ProgressBar(a,{text:(new Element("span",{"class":"progress-text"})).inject(a,"after")}),a=this.status.getElement(".current-progress"),this.currentProgress=new Fx.ProgressBar(a,{text:(new Element("span",{"class":"progress-text"})).inject(a,"after")}),this.updateOverall()},onSelect:function(){this.status.removeClass("status-browsing")},onCancel:function(){this.status.removeClass("file-browsing")},onStart:function(){this.status.addClass("file-uploading"),this.overallProgress.set(0)},onQueue:function(){this.updateOverall()},onComplete:function(){this.status.removeClass("file-uploading"),this.size?this.overallProgress.start(100):(this.overallProgress.set(0),this.currentProgress.set(0))},updateOverall:function(){this.overallTitle.set("html",MooTools.lang.get("FancyUpload","progressOverall").substitute({total:Swiff.Uploader.formatUnit(this.size,"b")})),this.size||(this.currentTitle.set("html",MooTools.lang.get("FancyUpload","currentTitle")),this.currentText.set("html",""))},upload:function(){this.start()},removeFile:function(){return this.remove()}});FancyUpload2.File=new Class({Extends:Swiff.Uploader.File,render:function(){if(this.invalid){if(this.validationError){var a=MooTools.lang.get("FancyUpload","validationErrors")[this.validationError]||this.validationError;this.validationErrorMessage=a.substitute({name:this.name,size:Swiff.Uploader.formatUnit(this.size,"b"),fileSizeMin:Swiff.Uploader.formatUnit(this.base.options.fileSizeMin||0,"b"),fileSizeMax:Swiff.Uploader.formatUnit(this.base.options.fileSizeMax||0,"b"),fileListMax:this.base.options.fileListMax||0,fileListSizeMax:Swiff.Uploader.formatUnit(this.base.options.fileListSizeMax||0,"b")})}this.remove();return}this.addEvents({start:this.onStart,progress:this.onProgress,complete:this.onComplete,error:this.onError,remove:this.onRemove}),this.info=new Element("span",{"class":"file-info"}),this.element=(new Element("li",{"class":"file"})).adopt(new Element("span",{"class":"file-size",html:Swiff.Uploader.formatUnit(this.size,"b")}),new Element("a",{"class":"file-remove",href:"#",html:MooTools.lang.get("FancyUpload","remove"),title:MooTools.lang.get("FancyUpload","removeTitle"),events:{click:function(){return this.remove(),!1}.bind(this)}}),new Element("span",{"class":"file-name",html:MooTools.lang.get("FancyUpload","fileName").substitute(this)}),this.info).inject(this.base.list)},validate:function(){return this.parent()&&this.base.options.validateFile(this)},onStart:function(){this.element.addClass("file-uploading"),this.base.currentProgress.cancel().set(0),this.base.currentTitle.set("html",MooTools.lang.get("FancyUpload","currentFile").substitute(this))},onProgress:function(){this.base.overallProgress.start(this.base.percentLoaded),this.base.currentText.set("html",MooTools.lang.get("FancyUpload","currentProgress").substitute({rate:this.progress.rate?Swiff.Uploader.formatUnit(this.progress.rate,"bps"):"- B",bytesLoaded:Swiff.Uploader.formatUnit(this.progress.bytesLoaded,"b"),timeRemaining:this.progress.timeRemaining?Swiff.Uploader.formatUnit(this.progress.timeRemaining,"s"):"-"})),this.base.currentProgress.start(this.progress.percentLoaded)},onComplete:function(){this.element.removeClass("file-uploading"),this.base.currentText.set("html",MooTools.lang.get("FancyUpload","uploadCompleted")),this.base.currentProgress.start(100);if(this.response.error){var a=MooTools.lang.get("FancyUpload","errors")[this.response.error]||"{error} #{code}";this.errorMessage=a.substitute($extend({name:this.name,size:Swiff.Uploader.formatUnit(this.size,"b")},this.response));var b=[this,this.errorMessage,this.response];this.fireEvent("error",b).base.fireEvent("fileError",b)}else this.base.fireEvent("fileSuccess",[this,this.response.text||""])},onError:function(){this.element.addClass("file-failed");var a=MooTools.lang.get("FancyUpload","fileError").substitute(this);this.info.set("html","<strong>"+a+":</strong> "+this.errorMessage)},onRemove:function(){this.element.getElements("a").setStyle("visibility","hidden"),this.element.fade("out").retrieve("tween").chain(Element.destroy.bind(Element,this.element))}});