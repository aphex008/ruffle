function browser_class() {
	var b = navigator.appName
	this.b = (b=="Netscape")?"ns":(b=="Microsoft Internet Explorer")?"ie":b
	this.v = navigator.appVersion
	/*if (this.b=='ie') {
		var ve = this.version.indexOf("MSIE")
		this.v = parseInt(this.version.substr(ve+4))
	}else this.v = parseInt(this.version)*/
	this.opera = (navigator.userAgent.indexOf('Opera') != -1)?1:0	
	//this.ns4 = (document.layers)?1:0
	this.ns4 = (document.layers && !this.dom)?1:0;
	this.ns6 = (document.getElementById && !document.all && this.b == 'ns')?1:0
	this.ie = (document.all)?1:0
	this.ie4=(document.all && !this.dom && !this.opera)?1:0
	//this.ie4 = (document.all && !document.getElementById)?1:0
	this.ie5 = (document.all && document.getElementById)?1:0
	this.ie5mac = (navigator.userAgent.indexOf('MSIE 5') != -1 && navigator.userAgent.indexOf('Mac') != -1)
	this.ie55 = (this.ie5 &&  this.v.indexOf('MSIE 5.5')>0)?1:0
	this.ie6 = (this.ie5 &&  this.v.indexOf('MSIE 6.0')>0)?1:0
	this.dom = (document.getElementById)?1:0
	this.w3cdom = (!this.ie5mac && document.getElementsByTagName && document.createElement)?1:0
	this.newBrNotIE = (!this.ie && document.getElementById)?1:0
}

br = new browser_class()
//if (!(is.ie55 || is.ie6)) window.location.href = 'atnaujinkite.htm'


////
//
//		frame:		turi buti pilno "kelio" stringas, pvz.: 'top.frameTop'
//						arba gali buti nuoroda i freimo objekta
//
////
function findObj(id,frame) {
	var d; if (frame) d = typeof(frame)=='object' ? frame.document : eval(frame+'.document')
	else d = window.document
	if (document.getElementById) return d.getElementById(id)
	if (document.all) return d.all(id)
	return false
}

////
//
//		CSS
//
////
function classOver(obj,classOver)
{
	if (!br.dom) return;
	if (!obj.normal_class) obj.normal_class = obj.className
	obj.className = classOver
	//if (!obj.onmouseout) obj.onmouseout = classOut
}

function classOut(obj)
{
	if (!br.dom) return;
	obj.className = obj.normal_class
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function fixAnchors() {
	var nodes = document.getElementsByTagName("A");
	var url = new String(document.location);
	if (url.indexOf('#') !== -1)
	{
		url = url.substr(0, url.indexOf('#'));
	}
	for (var i in nodes) {
		var node = nodes[i];
		if (!node || !node.getAttribute) {
			continue;
		}
		var href = node.getAttribute("href");
		if (href && href.indexOf('#') !== -1) {
            var pos = href.indexOf('#');            
			node.href = url + href.substr(pos);
		}
	}
}

function getTarget(event){
	if (!event) {
		  return null;
	}
	return event.target ? event.target : event.srcElement;
}

function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 3600000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}
 
function getCookie(name) {
	var nameEQ = name + "=";
	var parts = document.cookie.split(';');
	var l = parts.length;
	for (var i = 0; i < l; i++) {
		var part = parts[i];
		while (part.charAt(0)==' ') {
			part = part.substring(1, part.length);
		}
		if (part.indexOf(nameEQ) == 0) {
			return unescape(part.substring(nameEQ.length, part.length));
		}
	}
	return null;
}
 
function removeCookie(name) {
	setCookie(name, "", -1);
}

function onClickMenu(id, name)
{
	if (!name)
	{
		name = '__menu_item_active';
	}
	setCookie(name, id);
}

__dumpContainer__ = null;

function dump(value) {
	var first = false;
	if (__dumpContainer__ === null) {
		first = true;
		__dumpContainer__ = document.body.appendChild(document.createElement("DIV"));
		__dumpContainer__.style.border = "solid 1px #5B6D85";
		__dumpContainer__.style.position = "absolute";
		__dumpContainer__.style.margin = "1px";
		__dumpContainer__.style.width = "75%";
		__dumpContainer__.style.backgroundColor = "#D5D5D5";
		var node = __dumpContainer__.appendChild(document.createElement("DIV"));
		node.style.padding = "2px";
		node.style.color = "#FFFFFF";
		node.style.fontSize = "10px";
		node.style.fontFamily = "Tahoma";
		node.style.backgroundColor = "#5B6D85";
		var nodeLink = node.appendChild(document.createElement("A"));
		node.appendChild(document.createTextNode(" | JavaScript dump"));
		nodeLink.href = "#";
		nodeLink.onclick = function() {
			var show = __dumpContainer__.style.display === "none";
			__dumpContainer__.style.display = show ? "" : "none";
			this.innerHTML = show ? "Hide" : "Show";
		};
		nodeLink.style.fontWeight = "bold";
		nodeLink.style.color = "#FFFFFF";
		nodeLink.innerHTML = "Hide";
		__dumpContainer__ = __dumpContainer__.appendChild(document.createElement("DIV"));		
	}
	var nodeDiv = __dumpContainer__.appendChild(document.createElement("DIV"));
	nodeDiv.style.whiteSpace = "pre";
	nodeDiv.style.padding = "1px";
	if (!first) {
		nodeDiv.style.borderTop = "solid 1px #5B6D85";
	}
	nodeDiv.style.margin = "2px";
	nodeDiv.appendChild(document.createTextNode(__prepareToDump(value)));
	
}

function __prepareToDump(val, level) {
	var content = "";
	var valuePadding = "";
	var typeOfValue = typeof(val);
	if (!level) {
		level = 0;
	}	
	for (var j = 0; j < level; j++) { 
		valuePadding += "\t";
	}		
	if (typeOfValue == "object") { 
		for (var name in val) {
			var value = val[name];
			if (typeof(value) === "object") {
				content += valuePadding + "\"" + name + "\" => {\n";
				content += __prepareToDump(value, level + 1);
				content += valuePadding + "}\n";
			} else {
				content += valuePadding + "\"" + name + "\" => " + __prepareToDump(value) + "\n";
			}
		}
	} else {
		content = '"' + val + "\" (" + typeOfValue + ")";
	}
	return content;
}