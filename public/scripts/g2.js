function matrixHighlight(event) {
	var el = Event.element(event);
	var nodesTr = el.parentNode.parentNode.childNodes;
	var l = nodesTr.length;
	for (var i = 0; i < l; i++) {
		var nodeTr = $(nodesTr[i]);
		if (nodeTr.tagName !== "TR") {
			continue;
		}
		nodeTr.removeClassName("active_row");
		var nodesTd = nodeTr.childNodes;
		var ll = nodesTd.length;
		for (var ii = 0; ii < ll; ii++) {
			var nodeTd = $(nodesTd[ii]);
			if (nodeTd.tagName !== "TD" && nodeTd.tagName !== "TH") {
				continue;
			}
			nodeTd.removeClassName("active_cell");
			nodeTd.removeClassName("active_c");
			if (nodeTd.getElementsByTagName("A")[0]) {
				jQuery(nodeTd.getElementsByTagName("A")[0]).removeClass("active_c");
			}
		}
	}
	var nodeTr = el.parentNode;
	nodeTr.addClassName("active_row");
	var nodesTd = nodeTr.childNodes;
	l = nodesTd.length;
	var index = 0;
	for (var i = 0; i < l; i++) {
		if (nodesTd[i] === el) {
			index = i;
			break;
		}
	}
	l = nodesTr.length;
	for (var i = 0; i < l; i++) {
		var nodesTd = nodesTr[i].childNodes;
		var ll = nodesTd.length;
		for (var ii = 0; ii < ll; ii++) {
			if (ii === index) {
				try {
					nodesTd[ii].addClassName("active_c");
					if (nodesTd[ii].getElementsByTagName("A")[0]) {
						jQuery(nodesTd[ii].getElementsByTagName("A")[0]).addClass("active_c");
					}
				}catch (e) {
					alert(nodesTd[ii]);
				}
				break;
			}
		}
	}
	el.addClassName("active_cell");
}
function matrixHighlightDisable(event) {
    jQuery('#matrix_tooltip').attr('class', 'matric_popup');
                                var el = $("the_matrix_container");
             var nodesTr = el.getElementsByTagName("TR");
             var l = nodesTr.length;
             for (var i = 0; i < l; i++) {
                     var nodeTr = $(nodesTr[i]);
                     if (nodeTr.tagName !== "TR") {
                             continue;
                     }
                     nodeTr.removeClassName("active_row");
                     var nodesTd = nodeTr.childNodes;
                     var ll = nodesTd.length;
                     for (var ii = 0; ii < ll; ii++) {
                             var nodeTd = $(nodesTd[ii]);
                             if (nodeTd.tagName !== "TD" && nodeTd.tagName !== "TH") {
                                     continue;
                             }
                             nodeTd.removeClassName("active_cell");
                             nodeTd.removeClassName("active_c");
                             if (nodeTd.getElementsByTagName("A")[0]) {
                                     jQuery(nodeTd.getElementsByTagName("A")[0]).removeClass("active_c");
                             }
                     }
             }  
   /*
     window.setTimeout(function() {
         // nenuimam jei yra hoveris
     //   jQuery('#matrix-table').bind("mouseleave", matrixHighlightDisable);
        
        if (jQuery('#matrix_tooltip:hover').length > 0 && jQuery('.matrix table .matrix-tooltip:hover').length == 0){
           // return true;  
        }
  
	    }, 0);   
     */              
}

function matrixHideTooltip(event) {
	if (__matrix__dimensions__ === null) {
		var el = jQuery("#the_matrix");
		__matrix__dimensions__ = new Array();
		__matrix__dimensions__[0] = el.offset().left;
		__matrix__dimensions__[1] = el.offset().top;
		__matrix__dimensions__[2] = __matrix__dimensions__[0] + el.width();
		__matrix__dimensions__[3] = __matrix__dimensions__[1] + el.height();
	}
	if (
		(event.pageX < __matrix__dimensions__[0] || event.pageX > __matrix__dimensions__[2] ||
		event.pageY < __matrix__dimensions__[1] || event.pageY > __matrix__dimensions__[3])
                && jQuery('#matrix_tooltip:hover').length == 0	// kad nenuimtu tooltip, jei uzeita su pele ant jo
            ) {
		jQuery(document).unbind("mousemove", matrixHideTooltip);
                jQuery('#matrix_tooltip').attr('class', 'matric_popup');
                jQuery("#matrix_tooltip").hide();
	}
}
__matrix__loaded__ = {};
__matrix__uri__ = null;
__matrix__dimensions__ = null;
function matrixShowTooltip(event, uri) {
	var el = $("matrix_tooltip");
	el.style.display = "";
	el.style.position = "absolute";
	el.style.zIndex = 10;
        jQuery('#matrix_tooltip').attr('class', 'matric_popup');
	if (event) {
                // get srcElement if target is falsy (IE bug)
                var targetElement = event.target || event.srcElement;
                /*
                    if (jQuery(targetElement).prop('tagName') != 'TD'){
                        return true;
                    }
                  */              
		el.style.top =  (targetElement.offsetTop + 40) + "px"; //(event.target.offsetTop - el.getOffsetParent().cumulativeOffset().top - 5) + "px";
		el.style.left = (targetElement.offsetLeft + 10) + "px"; //(event.target.offsetLeft - el.getOffsetParent().cumulativeOffset().left + 13) + "px";
                  }
	var loading = true;
	__matrix__uri__ = uri;
	if (!__matrix__loaded__[uri]) {
		__matrix__loaded__[uri] = [null, null, false];
		listener = {uri : uri}
		listener.onMatrixTooltipLoad = function(response) {
			__matrix__loaded__[this.uri][0] = null;
			__matrix__loaded__[this.uri][1] = response.responseText ? response.responseText : null;
			__matrix__loaded__[this.uri][2] = true;
			if (__matrix__uri__ == this.uri) {
				matrixShowTooltip(null, this.uri);
			}
		}
		requestWithListener(uri, listener.onMatrixTooltipLoad.bind(listener));
	} else if (__matrix__loaded__[uri][0] === null && __matrix__loaded__[uri][2]) {
		var content = __matrix__loaded__[uri][1];
		if (content === null) {
			$("matrix_tooltip").style.display = "none";
		} else {
                        addiconclass = jQuery('td.active_c').attr('class');
                        if (addiconclass != undefined){
                            jQuery('#matrix_tooltip').attr('class', 'matric_popup addicon ' + addiconclass);
                        }
			$("matrix_tooltip_menu").innerHTML = content;
		}
		loading = false;
	}
	if (loading) {
		$("matrix_tooltip_menu").innerHTML = "<li>Kraunasi...</li>";
	}
	jQuery(document).unbind("mousemove", matrixHideTooltip).bind("mousemove", matrixHideTooltip);
}
function matrixShowHide() {
	var el = $("the_matrix");
	var activated = el.hasClassName("activate");
	var options = {
		duration : 0.3,
		activated : activated,
		beforeSetup : function() {
			$("the_matrix").addClassName("activate");
		},
		afterFinish : function() {
			var el = $("the_matrix");			
			el.removeClassName("activate");
			el.removeClassName("actiate");
			el.addClassName(this.activated ? "actiate" : "activate");
			$("the_matrix_handle").innerHTML = this.activated ? "Rodyti matricą" : "Paslėpti matricą";
			
			// IE 8(lamest browser available) bug workaround
			var elBefore = el.nextSibling;
			var elParent = el.parentNode;
			elParent.removeChild(el);
			elParent.insertBefore(el, elBefore);
		}
	}
	setCookie("__matrix_open", !activated ? 1 : 0);
	if (activated) {
		Effect.SlideUp("the_matrix_container", options);
	} else {
		var el = $("the_matrix");
		el.removeClassName("activate");
		el.removeClassName("actiate");
		el.addClassName("activate");
		Effect.SlideDown("the_matrix_container", options);
		el.removeClassName("activate");
	}
    addUserLog('matrix_expanded');
}
function setOverMatrixButton(event, show) {
	var elRoot = $("high_arrows");
	var el = Event.element(event);
	var nodes = elRoot.getElementsByTagName("A");
	var l = nodes.length;
	$("high_arrows_context2").innerHTML = "";
	for (var i = 0; i < l; i++) {
		var active = el === nodes[i] && show;
		var className = "a" + (i + 1);
		elRoot.removeClassName(className);
		var elSource = jQuery("#__matrix_" + i);
		elSource.css("display", "none");
		var column = i % 2 === 1 && i !== 9 ? 2 : 1;		
		if (active) {
			elRoot.addClassName(className);
			$("high_arrows_context2").innerHTML = column === 2 ? elSource.html() : "";
			elSource.css("display", column === 1 ? "" : "none");
		}		
	}
}
function setOverMatrixInnerButton(position, show) {
	var elRoot = $("low_arrows");
	var nodes = elRoot.getElementsByTagName("A");
	var l = nodes.length;
	for (var i = 0; i < l; i++) {
		elRoot.removeClassName("aaa" + (i + 1));
	}
	if (show) {
		elRoot.addClassName("aaa" + (position + 1));
	}
}
function onChangeChangePassword() {
	var display = $("change_password").checked ? "" : "none";	
	$("row_old_password").style.display = display;
	$("row_password").style.display = display;
	$("row_password_repeat").style.display = display;	
}
function playerFullScreen() {
	document.location = document.location + ",fullscreen.1";
}
function showHideBlock(id) {
	jQuery("#" + id).toggle();
}

__prev_infoblock__ = null
function showHideBlockInfo(id, id_handle) {
	showHideBlock(id);
	var el = jQuery("#" + id);
	var elHandle = jQuery("#" + id_handle);
	if (!el || !elHandle || el.css("display") === "none") {
		return false;
	}	
	var position = elHandle.offset();
	position.top += elHandle.height();
	el.css("position", "absolute");
	el.offset(position);
	el.css("z-index", 10);
	if (__prev_infoblock__ && __prev_infoblock__ !== el.get(0)) {
		jQuery(__prev_infoblock__).hide();
	}
	__prev_infoblock__ = el.get(0);
	addUserLog('share');
}

__group_visible = {};
function setBlockInfoVisible(id, id_handle, visible, center, group) {
	var el = $(id);
	if (visible === undefined) {
		visible = el.style.display === "none" ? true : false;
	}
	el.style.display = visible ? "" : "none";
	var elHandle = $(id_handle);
	if (!el || !elHandle || el.style.display === "none") {
		return false;
	}
	el.clonePosition(
		elHandle, 
		{
			offsetTop : elHandle.getHeight() - 15, 
			offsetLeft: center ? (elHandle.getWidth() * .5) - 15 : -4
		}
	);
	if (group) {
		if (__group_visible[group] && __group_visible[group] != el) {
			__group_visible[group].style.display = "none";
		}
		__group_visible[group] = el;
	}
}

function onChangeSritisResponse(response) {
	var el = $("ability");
	var elParent = el.parentNode;
	elParent.removeChild(el);
	elParent.innerHTML += response.responseText;
}

function onDeleteViewResponse(response) {	
	var parts = response.responseText.split(" ");
	if (parts[0] === 'success') {
		var el = $("myview_" + parts[1]);
		var nodeParent = el.parentNode;
		if (el) {
			el.remove();
		}
		var nodes = nodeParent.children;
		var l = nodes.length;
		for (var i = 0; i < l; i++) {
			var node = $(nodes[i]);
			node.removeClassName("last");
			if (i % 4 == 3) {
				node.addClassName("last");				
			}
		}
	}
}
function requestWithListener(uri, listener) {
	new Ajax.Request(uri, {onComplete : listener, method: 'get'});
}
__evaluation_file_fields_max = 10;
__evaluation_file_fields = 1;
function evaluationAddFileField() {
	if (__evaluation_file_fields >= __evaluation_file_fields_max) {
		return false;
	}
	var el = $("evaluation_files");
	if (!el) {
		return false;
	}
	var nodeDiv = el.parentNode.insertBefore(document.createElement("DIV"), el.nextSibling);
	nodeDiv.className = "form_row browse_row";
	var nodeLabel = nodeDiv.appendChild(document.createElement("LABEL"));
	nodeLabel.style.clear = "both";
	nodeLabel.appendChild(document.createElement("BR"));
	var nodeFile = document.createElement("INPUT");
	nodeFile.type = "file";
	nodeDiv.appendChild(nodeFile)
	nodeFile.className = "text";
	nodeFile.name = "file[]";
	__evaluation_file_fields++;
	if (__evaluation_file_fields >= __evaluation_file_fields_max) {
		$("evaluation_files_add").remove();
	}
}
function onChangeEvaluation(id) {	
	var el = $(id);
	if (!el) {
		return false;
	}
	var elFieldId = el.name + "_hidden";
	var elField = $(elFieldId);
	if (!elField) {
		var elForm = $("form_evaluation");
		elField = document.createElement("INPUT");
		elField.setAttribute("type", "hidden");
		elForm.appendChild(elField);
		elField.name = el.name;
		elField.id = elFieldId;
	}
	elField.value = el.value;
}
function deleteMoView(uri, row_id) {
	if (confirm('Ar tikrai norite ištrinti šį vaizdą?')) {		
		$(row_id).remove();
		new Ajax.Request(uri, {method: 'get'});
	}
}
function deleteTest(uri, row_id) {
	if (confirm('Ar tikrai norite ištrinti šį testą?')) {
		var listener = {}
		listener.complete = function() {
			m2.instance("g2.testsfilter").changed();
		}
		jQuery.get(uri, jQuery.proxy(listener.complete, listener));
	}
}
function deleteTestQuestion(uri) {
	if (confirm('Ar tikrai norite ištrinti šį testo klausimą?')) {		
		requestWithListener(uri, onDeleteTestQuestion);
	}
}
function deleteTopic(uri, node) {
	if (!confirm('Ar tikrai norite ištrinti šią temą?')) {		
		return false;
	}
	var listener = {"node" : jQuery(node)}
	listener.complete = function(response) {
		if (response == 1) {
			this.node.parents("div.element").remove();
			m2.instance("g2.topics").reload();
		}
	}
	jQuery.get(uri, jQuery.proxy(listener.complete, listener));	
}
function onDeleteTestQuestion(response) {
	var parts = response.responseText.split(" ");	
	if (parts[0] === 'success') {
		var el = $("test_questions_list_row_" + parts[1]);
		if (el) {
			el.remove();
		} else {
			alert("Klausimas ištrintas");
		}
	} else {
		alert("Klausimas negali būti ištrintas nes yra įtrauktas į kitą testą");
	}
}
function deleteScenario(uri, row_id) {
	if (confirm('Ar tikrai norite ištrinti šį komplektą?')) {		
		new Ajax.Request(uri, {method: 'get'});
		if (row_id) {
			$(row_id).remove();
		} else {
			alert("Komplektas ištrintas");
		}
	}
}
function saveScenario(uri) {
	var fields = ["form_id", "name", "email", "title", "description"];
	var l = fields.length;
	var post = {};
	for (var i = 0; i < l; i++) {
		var field = fields[i];
		if (el = $(field)) {
			post[field] = el.value;
		}
	}
	new Ajax.Request(uri, {method: "post", onComplete : onSaveScenario, parameters : post});
}
function onSaveScenario(response) {	
	var parts = response.responseText.split(" ", 2);
	if (parts[0] === "success") {
		$("new_scenario").style.display = "none";
		showScenariosMessage("Komplektas sėkmingai išsaugotas.");
		if (parts.length != 1) {
			var node = jQuery("#success_message_not_logged");
			node.show();
			node.find(".warning-message").html(response.responseText.substr(7));
			m2.instance("m2.ajaxforms").reset();
		}
		return true;
	}
	$("new_scenario").innerHTML = response.responseText;
}
function moveInScenario(uri, delta, el_id) {
	requestWithListener(uri, onMoveInScenario.bind(null, delta, el_id));		
}
function onMoveInScenario(delta, el_id) {
	var el = $(el_id);
	var before = delta > 0 ? (el.nextSibling ? el.nextSibling.nextSibling : null) : el.previousSibling;
	if (before || delta > 0) {
		var parent = el.parentNode;
		parent.removeChild(el);
		if (before) { 
			parent.insertBefore(el, before);
		} else {
			parent.appendChild(el);
		}
	}
	refreshScenarioSorting();
}
function refreshScenarioSorting() {
	var parent = $("scenario_list");
	var node = $(parent.firstChild);
	var first = true;
	for (;;) {
		$(node.id + "_up").style.display = "";
		$(node.id + "_down").style.display = "";
		node.removeClassName("first");
		node.removeClassName("last");
		if (first) {
			$(node.id + "_up").style.display = "none";
			node.addClassName("first");
			first = false;
		}		
		if (!node.nextSibling) {
			$(node.id + "_down").style.display = "none";
			node.addClassName("last");
			break;
		}
		node = $(node.nextSibling);
	}
	refreshScenarioWarnings();
}
__veiklos_sritis_n__ = 1;
function addQuestionVeiklosSritis(default_value) {
	var el_source = $("row_veiklossritis[0]");
	var el_id = "veiklossritis[" + __veiklos_sritis_n__ + "]";
	var el = el_source.parentNode.insertBefore(document.createElement("DIV"), $("row_veiklossritis[" + (__veiklos_sritis_n__ - 1) + "]").nextSibling);
	el.id = "row_" + el_id;
	el.className = "form_row";
	el.innerHTML = "<label><br/></label><select id=\"" + el_id + "\" name=\"" + el_id + "\">" + 
		$("veiklossritis[0]").innerHTML + "</select>";
	__veiklos_sritis_n__++;
	if (__veiklos_sritis_n__ >= 10) {
		$("veiklossritis[0]_add").remove()
	}
	if (default_value) {
		$(el_id).value = default_value;
	}
}
function showScenariosMessage(message, type) {
	var el = $("success_message");
	el.className = type === "error" ? "error_message" : "anounce";
	el.style.display = "";
	el.innerHTML = message;
}
function onAddActiveScenarioObject(response) {
	if (!response.responseText) {
		return false;
	} else if (response.responseText === "error") {
		showScenariosMessage(
			"Objekto nepavyko įdėti į komplektą, greičiausiai toks objektas nerastas arba jau įdėtas",
			"error"
		)
		return false;
	}
	// Workaround so we dont loose objects/tags linking
	var el = $("scenario_list").appendChild(document.createElement("DIV"));
	el.innerHTML = response.responseText;
	var nodeDiv = el.firstChild;
	nodeDiv.parentNode.removeChild(nodeDiv);
	el.parentNode.appendChild(nodeDiv);
	el.remove();
	var nodes = jQuery("#scenario_list script");
	for (var i = 0; i < nodes.length; i++) {
		eval(jQuery(nodes[i]).html());
	}		
	refreshScenarioSorting();
	showScenariosMessage("Naujas objektas sėkmingai įdėtas į komplektą.");
}
function refreshScenarioWarnings() {
	$("handle_new_scenario").onclick = function() {
		return confirmNewScenario();
	}
	$("load_scenario_id_handle").onclick = function() {
		return loadScenarioHandle(true);
	}
}
function confirmNewScenario() {
	return confirm('Sukuriant naują komplektą visi dabartiniame komplekte esantys elementai bus pašalinti. Ar norite tęsti?');
}
function clickOnEnter(event, element_id) {
	var keyCode = event.keyCode ? event.keyCode : event.charCode;
	if (keyCode === 13 || keyCode === 10) {
		var el = $(element_id);
		if (el.onclick) {
			el.onclick();
		} else if (el.click) {
			el.click();
		}
	}
}
function onChangeQuestionCorrect(el) {
	var el = $(el);
	var elRow = $(el.id + "_row").removeClassName("type_3");
	if (!el.checked) {
		elRow.addClassName("type_3");
	}
}
function loadScenario(uri_change, uri_test, warning) {
	var listener = {uri_change : uri_change, warning : warning};
	listener.onResponse = function(response) {
		if (response.responseText != 1) {
			showScenariosMessage("Išrinktųjų komplektas nerastas.", "error");
		} else {
			if (
				!this.warning || confirm(
					"Jūsų pasirinktame išrinktųjų komplekte jau yra užkrautų objektų. " + 
					"Užkraunant naują komplektą jie bus pašalinti. Ar norite tęsti?"
				)
			) {
				document.location = this.uri_change;
			} 
		}
	}
	new Ajax.Request(uri_test, {method: "get", onComplete : listener.onResponse.bind(listener)});
}

function loadScenarioHandle(warning) {
	var uri = $("load_scenario_id_handle").getAttribute("alt");
	loadScenario(
		uri + ',change.' + $('load_scenario_id').value, 
		uri + ',change_test.' + $('load_scenario_id').value, warning	
	);
}

function addUserLog(type) {
    var cookieName = '__userstats__';
    var h = new Array(type);
    var cookie = getCookie(cookieName);

    if (cookie !== null) {
        var d = cookie.evalJSON();
        if (d !== null) {
            h.push(d);
            h = h.flatten().uniq();
        }
    }
    setCookie(cookieName, h.toJSON(), 2);
}
function selectAllActivities(intialize) {
	var el = $("activities_filter");
	var el_checkbox = $("scopes_all");
	var nodes = el.children;
	var l = nodes.length;
	if (intialize) {
		var total_selected = 0;		
		for (var i = 0; i < l; i++) {
			if (i >= l - 1) {
				continue;
			}
			if (nodes[i].getElementsByTagName("INPUT")[0].checked) {
				total_selected++;
			}
		}
		el_checkbox.checked = total_selected >= l - 1;
		return true;
	}
	for (var i = 0; i < l; i++) {
		if (i >= l - 1) {
			continue;
		}
		nodes[i].getElementsByTagName("INPUT")[0].checked = el_checkbox.checked;
	}	
}
function updateScreenShots() {
	var listener = {};
	listener.onResponse = function(response) {
		var parts = response.responseText.split("\n");
		var viewsTotal = Number(parts.shift());
		var newHTML = parts.join("\n");
		var elTotal = $("menu_views_total");
		var elOld = $("__saved_views");
		var elBefore = $("__item_bottom_controls__");
		if (elOld) {
			elOld.remove();
		}
		elTotal.innerHTML = "(" + viewsTotal + ")";
		elTotal.style.display = viewsTotal > 0 ? "" : "none";
		var newNode = document.createDocumentFragment();
		newNode.appendChild(document.createElement("DIV")).innerHTML = newHTML;
		var newNodeInner = newNode.firstChild.getElementsByTagName("DIV")[0];
		newNode.firstChild.removeChild(newNodeInner);
		newNode.appendChild(newNodeInner);
		newNode.removeChild(newNode.firstChild);
		if (elBefore.nextSibling) {
			elBefore.parentNode.insertBefore(newNode, elBefore.nextSibling);
		} else {
			parentNode.appendChild(newNode);
		}
	}
	new Ajax.Request(
		__uri_update_views, {method: "get", onComplete : listener.onResponse.bind(listener)}
	);
}
function autoSizePlayer() { 
	var default_w = 800;
	var default_h = 600;
	node = null;
	nodes = $("grotuvas_container").childNodes;
	l = nodes.length;
	for (i = 0; i < l; i++) {
		if (nodes[i].nodeType == 1) {
			node = nodes[i];
			break;
		}
	}
	var w2 = document.viewport.getWidth() - 60;
	var h2 = document.viewport.getHeight() - 16 - jQuery("#grotuvas_container").offset().top;
	var h = h2;
	var w = default_w * h / default_h;
	if (w > w2) {
		w = w2;
		h = default_h * w / default_w;
	}	
	node.parentNode.style.height = node.style.height = Math.round(h) + "px";
	node.parentNode.style.width = node.style.width = Math.round(w) + "px";	
}
function initializeAutoSizePlayer() {
	if (document.all){
		document.body.onresize = autoSizePlayer;
	} else {
  		if (window.addEventListener) {
      		window.addEventListener("resize", autoSizePlayer, false);
   		} else {
      		window.attachEvent("resize", autoSizePlayer);
		}
	}
	autoSizePlayer();
}

var g2 = {};

g2.initialize = function() {
	
	if (!('placeholder' in document.createElement('input'))) {
		g3.initializeObjects([["*[placeholder]", "g3.placeholder"]]);
	}
	
	g2.toggle.initialize();
	m2.instance("g2.slider");
	
	m2.instance('g2.testquestions');
	new g2.testsfilterquestiontypes();
	m2.instance("g2.testsfilter");
	m2.instance("g2.testquestionsselected");
	m2.instance("g2.evaluation");
	new g2.testcopy();
	new g2.countdown();			
	new g2.explainer();

	m2.instance("m2.ajaxforms");
	m2.instance("m2.blurtext");
	g2.dialog.initialize();
	
	m2.instance("m2.addthis");
	new g2.sliderinteractive();
        matrixInitialize();
}

g2.topics = function() {
	var dialog = g2.dialog.instance("topic-edit-popup");
	if (dialog) {
		dialog.node.dialog("widget").bind("dialogclose", jQuery.proxy(this.reload, this));
	}
	dialog = g2.dialog.instance("topic-new-popup");
	if (dialog) {
		dialog.node.dialog("widget").bind("dialogclose", jQuery.proxy(this.reload, this));
	}
}

g2.topics.prototype.reload = function() {
	var node = jQuery("#topics_list_container");
	var listener = {"node" : jQuery(node), preloader : new m2.preloader({'target' : node})};
	listener.complete = function(response) {
		this.node.html(response);
		this.preloader.destroy();
		g2.dialog.initialize();
	}	
	jQuery.get(node.attr("uri"), jQuery.proxy(listener.complete, listener));
}

g2.testsfilterquestiontypes = function() {
	
	g2.testsfilterquestiontypes.instance = this;
	
	this.nodes = jQuery(".__testsfilter_question_types__");
	this.nodes.find("a.transparent-button").bind("click", jQuery.proxy(this.clear, this));
	this.reset();
	
}

g2.testsfilterquestiontypes.instance = null;

g2.testsfilterquestiontypes.prototype.clear = function(event) {
	var node = jQuery(event.target);
	node.parents(".__testsfilter_question_types__").find("input[type='checkbox']").attr('checked', false);
}

g2.testsfilterquestiontypes.prototype.reset = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		var node = jQuery(this.nodes[i]);
		var nodesValue = node.find("input[type='checkbox']");
		var values = new Array();
		for (var ii = 0; ii < nodesValue.length; ii++) {
			var nodeValue = jQuery(nodesValue[ii]);
			if (nodeValue.attr("checked")) {
				values.push(nodeValue.next().html());
			}
		}
		node.find("span").html(
			values.length > 0 && values.length < nodesValue.length ? values.join(", ") : "Visi"
		);
		g2.toggle.instance.layout(node.find(".absolute-toggle"));
	}		
}


g2.explainer = function() {
	jQuery(".explainer").click(jQuery.proxy(this.show, this));
	jQuery(".close-explain").click(jQuery.proxy(this.hide, this));
}

g2.explainer.prototype.show = function(event) {
	var nodeHandle = jQuery(event.target);
	if (nodeHandle.get(0).nodeName === "IMG") {
		nodeHandle = nodeHandle.parent();
	}
	var node = nodeHandle.next();		
	var position = nodeHandle.position();	
	node.css({position: 'absolute', left: position.left - 10, top: position.top - 6});
	node.fadeIn(200);
}

g2.explainer.prototype.hide = function(event) {
	jQuery(event.target).parent().fadeOut(200);
}

g2.slider = function() {
	this.node = jQuery("#slider");
	this.nodeValue = jQuery("#slider-value");
	var value = this.nodeValue.val();
	this.node.slider({
		range: "max", 
		min: Number(jQuery("#slider_min").text()), max: 1, 
		value: Number(this.nodeValue.val()), 
		slide: jQuery.proxy(this.changed, this)
	});	
	this.nodeValue.bind("keyup", jQuery.proxy(this.change, this));
	this.setMax(jQuery(".__testeditquestions_list_edit__ *[question]").length);	
	this.nodeValue.val(value);
	this.refresh();
}

g2.slider.prototype.setMax = function(max) {
	var is_max = Number(jQuery("#slider_max").html()) <= Number(this.nodeValue.val());
	max = Math.max(0, max);
	jQuery("#slider_max").html(max);	
	this.node.slider("option", "max", Number(max));	
	this.nodeValue.val(is_max ? max : Math.max(Math.min(this.nodeValue.val(), max), 0));
	jQuery("#slider_min").html(max > 0 ? 1 : 0);
	this.refresh();
}

g2.slider.prototype.refresh = function() {
	var value = Math.max(Math.min(this.nodeValue.val(), this.node.slider("option", "max")), 0);
	this.nodeValue.val(value);
	this.node.slider("value", value);	
}

g2.slider.prototype.change = function(event) {
	this.refresh();
	m2.instance("g2.testquestionsselected").resetDifficultyOffer();
}

g2.slider.prototype.changed = function(event, ui) {
	this.nodeValue.val(ui.value);
	m2.instance("g2.testquestionsselected").resetDifficultyOffer();
}

g2.testcopy = function () {
	
	g2.testcopy.instance = this;
	this.reset();
}

g2.testcopy.instance = null;

g2.testcopy.prototype.reset = function() {
	var handle = jQuery.proxy(this.submit, this);
	jQuery(".__form_copy_test__ a.green-button").unbind("click", handle).bind("click", handle);
}

g2.testcopy.prototype.submit = function(event) {
	jQuery(event.target).parent().parent().parent().attr("uri");
}

g2.testsfilter = function(options) {
	
	this.options = options ? options : {};
	this.prefix = this.options.parent ? "#" + this.options.parent + " " : "";
	this.timeout = null;
	
	jQuery(this.prefix + "#question-tabs").tabs().bind("tabsshow", jQuery.proxy(this.tabChanged, this));

	this.reset();
	if (jQuery(".__testeditquestions_list_edit__").length > 0) {
		
		this.changed();
	}
}

g2.testsfilter.prototype.tabChanged = function() {
	this.reset();
	var nodeLogin = jQuery(this.prefix + "#show-visitor-login").parents("div.orange-block");
	if (nodeLogin.length <= 0) {
		this.changed();
	}
}

g2.testsfilter.prototype.questionSaved = function() {	
	g2.dialog.instance("new-question-popup").node
		.bind("dialogclose", jQuery.proxy(this.changed, this));
}

g2.testsfilter.prototype.resetTopics = function() {
	var nodes = jQuery(this.prefix + ".multi-select input[type='checkbox']");
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].checked = false;
	}
	this.change(null);
	return void(0);
}

g2.testsfilter.prototype.reset = function() {	
	var handle = jQuery.proxy(this.change, this);
	var handleInput = jQuery.proxy(this.keyDownInput, this);
	var handleInputFilter = jQuery.proxy(this.keyDownInputFilter, this);
	var handleClear = jQuery.proxy(this.clear, this);
	var handleType = jQuery.proxy(this.changeType, this);
	this.nodes = jQuery(this.prefix + ".__testsfilter_keywords__");
	this.nodes.unbind("keyup", handle).bind("keyup", handle)
		.unbind("keydown", handleInput).bind("keydown", handleInput);
	jQuery(this.prefix + ".multi-select input[type='text']").unbind("keyup", handleInputFilter).bind("keyup", handleInputFilter)
		.unbind("keydown", handleInput).bind("keydown", handleInput);
	if (!this.options.parent) {
		jQuery(this.prefix + ".multi-select input[type='checkbox']").unbind("change", handle).bind("change", handle);
	}
	jQuery(this.prefix + ".__testsfilter_question_types__ .multi-select input[type='checkbox']").unbind("change", handle);
	jQuery(this.prefix + ".__testsfilter_question_types__ a.green-button").unbind("click", handleType).bind("click", handleType);
	jQuery(this.prefix + " a.clear_list_filter").unbind("click", handleClear).bind("click", handleClear);
	
	var node = jQuery(this.prefix + ".__testeditquestions_list__");
	if (node.length > 0) {
		jQuery(this.prefix + ".margin-tb-10 .block-header strong b").html(
			node.find("div.questions-selction").children("div.item").length
		);
	}
	var nodeLogin = jQuery(this.prefix + "#show-visitor-login").parents("div.orange-block");
	var nodeNewQuestion = jQuery("#add-new-question");
	var tab = jQuery("#tabs-1:visible").length > 0 ? 1 : 2;		
	if (nodeLogin.length > 0) {
		var nodeParent = nodeLogin.parent();
		if (tab === 1) {
			nodeParent.children().show();
			nodeLogin.hide();
		} else {
			nodeParent.children().hide();
			nodeLogin.show();
		}
	} else {
		jQuery(".__testeditquestions_list_edit_add__").parent().show();
	}	
	if (nodeNewQuestion.length > 0) {
		nodeNewQuestion.parent().css("display", nodeLogin.length == 0 ? "" : "none");
	}
	
	m2.instance("g2.testquestionsselected").reset();	
	if (!g2.toggle.instance) {
		g2.toggle.initialize();
	}
	g2.toggle.instance.reset();
	g2.dialog.initialize();
	g2.testsfilterquestiontypes.instance.reset();
	this.resetQuickFilters();	
}

g2.testsfilter.prototype.clear = function(event) {
	this.nodes.val("");
	jQuery(this.prefix + ".multi-select input[type='text']").val("");
	jQuery(this.prefix + ".multi-select input[type='checkbox']").attr("checked", false);
	m2.instance("m2.blurtext").allblur();
	this.changed();
}

g2.testsfilter.prototype.keyDownInputFilter = function(event) {
	this.resetQuickFilter(event.target)
	return false;
}

g2.testsfilter.prototype.keyDownInput = function(event) {
	return event.keyCode != 13;
}

g2.testsfilter.prototype.resetQuickFilters = function() {
	m2.instance("m2.blurtext").allfocus();
	var nodes = jQuery(this.prefix + ".multi-select input[type='text']");
	for (var i = 0; i < nodes.length; i++) {
		this.resetQuickFilter(nodes[i]);
	}
	m2.instance("m2.blurtext").allblur();
}

g2.testsfilter.prototype.resetQuickFilter = function(node) {
	node = jQuery(node);
	var filter = node.val();
	var nodes = node.parent().find(".items-holder div.clearfix");
	for (var i = 0; i < nodes.length; i++) {
		var nodeRow = jQuery(nodes[i]);
		var hide = nodeRow.find("label").html().toLowerCase().indexOf(filter) === -1;
		if (hide) {
			nodeRow.hide();
			nodeRow.find("input").get(0).checked = false;
		} else {
			nodeRow.show();
		}
	}
}

g2.testsfilter.prototype.changeType = function(event) {	
	jQuery(".__testsfilter_question_types__ a.toggle").trigger("click");
	this.change();
}

g2.testsfilter.prototype.change = function(event) {	
	if (this.timeout !== null) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
	this.timeout = setTimeout(jQuery.proxy(this.changed, this), 200);
	return true;
}

g2.testsfilter.prototype.changed = function() {
	if (this.timeout !== null) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
	var form = jQuery(this.nodes.parents("form"));
	var focused = document.activeElement;
	var focused_id = focused ? focused.id : null;
	m2.instance("m2.blurtext").allfocus();
	var node = jQuery(this.prefix + ".__testeditquestions_list__");
	if (node.length <= 0) {
		node = jQuery(this.prefix + ".tests-list");
		if (node.length <= 0) {
			node = jQuery('#__test_question_edit__ .multi-select');
		}
	}
	var isShown = node.css("display") !== "none";
	node.show();
	var listener = {
		parent : this, preloader : new m2.preloader({target : node}), "focused_id" : focused_id
	};	
	if (!isShown) {
		node.hide();
	}
	listener.response = function(result) {
		this.preloader.destroy();
		this.parent.response(result);
		if (this.focused_id) {
			jQuery("#" + this.focused_id).focus();
		}
	}
	jQuery.post(
		this.nodes.parents("*[uri]:visible").attr("uri"), form.serialize(), 
		jQuery.proxy(listener.response, listener)
	);
	m2.instance("m2.blurtext").allblur();
	if (focused) {
		jQuery(focused).focus();
	}
}

g2.testsfilter.prototype.response = function(result) {
	result = eval(result)[0];
	jQuery(this.prefix + ".test-elements-list").remove();
	jQuery(this.prefix + ".tests-list-top").after(result["content"]);
	jQuery(this.prefix + ".__testeditquestions_list__").replaceWith(result["content"]);	
	jQuery(this.prefix + ".multi-select .items-holder").remove();
	for (var i in result) {
		if (i !== "content") {
			jQuery(this.prefix + ".multi-select input[name='" + i + "']").after(result[i]);
		}
	}
	this.reset();
}

g2.dialog = function(id) {
		
	this.node = jQuery("#" + id);
	var title = "";
	if (this.node.attr("title_dialog")) {
		title = this.node.attr("title_dialog");
	} else {
		title = '<h1 class="title test_title">' + this.node.attr("title") + '</h1>';
	}	
	this.node.attr("title", title);
	this.node.dialog({
		resizable: false, 
		width: this.node.attr("width") ? this.node.attr("width") : 300, 
		height: this.node.attr("height") ? this.node.attr("height") : 300, 
		modal: true, draggable: false
	});	
	this.preloader = null;
	this.loaded = !this.node.attr("uri");
	
	if (id === "delete-question-popup" || id === "copy-question-popup") {
		var listener = m2.instance("g2.testsfilter");
		this.node.bind("dialogclose", jQuery.proxy(listener.changed, listener));
	} else if (id.indexOf("copy-test-popup-") === 0) {
		var listener = m2.instance("g2.testsfilter");
		this.node.bind("dialogclose", jQuery.proxy(listener.changed, listener));
	}
	
	g2.dialog.initialize();
	
}

g2.dialog.instances = new Object();

g2.dialog.instance = function(id) {
	return g2.dialog.instances[id];
}

g2.dialog.initialize = function() {
	jQuery("a[popup]").unbind("click", g2.dialog.showDialog).bind("click", g2.dialog.showDialog);
}

g2.dialog.showDialog = function(event) {
	var node = jQuery(event.target);
	var popup = node.attr("popup");
	jQuery("#" + popup).attr("uri", node.attr("uri"));
	if (g2.dialog.instances[popup]) {
		g2.dialog.instances[popup].node.attr("uri", node.attr("uri"))
	}
	g2.dialog.show(popup, true, false);
}

g2.dialog.show = function(id, reload, loaded) {
	if (!g2.dialog.instances[id]) {
		g2.dialog.instances[id] = new g2.dialog(id);
	}
	g2.dialog.instances[id].open(reload, loaded);
	return void(0);
}

g2.dialog.hide = function(id, timeout) {
	if (timeout) {
		setTimeout("g2.dialog.hide('" + id + "')", timeout);
	} else {
		g2.dialog.instances[id].close();
	}	
	return void(0);
}

g2.dialog.prototype.reset = function() {
	if (this.preloader) {
		this.preloader.destroy();
		this.preloader = null;
	}
	var handle = jQuery.proxy(this.close, this);
	var handleSubmit = jQuery.proxy(this.submit, this);
	var nodesSubmit = this.node.find(".dialog_submit");
	
	this.node.find(".dialog_cancel").unbind("click", handle).bind("click", handle);
	nodesSubmit.unbind("mousedown", handleSubmit).bind("mousedown", handleSubmit);	
	
	if (nodesSubmit.length > 0) {
		var handleKeyUp = jQuery.proxy(this.keyUp, this);
		this.node.find("input[type=text]").unbind("keyup", handleKeyUp).bind("keyup", handleKeyUp);
	}
	this.node.dialog("widget").position({of : window, at : "center center"});	
	g2.dialog.initialize();
}

g2.dialog.prototype.load = function() {
	this.node.load(this.node.attr("uri"), jQuery.proxy(this.reset, this));	
	this.preloader = new m2.preloader({target : this.node.dialog("widget")});	
}

g2.dialog.prototype.keyUp = function(event) {
	if (event.keyCode == 13) {		
		this.submit();
	}
	return event.keyCode;
}

g2.dialog.prototype.submit = function(event) {
	if (event) {
		var node = jQuery(event.target);
		if (node.attr("onclick")) {
			eval(node.attr("onclick"));
			node.attr("onclick")();
		}
	}
	var form = this.node.find("form");
	this.preloader = new m2.preloader({target : this.node.dialog("widget")});	
	m2.instance("m2.blurtext").allfocus();
	jQuery.post(
		this.node.attr("uri") ? this.node.attr("uri") : form.attr("uri"), form.serialize(), 
		jQuery.proxy(this.submitted, this)
	);
	m2.instance("m2.blurtext").allblur();	
}

g2.dialog.prototype.submitted = function(response) {
	this.node.html(response);
	this.reset();
}

g2.dialog.prototype.open = function(reload, loaded) {
	if (loaded) {
		this.loaded = true;
	}
	this.node.dialog("open");
	this.reset();
	if (!this.loaded || reload) {
		this.load();
		this.loaded = true;
	}	
}

g2.dialog.prototype.close = function() {
	this.node.dialog("close");
}

g2.toggle = function() {
	
	this.cookie = 'toggle';
	this.remember();	
	
}

g2.toggle.instance = null;

g2.toggle.initialize = function() {
	if (g2.toggle.instance === null) {
		g2.toggle.instance = new g2.toggle();
	}
	g2.toggle.instance.reset();
}

g2.toggle.prototype.remember = function() {
	var ids = this.remembered();	
	for (var i = 0; i < ids.length; i++) {
		var node = jQuery("*[toggle_remember='" + ids[i] + "']");		
		if (node.length > 0) {
			if (ids[i] === "evaluation") {
				this.toggleElement(node, "evaluation", "toggle-open toggle-white-open");
			} else {
				this.toggleElement(node, "test_result_list");
			} 
		}
	}
}

g2.toggle.prototype.remembered = function(save) {
	if (save) {
		setCookie(this.cookie, save.join(";"));		
		return save;
	}
	var ids = getCookie(this.cookie);
	return ids ? ids.split(";") : new Array();
}

g2.toggle.prototype.reset = function() {
	var handler = jQuery.proxy(this.toggle, this);
	var handlerCorrect = jQuery.proxy(this.toggleCorrect, this);
	
	jQuery(".toggle_related .toggle")
		.unbind("click", handler)
		.bind("click", {"class" : "toggle-open", "type" : "toggle_related"}, handler);
	jQuery("#question-tabs .toggle")
		.unbind("click", handler)
		.bind("click", {"type" : "question_tabs", "class" : "toggle-open"}, handler);
	jQuery(".test-elements-list .toggle_for_element")
		.unbind("click", handler)
		.bind("click", {"type" : "element_list", "class" : "toggle-open toggle-white-open"}, handler);
	jQuery(".test-results-elements-list .toggle, .test-results-elements-list a.toggle-handle")
		.unbind("click", handler)
		.bind("click", {"type" : "result_list", "class" : "toggle-open toggle-white-open"}, handler);
	jQuery(".tests-list-top .toggle")
		.unbind("click", handler)
		.bind("click", {"type" : "my_tests_filter", "class" : "toggle-open toggle-extended-open"}, handler);
	jQuery(".test_owerview_2 .answers .toggle")
		.unbind("click", handler)
		.bind("click", {"type" : "test_result_list", "class" : "toggle-open"}, handler);
	jQuery(".absolute-toggle")
		.unbind("click", handler)
		.bind("click", {"type" : "absolute", "class" : "toggle-open"}, handler);
	jQuery(".expanded_evaluation a.toggle")
		.unbind("click", handler)
		.bind("click", {"type" : "evaluation", "class" : "toggle-open toggle-white-open"}, handler);
		
	jQuery(".test-questions-elements-list div.element a")
		.unbind("click", handler)
		.bind("click", {"type" : "questions_list", "class" : "toggle-open toggle-white-open"}, handler);
		
	jQuery(".test_owerview_2 .links a.expand")
		.unbind("click", handlerCorrect)
		.bind("click", handlerCorrect);
}

g2.toggle.prototype.toggleCorrect = function(event) {
	var nodes = jQuery(".test_owerview_2 .answers .wrong a.toggle");
	for (var i = 0; i < nodes.length; i++) {
		this.toggleElement(nodes[i], "test_result_list", "toggle-open toggle-extended-open")
	}
	var el = jQuery(event.target);
	el.html(
		el.attr(
			"toggle" + (el.html() == el.attr("toggleextendedlabel") ? "collapsed" : "extended") + "label"
		)
	);
}

g2.toggle.prototype.toggle = function(event) {
	this.toggleElement(event.target, event.data.type, event.data["class"])
}

g2.toggle.prototype.toggleElement = function(el, type, className) {
	el = jQuery(el);
	if (className === undefined) {
		className = "toggle-open";
	}
	var nodeContent = el.parent().find(".toggle-content");	
	if (type === "element_list") {
		nodeContent = el.parent().parent().next();
		el = el.parent().parent().find(".toggle-white");
	} else if (type === "question_tabs") {
		nodeContent = el.parent().next();
	} else if (type === "result_list") {
		el = el.parents("div.element").find("a.toggle")
		nodeContent = el.parent().next();
	} else if (type === "questions_list") {
		nodeContent = el.parents("div.element").next();
		el = el.parents("div.element").find("a.toggle");
	} else if (type === "my_tests_filter") {
		nodeContent = el.parent().parent().find(".toggle-content");
	} else if (type === "test_result") {
		nodeContent = el.parents("div.item").next();
		el = el.parents("div.item a.toggle");
	} else if (type === "test_result_list") {
		el = el.parents("div.item");
		nodeContent = el.next();
		el = el.find("a.toggle");
	} else if (type === "evaluation") {
		nodeContent = el.parents("div.expanded_evaluation").find(".expanded_evaluation_container");
	} else if (type === "toggle_related") {
		if (el.parent().hasClass("toggle_related_question")) {
			el.parent().find("*[related_question]").hide();
			nodeContent = el.parent().find("*[related_question=" + m2.instance('g2.testquestions').getActiveQuestionId() + "]");
		}
	}
	var show = !el.hasClass(className);	
	if (show) {
		el.addClass(className);
		if (el.attr("toggleextendedlabel")) {
			el.html(el.attr("toggleextendedlabel"));
		}
	} else {
		el.removeClass(className);
		if (el.attr("togglecollapsedlabel")) {
			el.html(el.attr("togglecollapsedlabel"));
		}
	}
	nodeContent.css("display", "block");
	this.layout(el);
	if (show) {		
		nodeContent.slideUp(0);
		nodeContent.slideDown();
	} else {
		nodeContent.slideDown(0);
		nodeContent.slideUp();		
	}
	var remember = el.attr("toggle_remember");
	if (remember) {
		var ids = this.remembered();
		var save = new Array();
		for (var i = 0; i < ids.length; i++) {
			if (ids[i] != remember) {
				save.push(ids[i]);
			}
		}
		if (show) {
			save.push(remember);
		}
		this.remembered(save);
	}	
}

g2.toggle.prototype.layout = function(node) {
	if (node.hasClass("absolute-toggle")) {
		var position = node.position();
		node.next().css(
			{position: 'absolute', left: position.left + "px", top: (position.top + 24) + "px", width : "auto"}
		);
	}
}

g2.countdown = function() {
	
	this.nodes = jQuery(".countdown");
	this.interval = null;
	if (this.nodes.length > 0) {
		this.interval = setInterval(jQuery.proxy(this.tick, this), 1000);
		this.tick();
		this.nodes.show();
	}
	
}

g2.countdown.prototype.tick = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		var node = jQuery(this.nodes[i]);
		var timeleft = node.attr("timeleft");
		if (timeleft > 0) {
			timeleft--;
		}
		node.attr("timeleft", timeleft);
		var parts = [Math.floor(timeleft / 60), timeleft % 60];
		for (var ii = 0; ii < parts.length; ii++) {
			if (parts[ii] < 10) {
				parts[ii] = "0" + parts[ii];
			}
		}
		node.find(".big-time").html(parts.join(":"));
		if (timeleft <= 0) {
			clearInterval(this.interval);
			var handler = node.attr("ontimerend");						
			if (handler) {				
				node.attr("ontimerend", "");
				eval(handler);				
			}
			var dialogTimeEnd = g2.dialog.instance("confirm-timeend-popup");
			if (dialogTimeEnd) {
				listener = {}
				dialogTimeEnd.node.parent().find("a.ui-dialog-titlebar-close").remove();
				listener.close = function() {
					document.location = g2.dialog.instance("confirm-timeend-popup").node.find("a").attr("href");
				}
				dialogTimeEnd.node.bind("dialogclose", listener.close)
			}
		}
	}
}

g2.testquestions = function() {
	
	this.queue = new Array();
	
	this.container = jQuery(".test-progress-controlls");
	
	if (this.container.length > 0) {
		this.flash = jQuery("#grotuvas_container embed, #grotuvas_container object").get(0);
		this.nodes = jQuery(".test-progress-controlls .list a");
		this.nodeStatus = jQuery(".test-progress-controlls .questions-controls span");		
		this.nodes.bind("click", jQuery.proxy(this.goToQuestion, this));
		
		this.nodePrevious = jQuery(".test-progress-controlls .questions-controls a.prev");
		this.nodeNext = jQuery(".test-progress-controlls .questions-controls a.next_first");
		this.nodeLast = jQuery(".test-progress-controlls .questions-controls a.next_last");
		
		this.nodePrevious.bind("click", {delta : -1}, jQuery.proxy(this.goToDelta, this));
		this.nodeNext.bind("click", {delta : 1}, jQuery.proxy(this.goToDelta, this));

		this.refresh();
	}
	
}

g2.testquestions.prototype.showResults = function() {
	var el = jQuery('#grotuvas_container embed, #grotuvas_container object').get(0);
	if (jQuery(jQuery(".check_repeat b").get(1)).css("display") === "none") {
		el.showResults();		
	} else {
		//this.setRepeatVisible(false);
		el.resetQuestion();		
	}
}

g2.testquestions.prototype.setRepeatVisible = function(show) {
	jQuery(".check_repeat b").hide();
	jQuery(jQuery(".check_repeat b").get(show ? 1 : 0)).show();
}

g2.testquestions.prototype.getPosition = function() {
	for (var i = 0; i < this.nodes.length; i++) {
		if (jQuery(this.nodes[i]).hasClass("active")) {
			return i;
		}
	}
	return 0;
}

g2.testquestions.prototype.getActiveQuestionId = function() {
	return jQuery(this.nodes[this.getPosition()]).attr("question");
}

g2.testquestions.prototype.solved = function(question_id) {
	jQuery(this.nodes).siblings("*[question=" + question_id + "]").addClass("finished");
}

g2.testquestions.prototype.queueAdd = function(question, question2) {
	var execute = this.queue.length == 0;
	this.queue.push(question);		
	if (question2) {
		this.queue.push(question2);
	}
	if (execute) {		
		this.queueProcess();
	}
}

g2.testquestions.prototype.queueProcess = function() {
	if (this.queue.length <= 0) {
		return false;
	}		
	var question = this.queue[0];
	if (question === null) {
		try {
			this.flash.saveResults();
		} catch (e) {}
	} else {		
		try {
			setCookie('__solve_question__', question);
			this.flash.getById(question);
		} catch (e) {}
		this.refresh();
		this.queueNext();
	}
}

g2.testquestions.prototype.queueNext = function() {	
	if (this.queue.length <= 0) {
		return false;
	}	
	this.queue.shift();
	this.queueProcess();
}

g2.testquestions.prototype.refresh = function() {
	this.nodes.hide();
	jQuery(".test-progress-controlls .list a.separator").remove();
	
	var around = [3, 8, 9, 3]
	var min = 26;
	var current = this.getPosition();
	var total = this.nodes.length;		
	var n = 0;
	var last = total - 1;
	
	if (min >= total) {	
		for (; n <= last; n++) {
			jQuery(this.nodes[n]).show();
		}		
	} else {
		last = Math.min(around[0] - 1, total - 1);
		for (; n <= last; n++) {
			jQuery(this.nodes[n]).show();
		}
		
		if (current > around[0] + around[1]) {
			n = Math.max(current - around[1], last);
		} else {
			n = last;
		}
		if (n > last) {
			jQuery(this.nodes[last]).after('<a class="separator">...</a>');
		}
		if (current > around[0] + around[1]) {
			last = Math.min(n + around[1], total - 1);
			if (current >= total - around[2] - around[3]) {
				n = Math.min(total - around[2] - around[3] - around[1] - 2, total - 1);
			}
		} else {
			last = Math.min(around[1] + around[0] + 1, total - 1);
		}
		for (; n <= last; n++) {
			jQuery(this.nodes[n]).show();
		}

		last = Math.min(n + around[2] - 1, total - 1);
		for (; n <= last; n++) {
			jQuery(this.nodes[n]).show();
		}
		
		n = total - around[3];
		if (n > last) {
			jQuery(this.nodes[last]).after('<a class="separator">...</a>');
		}
				
		last = total - 1;
		for (; n <= last; n++) {
			jQuery(this.nodes[n]).show();
		}
	}
	
	this.nodeStatus.html(jQuery(".test-progress-controlls .list a.finished").length + " / " + this.nodes.length);
	this.nodePrevious.css("display", current > 0 ? "" : "none");
	this.nodeNext.css("display", current < this.nodes.length - 1 ? "" : "none");
	this.nodeLast.css("display", current == this.nodes.length - 1 ? "" : "none");		
	//this.setRepeatVisible(false);
	this.resetRelated();
}

g2.testquestions.prototype.goToDelta = function(event) {
	this.go(this.getPosition() + event.data.delta);
}

g2.testquestions.prototype.goToQuestion = function(event) {
	this.nodes.removeClass("active");
	jQuery(event.target).addClass("active");
	this.go(this.getPosition());
}

g2.testquestions.prototype.finish = function() {
	this.save();	
	if (
		jQuery(".test-progress-controlls .list a[question]").length == 
		jQuery(".test-progress-controlls .list a.finished").length
	) {
		document.location = jQuery("#confirm-finish-popup a.uri_solved").attr("href");
	} else {
		g2.dialog.show('confirm-finish-popup');
	}
	return void(0);
}

g2.testquestions.prototype.save = function(next) {
	this.queueAdd(null, next);	
}

g2.testquestions.prototype.go = function(position) {
	if (position < 0) {
		position = this.nodes.length - 1;
	} else if (position >= this.nodes.length) {
		position = 0;
	}
	this.nodes.removeClass("active");
	var node = jQuery(this.nodes[position]);
	node.addClass("active");	
	this.save(Number(node.attr("question")));	
	this.resetRelated();
}

g2.testquestions.prototype.resetRelated = function() {
	var nodeRelated = jQuery(".toggle_related_question");
	if (nodeRelated.length > 0) {
		var nodeRelatedQuestion = nodeRelated.find("*[related_question=" + this.getActiveQuestionId() + "]");
		nodeRelated.css("display", nodeRelatedQuestion.length > 0 ? "" : "none");
		if (nodeRelatedQuestion.length > 0) {
			nodeRelated.find("*[related_question]").hide();
			nodeRelated.find("a.toggle").removeClass("toggle-open");
		}
	}
}

g2.testquestionsselected = function() {
	
	g2.testquestionsselected.instance = this;
	
	this.node = jQuery(".__testeditquestions_list_edit__");
	this.questions = {};
		
	this.reset();
}

g2.testquestionsselected.instance = null;

g2.testquestionsselected.prototype.reset = function() {
	var handleRemove = jQuery.proxy(this.remove, this);
	var handleRemoveAll = jQuery.proxy(this.removeAll, this);
	var handleAdd = jQuery.proxy(this.add, this);
	var handleAddAll = jQuery.proxy(this.addAll, this);
	var handlePreview = jQuery.proxy(this.preview, this);
	var handleReset = jQuery.proxy(this.reset, this);
	
	this.node.find("a[class!='prew']").unbind("click", handleRemove).bind("click", handleRemove);
	this.node.find("a.prew").unbind("click", handlePreview).bind("click", handlePreview);
	jQuery(".__testeditquestions_list_edit_remove__")
		.unbind("click", handleRemoveAll).bind("click", handleRemoveAll);
	jQuery(".__testeditquestions_list__").find("a[class!='prew']")
		.unbind("click", handleAdd).bind("click", handleAdd);	
	jQuery(".__testeditquestions_list__").find("a.prew")
		.unbind("click", handlePreview).bind("click", handlePreview);
	jQuery(".__testeditquestions_list_edit_add__")
		.unbind("click", handleAddAll).bind("click", handleAddAll);
	jQuery("input[name='complex_level']").unbind("change", handleReset).bind("change", handleReset);
	
	var nodes = jQuery(".__testeditquestions_list__ .questions-selction div[question]");	
	for (var i = 0; i < nodes.length; i++) {
		var node = jQuery(nodes[i]);
		var level = node.attr("level");
		var nodesAdded = this.node.find("div[question='" + node.attr("question") + "']"); 
		var nodesSpan = node.find("span");
		nodesSpan.parent().removeClass("inactive");
		if (nodesAdded.length > 0) {
			nodesSpan.parent().addClass("inactive");
		}
		nodesAdded.find("span").removeClass(level + "-inactive").addClass(level);		
	}
	nodes = this.node.find(".questions-selction div[question]");
	var values = new Array();
	for (var i = 0; i < nodes.length; i++) {
		var question = Number(jQuery(nodes[i]).attr("question"));
		values.push(question);
		this.questions[question] = true;
	}
	var total = this.node.find("div[question]").length;
	jQuery("#__testeditquestions_list_edit_values__").val(values.join(","));
	jQuery(".__testeditquestions_list_edit_remove__").next().find("b").html(total);
	
	var levels = ["easy", "medium", "hard"];
	for (var i = 0; i < levels.length; i++) {
		var level = levels[i];
		jQuery("#total_" + level).html(this.node.find("div[level='" + level + "']").length);
	}
		
	m2.instance("g2.slider").setMax(total);
	this.resetDifficultyOffer();
}

g2.testquestionsselected.prototype.resetDifficultyOffer = function() {
	var map = {"easy" : [0.4, 0.4, 0.2], "medium" : [0.3, 0.4, 0.3], "hard" : [0.2, 0.4, 0.4]};
	var parts = new Array();
	var targetLevel = "easy";
	var nodes = jQuery("input[name='complex_level']");
	if (nodes.length >= 3) {
		if (nodes.get(1).checked) {
			targetLevel = "medium";
		} else if (nodes.get(2).checked) {
			targetLevel = "hard";
		}
	}
	var targetsParts = [];
	var totalQuestions = jQuery("#slider-value").val();
	if (totalQuestions >= 10) {
		var totals = [Number(jQuery("#total_easy").html()), Number(jQuery("#total_medium").html()), Number(jQuery("#total_hard").html())];	
		var targets = map[targetLevel];		
		for (var i = 0; i < targets.length; i++) {			
			targets[i] = Math.round(totalQuestions * targets[i]) - totals[i];
			if (targets[i] != 0) {
				targetsParts.push(
					(targets[i] > 0 ? "pridėti" : "atimti") + " " + 
					" " + (i === 0 ? "lengvų" : (i === 1 ? "vidutinių" : "sunkių")) + " užduočių – " + 
					Math.abs(targets[i])
				);			
			}
		}
		if (targetsParts.length > 0) {
			parts.push(targetsParts.join(", "));
			jQuery("#__test_difficulty_offer__").html(parts.join(" "));
		}		
		var targetTitle = "lengvas";
		if (targetLevel === "medium") {
			targetTitle = "vidutinis";
		} else if (targetLevel === "hard") {
			targetTitle = "sunkus";
		}
		var nodeText = jQuery("#__test_difficulty_offer_text__");
		nodeText.html(nodeText.attr("alt").split("{$difficulty}").join(targetTitle));
		jQuery("#__test_difficulty_title__").html(targetTitle);
		jQuery(".__link_more__").hide()
		jQuery(".__link_more_" + targetLevel + "__").show();
	}
	jQuery("#__test_difficulty_offer_warning__").css("display", totalQuestions < 10 ? "" : "none");
	jQuery("#__test_difficulty_offer__").parent().css("display", targetsParts.length > 0 ? "" : "none");
	jQuery("#__test_difficulty_title__").parent().css("display", targetsParts <= 0 && totalQuestions >= 10 ? "" : "none");
}

g2.testquestionsselected.prototype.preview = function(event) {
	var node = jQuery(event.target).parents("div[question]");
	jQuery("#view-question-popup").attr("uri", node.attr("uri"));	
	g2.dialog.show("view-question-popup", true);
}

g2.testquestionsselected.prototype.addNode = function(node, no_reset) {
	node = jQuery(node);
	var question = Number(node.attr("question"));
	if (this.questions[question] === true) {
		return false;
	}
	this.questions[question] = true;
	node = node.clone();
	this.node.find(".questions-selction").append(node);
	node.prepend(node.find("a.arrow"));
	if (!no_reset) {
		this.reset();
	}
}

g2.testquestionsselected.prototype.add = function(event) {
	this.addNode(jQuery(event.target).parents("div[question]"));
}

g2.testquestionsselected.prototype.addAll = function(event) {
	var nodes = jQuery(".__testeditquestions_list__ .questions-selction div[question]");
	for (var i = 0; i < nodes.length; i++) {
		this.addNode(nodes[i], true);
	}
	this.reset();
}

g2.testquestionsselected.prototype.remove = function(event) {
	var node = jQuery(event.target).parents("div[question]");
	this.questions[Number(node.attr('question'))] = false;
	node.remove();	
	this.reset();
}

g2.testquestionsselected.prototype.removeAll = function(event) {	
	this.node.find(".questions-selction").children().remove();
	this.questions = {};
	this.reset();
}

g2.menutotals = function() {
	this.nodes = jQuery("ul.menu_tests li");
}

g2.menutotals.prototype.setTotal = function(n, value) {
	var node = jQuery(this.nodes[n]).find("span.center");
	var parts = node.html().split(" (", 2);
	node.html(parts[0] + (value > 0 ? " (" + value + ")" : ""));
}

g2.evaluation = function() {
	
	var nodes = jQuery("input.evaluation");
	if (nodes.length > 0) {
		var nodeList = jQuery("#theme_mos");
		this.prefix = nodeList.length > 0 ? nodeList.children("div.element").get(0).id.split('_')[1] : null;
		nodes.change(jQuery.proxy(this.changed, this));
		
		var values = this.values();
		for (var i in values) {
			var node = jQuery("#" + i.split("[").join("\\[").split("]").join("\\]") + "_" + values[i]);
			if (node.length > 0) {
				node.get(0).checked = true;
				this.changed({"target" : node.get(0)});
			}
		}
	}
	
}

g2.evaluation.prototype.changed = function(event) {

	var node = jQuery(event.target);
	this.values(node.attr("name"), node.val());
	var nodesRow = jQuery("#theme_mos").children("div.element");		
	var nodes = jQuery("input.evaluation[value=2],input.evaluation[value=3]");		
	var ids = {};
	for (var i = 0; i < nodes.length; i++) {
		node = jQuery(nodes[i]);
		if (!node.get(0).checked) {
			continue;
		}
		var mo_ids = node.attr("mo").split(",");
		for (var ii = 0; ii < mo_ids.length; ii++) {
			ids[mo_ids[ii]] = 1;
		}		
	}
	nodesRow.removeClass("active");	
	for (var iii in ids) {
		jQuery("#theme_mos").children("div[id*=_" + iii + "]").addClass("active");
	}
	nodes = jQuery(".evaluation_mo_links");
	nodes.hide();
	for (i = 0; i < nodes.length; i++) {
		node = jQuery(nodes[i]);		
		var inputs = node.parent().parent().find("input.evaluation[value=2],input.evaluation[value=3]");
		for (var ii = 0; ii < inputs.length; ii++) {
			if (inputs[ii].checked) {
				node.show();
				break;
			}
		}		
	}
}

g2.evaluation.prototype.values = function(name, value) {
	var cookie = '__evaluation__';
	var parts = getCookie(cookie);
	parts = parts ? parts.split(";") : new Array();
	var values = {};
	for (var i = 0; i < parts.length; i++) {
		var parts2 = parts[i].split('=');
		values[parts2[0]] = parts2[1] ? parts2[1] : null;
	}
	if (name !== undefined && value !== undefined) {
		values[name] = value;
	}
	parts = new Array();
	for (i in values) {
		parts.push(i + "=" + values[i]);
	}
	setCookie(cookie, parts.join(";"));
	return values;
}

g2.sliderinteractive = function() {
	this.container = jQuery(".slider_interactive");
	if (this.container.length > 1) {
		this.container = jQuery(this.container[0]);
	} else if (this.container.length < 1) {
		return false;
	}	
	this.nodeMask = this.container.find("div.holder");
	this.containerSlides = this.container.find("div.holder > div.line");
	this.nodesSlide = this.containerSlides.find("div.element");
	this.container.find(".next, .previous").click(jQuery.proxy(this.goToByHandle, this));
	this.position = 0;	
	this.slideWidth = null;	
	this.container.css("visibility", "");
	for (var i = 0; i < this.nodesSlide.length; i++) {
		var node = jQuery(this.nodesSlide[i]);
		if (this.slideWidth === null) {
			this.slideWidth = node.width() + 8 + parseInt(node.css("marginLeft"));
		}
		if (node.hasClass("active_grey")) {
			this.position = Math.max(0, i - Math.round(this.nodeMask.width() / this.slideWidth) + 1);			
			break;
		}
	}	
	this.width = this.nodesSlide.length * this.slideWidth;
	this.total = this.nodesSlide.length - Math.round(this.nodeMask.width() / this.slideWidth) + 1;
	this.goToSlide(this.position);
}

g2.sliderinteractive.prototype.goToByHandle = function(event) {
	var el = jQuery(event.target);
	if (!el.hasClass("control")) {
		el = el.parents(".control");
	}
	this.goToDelta(el.hasClass("next") ? 1 : -1);
}

g2.sliderinteractive.prototype.goToDelta = function(delta) {
	this.goToSlide(this.position + delta);
}

g2.sliderinteractive.prototype.goToSlide = function(position) {
	if (position < 0) {
		position = this.total - 1;
	} else if (position >= this.total) {
		position = 0;
	}
	this.containerSlides.animate(
		{left : -position * this.slideWidth}, {queue : true, duration : "fast", easing : "swing"}
	);
	this.position = position;
	this.container.find(".previous").css("display", position > 0 ? "" : "none");
	this.container.find(".next").css("display", position < this.total - 1 ? "" : "none");	
}

function saveResultsFeedback(value, question_id) {
	var instance = m2.instance("g2.testquestions");
	if (value === "correct" || value === "incorrect") {
		instance.solved(question_id);
	}
	instance.queueNext();
}

function setCookie(name, value, days) {
	if (name === "testQuestionAnswerL") {
		onQuestionChecked(value !== "incorrect");		
	}
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 3600000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + escape(value) + expires + "; path=/";
}

function sendEMail(options) {
	options.form_id = 'mail';
	jQuery.post(__uri_mail__, options);
}


function matrixInitialize() {
      jQuery('.matrix-cell').mouseenter(function(event) {
        matrixHighlight(event);
        event.preventDefault();
    });
    
      jQuery('#the_matrix_container').mouseleave(function(event) {
        matrixHighlightDisable(event);
        event.preventDefault();
    });
    
     jQuery('.matrix table .matrix-tooltip').mouseenter(function(event) {
        matrixShowTooltip(event, jQuery(this).attr('data-celluri'));
        event.preventDefault();
    });

     jQuery('.matrix table .matrix-tooltip.lab').mouseenter(function(event) {
        matrixHighlightDisable(event);
        event.preventDefault();
    });
    
}


Event.observe(window, 'load', g2.initialize);
