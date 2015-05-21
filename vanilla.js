/**
 * Created by chrisr on 3/4/15.
 */
(function () {
    'use strict';

    var Vanilla = {},
        $modal = null;

    /**
     *
     * @param callback
     * @returns {boolean}
     */
    Vanilla.ready = function (callback) {
        if (typeof callback === "function") {
            if (document.readyState === "complete") {
                callback();
            } else {
                if (document.addEventListener) {
                    try {
                        document.addEventListener("DOMContentLoaded", callback, false);
                    } catch (e) {
                        window.addEventListener("load", callback, false);
                    }
                } else if (document.attachEvent) {
                    try {
                        document.attachEvent("onreadystatechange", callback);
                    } catch (e) {
                        window.attachEvent("onload", callback);
                    }
                }
            }
        }

        return false;
    };

    /**
     *
     * @param type
     * @param attrs
     * @param text
     * @param html
     * @returns {HTMLElement}
     */
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

    /**
     *
     * @param el
     * @param attrs
     * @returns {boolean}
     */
    Vanilla.setAttributes = function (el, attrs) {
        for (var attr in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, attr))
                el.setAttribute(attr, attrs[attr]);
        }

        return false;
    };

    /**
     *
     * @param obj
     * @param klass
     * @returns {boolean}
     */
    Vanilla.hasClass = function (obj, klass) {
        if (!obj.hasAttribute('class'))
            return false;

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

    /**
     *
     * @param obj
     * @param klass
     * @returns {boolean}
     */
    Vanilla.removeClass = function (obj, klass) {
        if (!obj.hasAttribute('class'))
            return false;

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

    /**
     *
     * @param obj
     * @param klass
     * @returns {boolean}
     */
    Vanilla.addClass = function (obj, klass) {
        var class_list = (obj.hasAttribute('class')) ? obj.getAttribute('class').split(' ') : [];

        if (!Vanilla.hasClass(obj, klass)) {
            class_list.push(klass);
            obj.setAttribute('class', class_list.join(' '));
        }

        return false;
    };

    /**
     *
     * @param obj
     * @param klass
     * @returns {boolean}
     */
    Vanilla.toggleClass = function (obj, klass) {
        if (Vanilla.hasClass(obj, klass))
            Vanilla.removeClass(obj, klass);
        else
            Vanilla.addClass(obj, klass);

        return false;
    };

    /**
     *
     * @param objs
     * @param klass
     * @returns {boolean}
     */
    Vanilla.batchRemoveClass = function (objs, klass) {
        for (var obj in objs) {
            if (Object.prototype.hasOwnProperty.call(objs, obj) &&
                obj != 'length' &&
                obj != 'item' &&
                objs[obj].hasAttribute('class'))
                Vanilla.removeClass(objs[obj], klass);
        }

        return false;
    };

    /**
     *
     * @param el
     * @param event
     * @param func
     * @param bubbles
     * @returns {boolean}
     */
    Vanilla.event = function (el, event, func, bubbles) {
        var _bubbles = (typeof bubbles !== "undefined" && (!!bubbles || !bubbles)) ? bubbles : false;

        if (document.addEventListener)
            el.addEventListener(event, function (e) {
                func(e);
            }, _bubbles);
        else if (document.attachEvent)
            el.attachEvent("on" + event, function (e) {
                func(e)
            });
        else
            el["on" + event] = null;

        return false;
    };

    /**
     *
     * @param el
     * @param event
     * @param func
     * @param bubbles
     * @returns {boolean}
     */
    Vanilla.remove = function (el, event, func, bubbles) {
        var _bubbles = (typeof bubbles !== "undefined" && (!!bubbles || !bubbles)) ? bubbles : false;

        if (document.removeEventListener)
            el.removeEventListener(event, function (e) {
                func(e);
            }, _bubbles);
        else if (document.detachEvent)
            el.detachEvent("on" + event, function (e) {
                func(e)
            });
        else
            el["on" + event] = null;

        return false;
    };

    /**
     *
     * @param event
     * @returns {boolean}
     */
    Vanilla.stop = function (event) {
        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true;

        return false;
    };

    /**
     *
     * @param el
     * @param text
     * @param html
     * @returns {boolean}
     */
    Vanilla.setText = function (el, text, html) {
        if (typeof html !== "undefined" && html === true)
            el.innerHTML = text;
        else if (document.all)
            el.innerText = text;
        else
            el.textContent = text;

        return false;
    };

    /**
     *
     * @param el
     * @returns {string|*}
     */
    Vanilla.getText = function (el) {
        return (document.all) ? el.innerText : el.textContent;
    };

    /**
     *
     * @returns {object}
     */
    Vanilla.getUrlParams = function () {
        var params = {},
            search = window.location.search;

        if (!!(/^\?/.test(search))) {
            var param_array = search.split('?')[1].split('&');

            for (var i = 0; i < param_array.length; i++) {
                var _params = param_array[i].split('=');
                params[_params[0]] = _params[1];
            }
        }

        return params;
    };

    /**
     *
     * @param obj
     * @returns {string}
     */
    Vanilla.stringifyUrlParams = function (obj) {
        var params = [];

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && key !== 'length')
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }

        return params.join('&');
    };

    /**
     *
     * @param param
     * @param value
     * @param allow_reload
     * @returns {object}
     */
    Vanilla.setUrlParam = function (param, value, allow_reload) {
        var params = Vanilla.getUrlParams();

        params[param] = value;

        if (window.history.pushState)
            window.history.pushState({}, "", window.location.pathname + '?' + Vanilla.stringifyUrlParams(params));
        else if (typeof allow_reload !== "undefined" && !!allow_reload)
            window.location.search = Vanilla.stringifyUrlParams(params);

        return params;
    };

    /**
     *
     * @param param
     * @param allow_reload
     * @returns {object}
     */
    Vanilla.removeUrlParam = function (param, allow_reload) {
        var params = Vanilla.getUrlParams(),
            param_string;

        if (Object.prototype.hasOwnProperty.call(params, param))
            delete params[param];

        param_string = Vanilla.stringifyUrlParams(params);

        if (window.history.pushState && param_string === "")
            window.history.pushState({}, "", window.location.pathname);
        else if (window.history.pushState && param_string !== "")
            window.history.pushState({}, "", window.location.pathname + '?' + param_string);
        else if (typeof allow_reload !== "undefined" && !!allow_reload)
            window.location.search = param_string;

        return params;
    };

    /**
     *
     * @param options
     * @returns {object}
     */
    Vanilla.modal = function (options) {
        if ($modal !== null)
            return $modal;

        $modal = {};
        options = (typeof options === "undefined") ? {} : options;

        var configs = {
                showCallback: options.showCallback || false,
                hideCallback: options.hideCallback || false
            },
            modal_wrap = Vanilla.createEl('div', {'id': 'vanilla_modal_wrap', 'style': 'display:none;'}),
            modal_window = Vanilla.createEl('div', {'id': 'vanilla_modal_window'}),
            modal_header = Vanilla.createEl('h1', {'id': 'vanilla_modal_header'}),
            modal_closer = Vanilla.createEl('div', {'id': 'vanilla_modal_closer'}),
            modal_content = Vanilla.createEl('div', {'id': 'vanilla_modal_content'});

        modal_window.appendChild(modal_header);
        modal_window.appendChild(modal_closer);
        modal_window.appendChild(modal_content);
        modal_wrap.appendChild(modal_window);

        $modal.addedToDOM = false;
        $modal.visible = false;

        $modal.updateHeader = function (text, html) {
            if (typeof html !== "undefined" && !!html)
                Vanilla.setText(modal_header, text, html);
            else
                Vanilla.setText(modal_header, text);

            return $modal;
        };

        $modal.updateContent = function (text, html) {
            if (typeof html !== "undefined" && !!html)
                Vanilla.setText(modal_content, text, html);
            else
                Vanilla.setText(modal_content, text);

            return $modal;
        };

        $modal.updateClass = function (klass) {
            if (typeof klass === "string")
                modal_window.setAttribute('class', klass);

            return $modal;
        };

        $modal.show = function (callback) {
            if (!$modal.addedToDOM) {
                document.body.appendChild(modal_wrap);
                $modal.addedToDOM = true;
            }

            Object(modal_wrap).style.display = "block";
            $modal.visible = true;

            if (typeof callback === "function")
                callback();
            else if (typeof configs.showCallback === "function")
                configs.showCallback();

            return $modal;
        };

        $modal.hide = function (callback) {
            if (!!$modal.addedToDOM) {
                Object(modal_wrap).style.display = "none";
                $modal.visible = false;
            }

            if (typeof callback === "function")
                callback();
            else if (typeof configs.hideCallback === "function")
                configs.hideCallback();

            return $modal;
        };

        $modal.destroy = function () {
            document.body.removeChild(modal_wrap);
            $modal = null;
        };

        Vanilla.event(modal_closer, 'click', function () {
            $modal.hide();
        }, false);

        document.body.appendChild(modal_wrap);
        $modal.addedToDOM = true;

        return $modal;
    };

    /**
     *
     * @param action
     * @param configs
     * @returns {XMLHttpRequest}
     */
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

        if (!methods.test(options.method))
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

    /**
     *
     * @param form
     * @returns {string}
     */
    Vanilla.serializeForm = function (form) {
        if (form.tagName.toLowerCase() !== "form")
            return false;

        var data = [];

        for (var i = 0; i < form.elements.length; i++) {
            var type = form.elements[i].type.toLowerCase();

            if (typeof form.elements[i].type === "undefined" ||
                (type === "submit" || type === "reset" || type === "button"))
                continue;

            if ((type === "radio" || type === "checkbox")) {
                if (!form.elements[i].checked)
                    continue;

                data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value)));
            } else if (type === "select-multiple") {
                for (var selection = 0; selection < form.elements[i].children.length; selection++) {
                    if (form.elements[i].children[selection].selected)
                        data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].children[selection].value)));
                }
            } else {
                data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value)));
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
