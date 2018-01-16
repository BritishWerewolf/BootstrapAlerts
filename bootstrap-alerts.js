// used as an alternative to jQuery's extend to keep this library independant.
// https://stackoverflow.com/a/11197343/3578036
function extend() {
    for (var i = 1; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}

// used as a fallback for older browsers
// https://stackoverflow.com/q/1744310/3578036
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
}

function BootstrapAlert(options) {
    options = typeof options == "undefined" ? {} : options;

    // default options
    let defaults = {
        dismissible: false, // whether the alert can be dismissed
        fadeIn: true, // this will cause the alert to fade in; requires CSS3 animations
        destroyAfter: 3000, // destory the alert after x milliseconds; 0 or below to prevent deleting
        max: 0, // the maximum number of alerts that can exist; 0 or below to ignore this setting
        maxId: "", // an indentifier to ensure only 'like' alerts are removed
        background: 'primary', // the default background colour
        classes: '' // any extra classes to include on the .alert
    };
    options = extend(defaults, options); // overwrite the defaults with the specified options
    
    let content = ''; // create the content functions

    this.isEmpty = function() {
        return content == '';
    }

    this.clear = function() {
        content = '';
    }

    this.setBackground = function(bg) {
        // check that background is a valid one
        let validBgs = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

        // if it is a number, then use the index on the above array; otherwise check if is in the above array
        if (Number.isInteger(bg) && bg >= 1 && bg <= validBgs.length) {
            bg = validBgs[bg - 1];
        } else {
            bg = validBgs.indexOf(bg) > -1 ? bg : defaults.background;
        }

        // finally, initialise it to the options.background
        options.background = bg;
    }
    this.setBg = this.setBackground;
    this.setBackground(options.background); // use this to also validate


    /** Use this to overwrite the content to just an HTML string. */
    this.setHTML = function(str) {
        content = str;
    }

    /** Use this to add some HTML to the content. */
    this.addHTML = function(str) {
        content += str;
    }

    /** Add a paragraph to the content. */
    this.addParagraph = function(str, classes) {
        classes = typeof classes == "undefined" ? "" : classes;

        content += '<p class="'+classes+'">'+str+'</p>';
    }
    this.addP = this.addParagraph;

    /** Add an anchor to the content. */
    this.addLink = function(text, href, classes, target, title) {
        str = '<a href="'+href+'" class="alert-link"';
        if (typeof target != 'undefined') str += ' class="'+classes+'"';
        if (typeof target != 'undefined') str += ' target="'+target+'"';
        if (typeof title != 'undefined') str += ' title="'+title+'"';
        str += '>'+text+'</a>';

        content += str;
    }
    this.addA = this.addLink;

    /** Works the same as addLink(), except this will wrap the anchor in a <p> tag. */
    this.addParaLink = function(text, href, classes, target, title) {
        content += '<p>';
        let r = this.addLink(text, href, target, title);
        content += '</p>';

        return '<p>'+r+'</p>';
    }
    this.addPA = this.addParaLink;

    /** Create a heading tag of a specified level. */
    this.addHeading = function(level, str, classes) {
        // only allow between 1 and 6 for the level
        if (level < 1)  level = 1;
        else if (level > 6) level = 6;
        // ensure it is a number; else default to level 1
        if (!Number.isInteger(level)) level = 1;

        content += '<h'+level+' class="alert-heading '+classes+'">'+str+'</h'+level+'>';
    }
    this.addH = this.addHeading;


    
    // render the final result
    this.render = function() {
        // set the class for the alert
        let classes = 'alert alert-'+options.background;
        
        if (options.dismissible) classes += ' alert-dismissible';
        
        if (options.classes != '' || typeof options.classes != 'undefined') {
            if (typeof options.classes == "string") {
                classes += ' ' + options.classes;
            } else if (options.classes instanceof Array) {
                for (var i = 0; i < options.classes.length; i++) {
                    classes += ' ' + options.classes[i];
                }
            } else if (options.classes instanceof Object) {
                for (var cls in options.classes) {
                    classes += ' ' + cls;
                }
            }
        }

        // generate a random ID for this alert
        let id = "";
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 8; i++) id += possible.charAt(Math.floor(Math.random() * possible.length));
        
        if (options.fadeIn) {
            classes += ' fade';
            
            // time out just to give the element time to appear on the page and then fade it in
            setTimeout(function() {
                $('#'+id).addClass("show");
            }, 100);
        }
        
        // basics that all alerts have
        let html = '<div id="'+id+'" class="'+classes+'" role="alert"';
        
        // set up the max destroyer for alerts
        if (options.max > 0 && options.maxId != '') {
            html += ' data-max-id="'+options.maxId+'" data-max-count="'+options.max+'"';
            
            // if there are too many of that alert ID existing then delete one
            // the chosen one to delete is the one at the highest point in the DOM
            // meaning the closest one to the <head> element
            // ideally, this would be the 'oldest' created element
            if ($('.alert[data-max-id]').length >= options.max) {
                $('.alert[data-max-id]')[0].remove();
            }
        }

        html += '>'; // finish off with the closing angled bracket

        // self explanatory if statement
        if (options.dismissible) {
            html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                 +      '<span aria-hidden="true">&times;</span>'
                 +  '</button>';
        }

        html += content;
        html += '</div>';

        // create a timeout to destroy the alert
        if (options.dismissible && options.destroyAfter > 0) {
            setTimeout(function() {
                $('#'+id).fadeOut(400, function() {
                    $(this).remove();
                });
            }, options.destroyAfter);
        }
        
        // parse the HTML string
        let el = document.createElement('div');
        el.innerHTML = html;
        el = el.children[0]; // remove the parent node, extracting the alert only

        return el;
    }
}
