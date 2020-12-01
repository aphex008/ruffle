var m2 = {}

m2.addthis = function() {
	
	this.default_from = null;
	
	try {
		if (typeof addthis != "undefined") {
			addthis.addEventListener('addthis.menu.open', jQuery.proxy(this.opened, this));
		}
	} catch (e) {}
	
}

m2.addthis.prototype.opened = function() {
	if (this.default_from) {
		jQuery("#at_from").val(this.default_from);
	}
}

m2.ajax = function() {}

m2.ajax.replaceWith = function(node, uri) {
	var listener = {"node" : jQuery(node)};
	listener.complete = function(response) {
		this.node.replaceWith(response);
	}
	jQuery.get(uri, jQuery.proxy(listener.complete, listener));
}

m2.ajax.appendBefore = function(node, uri) {
	var listener = {"node" : jQuery(node)};
	listener.complete = function(response) {
		this.node.before(response);
	}
	jQuery.get(uri, jQuery.proxy(listener.complete, listener));
}

m2.ajaxforms = function() {
	
	this.timeout = null;
	this.reset();	
	this.submitAuto();
}

m2.ajaxforms.prototype.reset = function() {
	
	var handleForm = jQuery.proxy(this.submitForm, this);
	var handleLink = jQuery.proxy(this.submitLink, this);
	jQuery("form[ajax_submit]").unbind("submit", handleForm).bind("submit", handleForm);
	jQuery("a.ajax_submit").unbind("click", handleLink).bind("click", handleLink);
		
}

m2.ajaxforms.prototype.submit = function(node) {
	node = jQuery(node);
	var listener = {parent : this, target : node, preloader : new m2.preloader({'target' : node})}
	listener.complete = function(response) {
		this.target.replaceWith(response);
		this.parent.reset();
		this.preloader.destroy();
	}
	m2.instance("m2.blurtext").allfocus();
	var data = node.serialize();
	if (!data) {
		data = {};
		var nodes = node.find("input");
		for (var i = 0; i < nodes.length; i++) {
			var nodeValue = jQuery(nodes[i]);
			data[nodeValue.attr("name")] = nodeValue.val();
		}
	}
	m2.instance("m2.blurtext").allblur();
	jQuery.post(node.attr("ajax_submit"), data, jQuery.proxy(listener.complete, listener));
}

m2.ajaxforms.prototype.submitAuto = function() {
	var nodes = jQuery("form[uri_autosave]");
	if (this.timeout !== null) {		
		clearTimeout(this.timeout);
		this.timeout = null;		
		for (var i = 0; i < nodes.length; i++) {
			var node = jQuery(nodes[i]);
			var listener = {"node" : node};
			listener.complete = function(response) {
				if (node.attr("target_autosave")) {
					jQuery("#" + node.attr("target_autosave")).html(response);
				}
			}
			jQuery.post(
				node.attr("uri_autosave"), node.serialize(), jQuery.proxy(listener.complete, listener)
			);
		}
	}
	if (nodes.length > 0) {
		this.timeout = setTimeout(jQuery.proxy(this.submitAuto, this), 60000);
	}
}

m2.ajaxforms.prototype.submitForm = function(event) {
	this.submit(event.target);
}

m2.ajaxforms.prototype.submitLink = function(event) {
	this.submit(jQuery(event.target).parents("*[ajax_submit]"));
}

m2.instance = function(nameOfClass, name, options) {
	if (name === undefined) {
		name = nameOfClass;
	}
	if (!m2.instance.instances[name]) {
		m2.instance.instances[name] = eval("new " + nameOfClass + "(options)");
	}
	return m2.instance.instances[name];
}

m2.instance.instances = new Object();

m2.preloader = function(options) {
	
	this.target = jQuery(options && options.target ? options.target : window);
	this.node = jQuery(document.body.appendChild(document.createElement("DIV")));
	this.render();
	
}

m2.preloader.prototype.render = function() {
		
	var position = this.target.offset();
	if (position === null) {
		position = {left : 0, top : 0}
	}
	jQuery(".preloader").hide();
	this.node.addClass("preloader");
	this.node.html("<img src=\"images/preloader.gif\" />")
		.css({left : position.left + "px", top : position.top + "px"});	
	this.node.width(this.target.width());
	this.node.height(this.target.height());
	this.node.find("img").position({of : this.node, at : "center center"});
	
}

m2.preloader.prototype.destroy = function() {
	this.node.remove();
}

m2.blurtext = function() {

	this.reset();
	
}

m2.blurtext.prototype.reset = function() {
	
	var handleFocus = jQuery.proxy(this.focused, this);
	var handleBlur = jQuery.proxy(this.blured, this);
	
	this.nodes = jQuery("*[blurtext]");	
	this.nodes.unbind("focus", handleFocus).bind("focus", handleFocus);
	this.nodes.unbind("blur", handleBlur).bind("blur", handleBlur);
	this.allblur();
	
}

m2.blurtext.prototype.focused = function(event) {
	this.focus(event.target);
}

m2.blurtext.prototype.focus = function(node) {
	node = jQuery(node);
	if (node.val() === node.attr("blurtext")) {
		node.val("");				
	}
	if (node.attr("blurclass")) {
		node.removeClass(node.attr("blurclass"));
	}
	if (node.attr("focusclass")) {
		node.addClass(node.attr("focusclass"));
	}
}

m2.blurtext.prototype.blured = function(event) {
	this.blur(event.target);
}

m2.blurtext.prototype.blur = function(node) {
	node = jQuery(node);	
	if (node.val() === "" || node.val() === node.attr("blurtext")) {
		node.val(node.attr("blurtext"));
		if (node.attr("blurclass")) {
			node.addClass(node.attr("blurclass"));
		}
		if (node.attr("focusclass")) {
			node.removeClass(node.attr("focusclass"));
		}
		node.get(0).blur();
	} else {
		node.removeClass(node.attr("blurclass"));
		node.addClass(node.attr("focusclass"));
	}
}

m2.blurtext.prototype.allfocus = function() {
	for (var i = 0, l = this.nodes.length; i < l; i++) {
		this.focus(jQuery(this.nodes[i]));
	}
}

m2.blurtext.prototype.allblur = function() {
	for (var i = 0, l = this.nodes.length; i < l; i++) {
		this.blur(jQuery(this.nodes[i]));
	}
}