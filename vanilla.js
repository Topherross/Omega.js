/**
 * Created by chrisr on 3/4/15.
 */
(function(){
    'use strict';

    var Vanilla = {};

    Vanilla.ready = function(callback){
        if(document.readyState === "complete"){
            if(typeof callback === "function")
                callback();
        }else{
            if(document.addEventListener){
                try{
                    document.addEventListener("DOMContentLoaded", function(){
                        if(typeof callback === "function")
                            callback();
                    }, false);
                }catch(e){
                    window.addEventListener("load", function(){
                        if(typeof callback === "function")
                            callback();
                    }, false);
                }
            }else if(document.attachEvent){
                try{
                    document.attachEvent("onreadystatechange", function(){
                        if(typeof callback === "function")
                            callback();
                    });
                }catch(e){
                    window.attachEvent("onload", function(){
                        if(typeof callback === "function")
                            callback();
                    });
                }
            }
        }
    };

    Vanilla.createEl = function(type, attrs, text, html){
        var el = document.createElement(type);
        if(typeof attrs !== "undefined")
            Vanilla.setAttributes(el, attrs);

        if(typeof text !== "undefined" && !!text) {
            if (typeof html !== "undefined" && !!html)
                Vanilla.setText(el, text, true);
            else
                Vanilla.setText(el, text);
        }

        return el;
    };

    Vanilla.setAttributes = function(el, attrs){
        for(var attr in attrs){
            if(Object.prototype.hasOwnProperty.call(attrs, attr))
                el.setAttribute(attr, attrs[attr]);
        }

        return false;
    };

    Vanilla.hasClass = function(obj, klass){
        var class_list = obj.getAttribute('class').split(' ');

        if(typeof class_list !== "undefined") {
            for (var class_name in class_list) {
                if (Object.prototype.hasOwnProperty.call(class_list, class_name) && class_list[class_name] == klass) {
                    return true;
                }
            }
        }

        return false;
    };

    Vanilla.removeClass = function(obj, klass){
        var class_list = obj.getAttribute('class').split(' ');

        for(var class_name in class_list){
            if(Object.prototype.hasOwnProperty.call(class_list, class_name) && class_list[class_name] == klass){
                class_list.splice(class_name, 1);
                obj.setAttribute('class', class_list.join(' '));
                break;
            }
        }

        return false;
    };

    Vanilla.addClass = function(obj, klass){
        var class_list = obj.getAttribute('class').split(' ');

        if(!Vanilla.hasClass(obj, klass)) {
            class_list.push(klass);
            obj.setAttribute('class', class_list.join(' '));
        }

        return false;
    };

    Vanilla.batchRemoveClass = function(objs, klass){
        for(var obj in objs){
            if(Object.prototype.hasOwnProperty.call(objs, obj) && obj != 'length' && obj != 'item' && objs[obj].hasAttribute('class'))
                Vanilla.removeClass(objs[obj], klass);
        }
        return false;
    };

    Vanilla.event = function(el, event, func, bubbles){
        var _bubbles = (typeof bubbles !== "undefined" && (!!bubbles || !bubbles))? bubbles : false;

        if(document.addEventListener){
            el.addEventListener(event, function(e){func(e);}, _bubbles);
        }else{
            el.attachEvent("on"+event, function(e){func(e)});
        }
    };

    Vanilla.stop = function(event){
        if(event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true;
    };

    Vanilla.setText = function(el, text, html){
        if(typeof html !== "undefined" && html === true)
            el.innerHTML = text;
        else if(document.all)
            el.innerText = text;
        else
            el.textContent = text;

        return false;
    };

    Vanilla.getText = function(el){
        return (document.all)? el.innerText : el.textContent;
    };

    Vanilla.ajax = function(action, configs){
        if(typeof action === "undefined" || action === null || !action)
            return false;

        var options = {
            method : configs.method || "GET",
            async : configs.async || true,
            data : configs.data || null,
            beforeSend : configs.beforeSend || false,
            onSuccess : configs.onSuccess || false,
            onFailure : configs.onFailure || false,
            onComplete : configs.onComplete || false,
            json : configs.json || false
        };

        if(typeof options.beforeSend === "function")
            options.beforeSend();

        var request = new XMLHttpRequest();

        request.onreadystatechange = function(){
            if(request.readyState == 4){
                if(request.status == 200){
                    if(typeof options.onSuccess === "function")
                        options.onSuccess(request);
                }

                if(request.status >= 400 && request.status < 600){
                    if(typeof options.onFailure === "function")
                        options.onFailure(request);
                }

                if(typeof options.onComplete === "function")
                    options.onComplete();
            }
        };

        request.open(options.method, action, options.async);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if(!!options.json)
            request.setRequestHeader('Content-Type', 'application/json');

        if(options.method == "POST" && !options.json)
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.send(options.data);

        return request;
    };

    Vanilla.serialize = function(form){
            if(form.tagName.toLowerCase() !== "form")
                return false;

            var data = [];
            for(var i = 0; i < form.elements.length; i++){
                if(typeof form.elements[i].type !== "undefined" &&
                    (form.elements[i].type.toLowerCase() === "submit" ||
                    form.elements[i].type.toLowerCase() === "reset"))
                    continue;
                else
                    data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value)));
                console.log(form.elements[i].name + ': ' + form.elements[i].value);
            }

            return data.join('&');
        };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Vanilla;
    } else {
        window.Vanilla = Vanilla;
    }
})();

/**
 * Cookies
 * */

(function(window, document){
    "use strict";

    var Cookies;

    Cookies = (function(window, document){
        function Cookies(){
            if(typeof this === "undefined")
                return;

            this.getCookies();
        }

        Cookies.prototype.getCookies = function(){
            this.cookies = document.cookie.trim().split(';').reduce(function(ret, param){
                var parts = param.trim().split('='),
                    key = decodeURIComponent(parts[0]),
                    val = parts[1] === undefined ? null : decodeURIComponent(parts[1]);

                if(!ret.hasOwnProperty(key))
                    ret[key] = val;
                else if(Array.isArray(ret[key]))
                    ret[key].push(val);
                else
                    ret[key] = val;

                return ret;
            }, {});

            return this.cookies;
        };

        Cookies.prototype.hasCookie = function(name){
            if(typeof name === "undefined")
                return false;

            var cookies = this.getCookies();

            return cookies.hasOwnProperty(name);
        };

        Cookies.prototype.set = function(name, value, options){
            if(typeof name === "undefined")
                return false;

            value = (typeof value === "undefined" || value === null) ? '' : value;
            options = (typeof options === "undefined") ? -1 : options;

            var params = {
                path : options.path || false,
                domain : options.domain || false,
                expires : (options === -1) ? -1 : options.expires || (1000*60*60*24*3),
                secure : options.secure || false,
                json : options.json || false
            };

            if (value == '')
                params.expires = -1;

            var expires = '';
            if (params.expires && params.expires !== -1) {
                switch (params.expires.constructor) {
                    case Number:
                        var date = new Date();
                        expires = params.expires === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + date.setTime(date.getTime() + params.expires);
                        break;
                    case String:
                        expires = "; expires=" + params.expires;
                        break;
                    case Date:
                        expires = "; expires=" + params.expires.toUTCString();
                        break;
                }
            }else if(params.expires === -1){
                expires = "; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            }

            if(!!options.json){
                try{
                    var _value = JSON.parse(this.cookies[name]);
                    if(typeof _value === "string" && _value !== null)
                        value = encodeURIComponent(_value);
                }catch(e){}
            }else{
                encodeURIComponent(value);
            }

            var path = params.path ? '; path=' + (options.path) : '; path=/',
                domain = params.domain ? '; domain=' + (options.domain) : '',
                secure = params.secure ? '; secure' : '';console.log([name, '=', value, expires, path, domain, secure, ';'].join(''));

            document.cookie = [name, '=', value, expires, path, domain, secure, ';'].join('');

            return false;
        };

        Cookies.prototype.get = function(name, json){
            if(typeof name === "undefined" || !this.hasCookie(name))
                return false;

            var cookie;

            if(!!json){
                try{
                    var _cookie = JSON.parse(this.cookies[name]);
                    if(typeof _cookie === "object" && _cookie !== null)
                        cookie = _cookie;
                }catch(e){}
            }

            return typeof cookie === "undefined" ? this.cookies[name] : cookie;
        };

        Cookies.prototype.remove = function(name){
            if(typeof name === "undefined" || !this.hasCookie(name))
                return false;

            this.set(name);

            return false;
        };

        return Cookies;
    })(window, document);

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Cookies;
    } else {
        window.Cookies = Cookies;
    }
})(window, document);