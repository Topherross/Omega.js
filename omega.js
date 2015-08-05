/**
 * Created by chrisr on 3/4/15.
 */

(function (window, document) {
    'use strict';

    var Omega = {},
        $modal = null;

    /**
     *
     * @param {Function} callback
     * @returns {boolean} false
     */
    Omega.ready = function (callback) {
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
     * @param {string} type
     * @param {Object} [attributes]
     * @param {string} [text]
     * @param {boolean} [html]
     * @returns {Element}
     */
    Omega.createEl = function (type, attributes, text, html) {
        var el = document.createElement(type);

        if (typeof attributes !== "undefined") {
            Omega.setAttributes(el, attributes);
        }

        if (typeof text !== "undefined") {
            if (typeof html !== "undefined" && !!html) {
                Omega.setText(el, text, true);
            } else {
                Omega.setText(el, text);
            }
        }

        return el;
    };

    /**
     *
     * @param {Element} el
     * @param {Object} attributes
     * @returns {boolean} false
     */
    Omega.setAttributes = function (el, attributes) {
        for (var attr in attributes) {
            if (Object.prototype.hasOwnProperty.call(attributes, attr)) {
                el.setAttribute(attr, attributes[attr]);
            }
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement} el
     * @param {string} klass
     * @returns {boolean} false
     */
    Omega.hasClass = function (el, klass) {
        if (!el.hasAttribute('class')) {
            return false;
        }

        var class_list = el.getAttribute('class').split(' ');

        if (typeof class_list !== "undefined" &&
            class_list.length > 0) {
            for (var c = 0; c < class_list.length; c++) {
                if (class_list[c] == klass) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement} el
     * @param {string} klass
     * @returns {boolean} false
     */
    Omega.removeClass = function (el, klass) {
        if (!el.hasAttribute('class')) {
            return false;
        }

        var class_list = el.getAttribute('class').split(' ');

        if (class_list.length > 0) {
            for (var c = 0; c < class_list.length; c++) {
                if (class_list[c] == klass) {
                    class_list.splice(c, 1);
                    el.setAttribute('class', class_list.join(' '));
                    break;
                }
            }
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement} el
     * @param {string} klass
     * @returns {boolean} false
     */
    Omega.addClass = function (el, klass) {
        var class_list = (el.hasAttribute('class')) ? el.getAttribute('class').split(' ') : [];

        if (!Omega.hasClass(el, klass)) {
            class_list.push(klass);
            el.setAttribute('class', class_list.join(' '));
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement} el
     * @param {string} klass
     * @returns {boolean} false
     */
    Omega.toggleClass = function (el, klass) {
        if (Omega.hasClass(el, klass)) {
            Omega.removeClass(el, klass);
        } else {
            Omega.addClass(el, klass);
        }

        return false;
    };

    /**
     *
     * @param {Object} objs
     * @param {string} klass
     * @returns {boolean}
     */
    Omega.batchRemoveClass = function (objs, klass) {
        if (objs.length == 0) {
            return false;
        }

        for (var obj = 0; obj < objs.length; obj++) {
            if (objs[obj].hasAttribute('class') &&
                Omega.hasClass(objs[obj], klass)) {
                Omega.removeClass(objs[obj], klass);
            }
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement|Element} el
     * @param {String} event
     * @param {Function} func
     * @param {boolean} [bubbles]
     * @returns {boolean}
     */
    Omega.event = function (el, event, func, bubbles) {
        if (document.addEventListener) {
            el.addEventListener(event, func, (typeof bubbles !== "undefined" && typeof bubbles === "boolean") ? bubbles : false);
        } else if (document.attachEvent) {
            el.attachEvent("on" + event, func);
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement|Element} el
     * @param {String} event
     * @param {Function} func
     * @param {boolean} [bubbles]
     * @returns {boolean}
     */
    Omega.remove = function (el, event, func, bubbles) {
        if (document.removeEventListener) {
            el.removeEventListener(event, func, (typeof bubbles !== "undefined" && typeof bubbles === "boolean") ? bubbles : false);
        } else if (document.detachEvent) {
            el.detachEvent("on" + event, func);
        }

        return false;
    };

    /**
     *
     * @param {Event} event
     * @returns {boolean}
     */
    Omega.stop = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }

        return false;
    };

    /**
     *
     * Touch screen swipe event listener
     * @param {Element} el - The HTML element to add listener for swipe events
     * @param {String} direction - The direction of the event. Allowed values: 'up', 'down', 'left', or 'right'.
     * @param {Object[]} [options] - Config options.
     * @param {Number} [options.threshold=60] - A number representing the length of the swipe, in pixels, to trigger the callback.
     * @param {Number} [options.restraint=100] - A number representing wiggle room, in pixels, allowed on the perpendicular plane.
     * @param {Number} [options.allowed_time=600] - A number representing the length of time of the swipe, in milliseconds, to trigger the callback.
     * @param {Function} [options.callback=function(){}] - A callback function to be fired if the desired swipe direction, and constraints are met.
     * @returns {boolean}
     */
    Omega.swipe = function (el, direction, options) {
        if (typeof el === "undefined" || typeof direction === "undefined") {
            return false;
        }

        var $el = el,
            $options,
            start_x,
            start_y,
            dist_x,
            dist_y,
            elapsed_time,
            start_time;

        $options = {
            threshold: options.threshold || 60,
            restraint: options.restraint || 100,
            allowed_time: options.allowed_time || 600,
            callback: options.callback || function () {}
        };

        Omega.event($el, 'touchstart', function (event) {
            var target = event.changedTouches[0];

            start_x = target.pageX;
            start_y = target.pageY;
            start_time = new Date().getTime();

            event.preventDefault();
        }, false);

        Omega.event($el, 'touchmove', function (event) {
            event.preventDefault();
        }, false);

        Omega.event($el, 'touchend', function (event) {
            var target = event.changedTouches[0];

            dist_x = target.pageX - start_x;
            dist_y = target.pageY - start_y;
            elapsed_time = new Date().getTime() - start_time;

            if (elapsed_time <= $options.allowed_time) {
                if (Math.abs(dist_x) >= $options.threshold && Math.abs(dist_y) <= $options.restraint) {
                    if (dist_x < 0 && direction == 'left') {
                        $options.callback();
                    } else if (dist_x > 0 && direction == 'right') {
                        $options.callback();
                    }
                }
                else if (Math.abs(dist_y) >= $options.threshold && Math.abs(dist_x) <= $options.restraint) {
                    if (dist_y < 0 && direction == 'up') {
                        $options.callback();
                    } else if (dist_y > 0 && direction == 'down') {
                        $options.callback();
                    }
                }
            }

            event.preventDefault();
        }, false);

        return false;
    };

    /**
     *
     * @param {HTMLElement|Element} el
     * @param {string} text
     * @param {boolean} [html]
     * @returns {boolean}
     */
    Omega.setText = function (el, text, html) {
        if (typeof html !== "undefined" && !!html) {
            el.innerHTML = text;
        } else if (document.all) {
            el.innerText = text;
        } else {
            el.textContent = text;
        }

        return false;
    };

    /**
     *
     * @param {HTMLElement} el
     * @returns {string|*}
     */
    Omega.getText = function (el) {
        return (document.all) ? el.innerText : el.textContent;
    };

    /**
     *
     * @returns {object}
     */
    Omega.getUrlParams = function () {
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
     * @param {Object} obj
     * @returns {string}
     */
    Omega.stringifyUrlParams = function (obj) {
        var params = [];

        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && key !== 'length') {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }

        return params.join('&');
    };

    /**
     *
     * @param {String} param
     * @param {(String|Number)} value
     * @param {boolean} [allow_reload]
     * @returns {object}
     */
    Omega.setUrlParam = function (param, value, allow_reload) {
        var params = Omega.getUrlParams();

        params[param] = value;

        if (window.history.pushState) {
            window.history.pushState({}, "", window.location.pathname + '?' + Omega.stringifyUrlParams(params));
        } else if (typeof allow_reload !== "undefined" && !!allow_reload) {
            window.location.search = Omega.stringifyUrlParams(params);
        }

        return params;
    };

    /**
     *
     * @param {String} param
     * @param {boolean} [allow_reload]
     * @returns {object}
     */
    Omega.removeUrlParam = function (param, allow_reload) {
        var params = Omega.getUrlParams(),
            param_string;

        if (Object.prototype.hasOwnProperty.call(params, param)) {
            delete params[param];
        }

        param_string = Omega.stringifyUrlParams(params);

        if (window.history.pushState && param_string === "") {
            window.history.pushState({}, "", window.location.pathname);
        } else if (window.history.pushState && param_string !== "") {
            window.history.pushState({}, "", window.location.pathname + '?' + param_string);
        } else if (typeof allow_reload !== "undefined" && !!allow_reload) {
            window.location.search = param_string;
        }

        return params;
    };

    /**
     *
     * @param {Object} [options]
     * @param {Object} [options.show_callback=false]
     * @param {Object} [options.hide_callback=false]
     * @returns {object}
     */
    Omega.modal = function (options) {
        if ($modal !== null) {
            return $modal;
        }

        $modal = {};
        options = (typeof options === "undefined") ? {} : options;

        var configs = {
                show_callback: options.show_callback || false,
                hide_callback: options.hide_callback || false
            },
            modal_wrap = Omega.createEl('div', {'id': 'vanilla_modal_wrap', 'style': 'display:none;'}),
            modal_window = Omega.createEl('div', {'id': 'vanilla_modal_window'}),
            modal_header = Omega.createEl('h1', {'id': 'vanilla_modal_header'}),
            modal_closer = Omega.createEl('div', {'id': 'vanilla_modal_closer'}),
            modal_content = Omega.createEl('div', {'id': 'vanilla_modal_content'});

        modal_window.appendChild(modal_header);
        modal_window.appendChild(modal_closer);
        modal_window.appendChild(modal_content);
        modal_wrap.appendChild(modal_window);

        $modal.added_to_DOM = false;
        $modal.visible = false;

        /**
         *
         * @param {String} text
         * @param {boolean} [html]
         * @returns {Object} $modal
         */
        $modal.updateHeader = function (text, html) {
            if (typeof html !== "undefined" && !!html) {
                Omega.setText(modal_header, text, html);
            } else {
                Omega.setText(modal_header, text);
            }

            return $modal;
        };

        /**
         *
         * @param {String} text
         * @param {boolean} [html]
         * @returns {Object} $modal
         */
        $modal.updateContent = function (text, html) {
            if (typeof html !== "undefined" && !!html) {
                Omega.setText(modal_content, text, html);
            } else {
                Omega.setText(modal_content, text);
            }

            return $modal;
        };

        /**
         *
         * @param {String} klass
         * @returns {Object} $modal
         */
        $modal.updateClass = function (klass) {
            if (typeof klass === "string") {
                modal_window.setAttribute('class', klass);
            }

            return $modal;
        };

        /**
         *
         * @param {Function} [callback]
         * @returns {Object} $modal
         */
        $modal.show = function (callback) {
            if (!$modal.added_to_DOM) {
                document.body.appendChild(modal_wrap);
                $modal.added_to_DOM = true;
            }

            Object(modal_wrap).style.display = "block";
            $modal.visible = true;

            if (typeof callback === "function") {
                callback();
            } else if (typeof configs.show_callback === "function") {
                configs.show_callback();
            }

            return $modal;
        };

        /**
         *
         * @param {Function} [callback]
         * @returns {Object} $modal
         */
        $modal.hide = function (callback) {
            if (!!$modal.added_to_DOM) {
                Object(modal_wrap).style.display = "none";
                $modal.visible = false;
            }

            if (typeof callback === "function") {
                callback();
            } else if (typeof configs.hide_callback === "function") {
                configs.hide_callback();
            }

            return $modal;
        };

        /**
         *
         * @returns {boolean}
         */
        $modal.destroy = function () {
            document.body.removeChild(modal_wrap);
            $modal = null;

            return false;
        };

        Omega.event(modal_closer, 'click', function () {
            $modal.hide();
        }, false);

        Omega.event(modal_wrap, 'click', function () {
            $modal.hide();
        }, false);

        Omega.event(modal_window, 'click', function (event) {
            Omega.stop(event);
        }, false);

        Omega.event(window, 'keyup', function(event){
            var key = event.which || event.keyCode;

            if (key == 27) {
                $modal.hide();
            }
        }, false);

        document.body.appendChild(modal_wrap);
        $modal.added_to_DOM = true;

        return $modal;
    };

    Omega.fadeIn = function (el, speed, callback) {
        var step = 0.01;

        el.style.opacity = parseFloat(el.style.opacity) + step;

        if (el.style.opacity > 1.0) {
            el.style.opacity = 1.0;
            if (typeof callback === "function") {
                callback();
            }
        } else {
            setTimeout(function () {
                Omega.fadeIn(el, speed, callback)
            }, speed);
        }

        return false;
    };

    Omega.fadeOut = function (el, speed, callback) {
        var step = 0.01;

        el.style.opacity = parseFloat(el.style.opacity) - step;

        if (el.style.opacity < step) {
            el.style.opacity = 0.0;
            if (typeof callback === "function") {
                callback();
            }
        } else {
            setTimeout(function () {
                Omega.fadeOut(el, speed, callback)
            }, speed);
        }

        return false;
    };

    Omega.slideDown = function (el, speed, callback) {
        var height = (typeof el.style.height !== "undefined") ? parseFloat(el.style.height) : 0;

        if (height < 580) {
            height += 29;
            el.style.height = height + "px";
            setTimeout(function () {
                Omega.slideDown(el, speed, callback)
            }, speed);
        } else if (typeof callback === "function") {
            callback();
        }

        return false;
    };

    Omega.slideUp = function (el, speed, callback) {
        var height = (typeof el.style.height !== "undefined") ? parseFloat(el.style.height) : 580;

        if (height > 0) {
            height -= 29;
            el.style.height = height + "px";
            setTimeout(function () {
                Omega.slideUp(el, speed, callback)
            }, speed);
        } else if (typeof callback === "function") {
            callback();
        }

        return false;
    };

    /**
     *
     * @param {String} action
     * @param {Object} configs
     * @returns {Boolean|XMLHttpRequest}
     */
    Omega.ajax = function (action, configs) {
        if (typeof action === "undefined" || action === null || !action) {
            return false;
        }

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

        if (!methods.test(options.method)) {
            options.method = "GET";
        }

        if (typeof options.beforeSend === "function") {
            options.beforeSend();
        }

        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    if (typeof options.onSuccess === "function") {
                        options.onSuccess(request);
                    }
                }

                if (request.status >= 400 && request.status < 600) {
                    if (typeof options.onFailure === "function") {
                        options.onFailure(request);
                    }
                }

                if (typeof options.onComplete === "function") {
                    options.onComplete();
                }
            }
        };

        if (!!options.user && !!options.pass) {
            request.open(options.method, action, options.async, options.user, options.pass);
        } else {
            request.open(options.method, action, options.async);
        }

        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (!!options.json) {
            request.setRequestHeader('Content-Type', 'application/json');
        }

        if (options.method == "POST" && !options.json) {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }

        request.send(options.data);

        return request;
    };

    /**
     *
     * @param {HTMLFormElement|Element} form
     * @returns {boolean|string}
     */
    Omega.serializeForm = function (form) {
        if (form.tagName.toLowerCase() !== "form") {
            return false;
        }

        var data = [];

        for (var i = 0; i < form.elements.length; i++) {
            var type = form.elements[i].type.toLowerCase();

            if (typeof form.elements[i].type === "undefined" ||
                (type === "submit" || type === "reset" || type === "button")) {
                continue;
            }

            if ((type === "radio" || type === "checkbox")) {
                if (!form.elements[i].checked) {
                    continue;
                }
                data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value)));
            } else if (type === "select-multiple") {
                for (var selection = 0; selection < form.elements[i].children.length; selection++) {
                    if (form.elements[i].children[selection].selected) {
                        data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].children[selection].value)));
                    }
                }
            } else {
                data.push((form.elements[i].name + '=' + encodeURIComponent(form.elements[i].value)));
            }
        }
        return data.join('&');
    };

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = Omega;
    } else {
        window.Omega = window.Ω = Omega;
    }
})(window, document);
