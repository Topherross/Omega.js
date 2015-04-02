/**
 * Created by chrisr on 3/4/15.
 */
(function () {
    'use strict';

    var Vanilla = {},
        $modal = null;

    Vanilla.ready = function (callback) {
        if (document.readyState === "complete") {
            if (typeof callback === "function")
                callback();
        } else {
            if (document.addEventListener) {
                try {
                    document.addEventListener("DOMContentLoaded", function () {
                        if (typeof callback === "function")
                            callback();
                    }, false);
                } catch (e) {
                    window.addEventListener("load", function () {
                        if (typeof callback === "function")
                            callback();
                    }, false);
                }
            } else if (document.attachEvent) {
                try {
                    document.attachEvent("onreadystatechange", function () {
                        if (typeof callback === "function")
                            callback();
                    });
                } catch (e) {
                    window.attachEvent("onload", function () {
                        if (typeof callback === "function")
                            callback();
                    });
                }
            }
        }
    };

    Vanilla.createEl = function (type, attrs, text, html) {
        var el = document.createElement(type);
        if (typeof attrs !== "undefined")
            Vanilla.setAttributes(el, attrs);

        if (typeof text !== "undefined" && !!text) {
            if (typeof html !== "undefined" && !!html)
                Vanilla.setText(el, text, true);
            else
                Vanilla.setText(el, text);
        }

        return el;
    };

    Vanilla.setAttributes = function (el, attrs) {
        for (var attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr))
                el.setAttribute(attr, attrs[attr]);
        }

        return false;
    };

    Vanilla.hasClass = function (obj, klass) {
        var class_list = obj.getAttribute('class').split(' ');

        if (typeof class_list !== "undefined") {
            for (var class_name in class_list) {
                if (Object.prototype.hasOwnProperty.call(class_list, class_name) && class_list[class_name] == klass) {
                    return true;
                }
            }
        }

        return false;
    };

    Vanilla.removeClass = function (obj, klass) {
        var class_list = obj.getAttribute('class').split(' ');

        for (var class_name in class_list) {
            if (Object.prototype.hasOwnProperty.call(class_list, class_name) && class_list[class_name] == klass) {
                class_list.splice(class_name, 1);
                obj.setAttribute('class', class_list.join(' '));
                break;
            }
        }

        return false;
    };

    Vanilla.addClass = function (obj, klass) {
        var class_list = obj.getAttribute('class').split(' ');

        if (!Vanilla.hasClass(obj, klass)) {
            class_list.push(klass);
            obj.setAttribute('class', class_list.join(' '));
        }

        return false;
    };

    Vanilla.toggleClass = function (obj, klass) {
        if (Vanilla.hasClass(obj, klass)) {
            Vanilla.removeClass(obj, klass);
        }else{
           Vanilla.addClass(obj, klass);
        }

        return false;
    };

    Vanilla.batchRemoveClass = function (objs, klass) {
        for (var obj in objs) {
            if (Object.prototype.hasOwnProperty.call(objs, obj) && obj != 'length' && obj != 'item' && objs[obj].hasAttribute('class'))
                Vanilla.removeClass(objs[obj], klass);
        }
        return false;
    };

    Vanilla.event = function (el, event, func, bubbles) {
        var _bubbles = (typeof bubbles !== "undefined" && (!!bubbles || !bubbles)) ? bubbles : false;

        if (document.addEventListener) {
            el.addEventListener(event, function (e) {
                func(e);
            }, _bubbles);
        } else {
            el.attachEvent("on" + event, function (e) {
                func(e)
            });
        }
    };

    Vanilla.stop = function (event) {
        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true;
    };

    Vanilla.setText = function (el, text, html) {
        if (typeof html !== "undefined" && html === true)
            el.innerHTML = text;
        else if (document.all)
            el.innerText = text;
        else
            el.textContent = text;

        return false;
    };

    Vanilla.getText = function (el) {
        return (document.all) ? el.innerText : el.textContent;
    };

    Vanilla.getUrlParams = function(){
        var params = {},
            search = window.location.search;

        if(!!(/^\?/.test(search))){
            var param_array = search.split('?')[1].split('&');

            for(var i = 0; i < param_array.length; i++){
                var _params = param_array[i].split('=');
                params[_params[0]] = _params[1];
            }
        }

        return params;
    };

    Vanilla.stringifyUrlParams = function(obj){
        var params = [];

        for(var key in obj){
            if(Object.prototype.hasOwnProperty.call(obj, key) && key !== 'length')
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }

        return params.join('&');
    };

    Vanilla.setUrlParam = function(param, value, allow_reload){
        var params = Vanilla.getUrlParams();

        params[param] = value;

        if(window.history.pushState)
            window.history.pushState({}, "", window.location.pathname + '?' + Vanilla.stringifyUrlParams(params));
        else if(typeof allow_reload !== "undefined" && !!allow_reload)
            window.location.search = Vanilla.stringifyUrlParams(params);

        return params;
    };

    Vanilla.removeUrlParam = function(param, allow_reload){
        var params = Vanilla.getUrlParams(),
            param_string;

        if(Object.prototype.hasOwnProperty.call(params, param))
            delete params[param];

        param_string = Vanilla.stringifyUrlParams(params);

        if(window.history.pushState && param_string === "")
            window.history.pushState({}, "", window.location.pathname);
        else if(window.history.pushState && param_string !== "")
            window.history.pushState({}, "", window.location.pathname + '?' + param_string);
        else if(typeof allow_reload !== "undefined" && !!allow_reload)
            window.location.search = param_string;

        return params;
    };

    Vanilla.modal = function(){
        if ($modal !== null)
            return $modal;

        $modal = {};

        var modal_wrap = Vanilla.createEl('div', {'id' : 'vanilla_modal_wrap', 'style' : 'display:none;'}),
            modal_window = Vanilla.createEl('div', {'id' : 'vanilla_modal_window'}),
            modal_header = Vanilla.createEl('h1', {'id' : 'vanilla_modal_header'}),
            modal_closer = Vanilla.createEl('div', {'id' : 'vanilla_modal_closer'}),
            modal_content = Vanilla.createEl('div', {'id' : 'vanilla_modal_content'});

        modal_window.appendChild(modal_header);
        modal_window.appendChild(modal_closer);
        modal_window.appendChild(modal_content);
        modal_wrap.appendChild(modal_window);

        $modal.addedToDOM = false;

        $modal.updateHeader = function(text, html){
            if(typeof html !== "undefined" && !!html)
                Vanilla.setText(modal_header, text, html);
            else
                Vanilla.setText(modal_header, text);

            return $modal;
        };

        $modal.updateContent = function(text, html){
            if(typeof html !== "undefined" && !!html)
                Vanilla.setText(modal_content, text, html);
            else
                Vanilla.setText(modal_content, text);

            return $modal;
        };

        $modal.show = function(){
            if(!$modal.addedToDOM){
                document.body.appendChild(modal_wrap);
                $modal.addedToDOM = true;
            }

            Object(modal_wrap).style.display = "block";

            return $modal;
        };

        $modal.hide = function(){
            if(!!$modal.addedToDOM)
                Object(modal_wrap).style.display = "none";

            return $modal;
        };

        $modal.destroy = function(){
            document.body.removeChild(modal_wrap);
            $modal = null;
        };

        document.body.appendChild(modal_wrap);
        $modal.addedToDOM = true;

        return $modal;
    };

    Vanilla.ajax = function (action, configs) {
        if (typeof action === "undefined" || action === null || !action)
            return false;

        var methods = /^(get|post|head|put|delete|options)$/i,
            options = {
                method: configs.method || "GET",
                async: configs.async || true,
                data: configs.data || null,
                beforeSend: configs.beforeSend || false,
                onSuccess: configs.onSuccess || false,
                onFailure: configs.onFailure || false,
                onComplete: configs.onComplete || false,
                json: configs.json || false,
                user: configs.user || false,
                pass: configs.pass || false
            };

        if(!methods.test(options.method))
            options.method = "GET";

        if (typeof options.beforeSend === "function")
            options.beforeSend();

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    if (typeof options.onSuccess === "function")
                        options.onSuccess(request);
                }

                if (request.status >= 400 && request.status < 600) {
                    if (typeof options.onFailure === "function")
                        options.onFailure(request);
                }

                if (typeof options.onComplete === "function")
                    options.onComplete();
            }
        };

        if (!!options.user && !!options.pass)
            request.open(options.method, action, options.async, options.user, options.pass);
        else
            request.open(options.method, action, options.async);

        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (!!options.json)
            request.setRequestHeader('Content-Type', 'application/json');

        if (options.method == "POST" && !options.json)
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.send(options.data);

        return request;
    };

    Vanilla.serialize = function (form) {
        if (form.tagName.toLowerCase() !== "form")
            return false;

        var data_object = {},
            data = [];

        for (var i = 0; i < form.elements.length; i++) {
            var type = form.elements[i].type.toLowerCase();

            if(typeof form.elements[i].type === "undefined" ||
                (type === "submit" || type === "reset" || type === "button"))
                continue;

            if ((type === "radio" || type === "checkbox")) {
                if(!form.elements[i].checked)
                    continue;

                if(Object.prototype.hasOwnProperty.call(data_object, form.elements[i].name)){
                    if(!(data_object[form.elements[i].name] instanceof Array)){
                        var curr_value = data_object[form.elements[i].name];
                        data_object[form.elements[i].name] = [];
                        data_object[form.elements[i].name].push(curr_value);
                    }
                    data_object[form.elements[i].name].push(encodeURIComponent(form.elements[i].value));
                }else{
                   data_object[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                }
            }else if (type === "select-multiple") {
                data_object[form.elements[i].name] = [];
                for(var selection = 0; selection < form.elements[i].children.length; selection++){
                    if(form.elements[i].children[selection].selected)
                        data_object[form.elements[i].name].push(encodeURIComponent(form.elements[i].children[selection].value));
                }
            }else{
                if(form.elements[i].value == "")
                    continue;

                data_object[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
            }
        }

        for(var el in data_object){
            if(Object.prototype.hasOwnProperty.call(data_object, el) && el !== 'length'){
                if(!!(data_object[el] instanceof Array)){
                    for(var index = 0; index < data_object[el].length; index++){
                        data.push((el + '[' + index + ']=' + data_object[el][index]));
                    }
                }else{
                    data.push((el + '=' + data_object[el]));
                }
            }
        }

        return data.join('&');
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Vanilla;
    } else {
        window.Vanilla = Vanilla;
    }
})();
