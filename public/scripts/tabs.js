if (typeof(Prototype) == "undefined") {
    throw "Control.Tabs requires Prototype to be loaded.";
}


var Tabs = Class.create({

    links: [],
    options: {
        linkSelector: 'li a',
        activeClassName: 'active',
        addClassFirst : false,
        addClassLast : false
    },

    initialize: function(tab_list_container, options) {
        if(!$(tab_list_container)) {
            throw "Control.Tabs could not find the element: " + tab_list_container;
        }

        Object.extend(this.options, options || {});
        this.observeTabs(tab_list_container);
        this.setActiveVisible(true);
    },


    observeTabs: function(list_container) {
        var tabs = $(list_container).select(this.options.linkSelector);
        
        tabs.each(function (link){        	
            this.addTab(link);
        }.bind(this));
        
        if (tabs.length > 0) {
	        if (this.options.addClassFirst) {
	        	tabs[0].addClassName("first");
	        }
	        if (this.options.addClassLast) {
	        	tabs[tabs.length - 1].addClassName("last");
	        }
        } else if (this.options.tabsContainer) {
        	$(this.options.tabsContainer).hide();
        }
    },


    addTab: function(link) {
    	if (link.href.indexOf("#") === -1) {
    		return false;
    	}
        if (this.links.size() > 0) {
            this.hide(link);
        }

        this.links.push(link);

        link.observe('click', function(event) {
            Event.stop(event);
			if (link.hasClassName(this.options.activeClassName)){
				this.setActiveVisible(false);
			}
			else{
				this.setActiveTab(link);
			}
            return false;
        }.bindAsEventListener(this));
    },
    
    setActiveVisible: function(visible) {
    	var tab = this.links[this.getActiveTab()];
    	if (visible) {
    		this.show(tab);
    	} else {
    		this.hide(tab);
    	}    	
    },
    
    getActiveTab: function() {
    	var l = this.links.length;
    	for (var i = 0; i < l; i++) {
    		if (this.links[i].hasClassName(this.options.activeClassName)) {
    			return i;
    		}
    	}
    	return 0;
    },
    
    setActiveTab: function(link) {
        this.setActiveVisible(false);
        this.show(link);
    },

    show: function(link) {
    	if (!link) {
    		return false;
    	}
        var target = this.getTargetContainer(link.href);
        if ($(target)) {
            $(target).show();
            link.addClassName(this.options.activeClassName);
            $(target).parentNode.show();
        }
    },

    hide: function(link) {
    	if (!link) {
    		return false;
    	}
        var target = (this.getTargetContainer(link.href));
        if ($(target)) {
            $(target).hide();
            link.removeClassName(this.options.activeClassName);
            $($(target).parentNode).hide();
        }
    },
    
    getTargetContainer: function(href) {
        return href.split('#')[1];
    }
});