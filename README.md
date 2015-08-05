# Omega.js

## Introduction

Omega.js is a small vanilla javascript library for the most common functions used by front-end developers in one-off scripts.
For years developers have relied on heavy libraries to accomplish these simple, and repetitive tasks.
While doing so the bulk of the already loaded library remains unused. This creates a much larger network overhead than necessary.
Omega.js allows developers to load a much smaller library to accomplish tasks like toggling element classes, modals, ajax requests, and event listeners.

## Compatibility Notice

1. Omega.js is compatible with all modern desktop browsers (Chrome, Safari, FireFox), and IE 8+.
2. Most mobile browsers (iOS, Android).

### Installing Omega.js

1. Download Omega.js.
2. Add `omega.js` to the head of your HTML application.

### Using Omega.js

To use Omega.js reference it in your javascript with `Omega`, or the Omega symbol `Ω` (Windows Alt+Z, Mac Option+Z).

## Omega.js Methods

| Method | Parameters | Optional | Default | Return | Description | Examples |
| -- | -- | -- | -- | -- | -- | -- |
| `Ω.ready(callback)` | `callback`: `Function` | N | NA | `false` | The function to call when the DOM ready state is complete. | `function(){ //Do Stuff. }`, or pass by reference `myFunction`. |
| `Ω.createEl(el, attributes, text, html)` | `type`: `String` | N | NA | `HTMLElement` | A string of the element type to create. | `'div'`, `'span'`, `'a'`, `'p'`... | 
| | `attributes`: `Object` | Y | NA | NA | An object containing HTML element attributes to apply to the newly created element. | `{'class': 'blue-button disabled', 'title': 'Submit'}` |
| | `text`: `String` | Y | NA | NA | A string of text to be inserted into the newly created element. | `'Hello Omega!'` |
| | `html`: `Boolean` | Y | `false` | NA | Requires `text` to be set. Renders `text` as HTML content | `'<h1 id="header">Hello Omega!</h1>'` |
| `Ω.setAttributes(el, attributes)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `attributes`: `Object` | N | NA | NA | An object containing HTML element attributes to apply to the `el`. | `{'class': 'blue-button disabled', 'title': 'Submit'}` |
| `Ω.hasClass(el, klass)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | NA | The class to check for on the `el`. | `'selected'` |
| `Ω.removeClass(el, klass)` | `false` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | NA | The class to remove from the `el`. | `'selected'` |
| `Ω.addClass(el, klass)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | NA | The class to remove to the `el`. | `'selected'` |
| `Ω.toggleClass(el, klass)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | NA | The class to add, or remove from the `el`. | `'selected'` |
| `Ω.event(el, event, func, bubbles)` | `el`: `HTMLElement|Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `event`: `String` | N | NA | NA | The name of the event to listen for. | `'click'` |
| | `func`: `Function` | N | NA | NA | The function to invoke when the listener is called. | `function(event){ // DO STUFF HERE }` |
| | `bubbles`: `Boolean` | Y | NA | NA | Boolean for function bubbling. | `true|false` |
| `Ω.remove(el, event, func, bubbles)` | `el`: `HTMLElement|Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `event`: `String` | N | NA | NA | The name of the event to remove. | `'click'` |
| | `func`: `Function` | N | NA | NA | The associated listener function to remove. | `function(event){ // DO STUFF HERE }` |
| | `bubbles`: `Boolean` | Y | NA | NA | Boolean for function bubbling. | `true|false` |
| `Ω.stop(event)` | `event`: `Event` | N | NA | `false` | The event on which to stop propagation. | `Event` |
| `Ω.swipe(el, direction, options)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` |
| | `direction`: `Boolean` | N | NA | NA | The direction of the swipe to listen for. | `'up'|'down'|'left'|'right'` |
| | `options`: `Boolean` | Y | NA | NA | Boolean for function bubbling. | `true|false` |
| | `{` | | | | | |
| | `threshold`: `Boolean` | Y | 60 | NA | A number representing the length of the swipe, in pixels, to trigger the callback. | `30` |
| | `restraint`: `Boolean` | Y | 100 | NA | A number representing wiggle room, in pixels, allowed on the perpendicular plane. | `70` |
| | `allowed_time`: `Boolean` | Y | 600 | NA | A number representing the length of time of the swipe, in milliseconds, to trigger the callback. | `300` |
| | `callback`: `Boolean` | Y | NA | `function(){}` | The function to invoke if the direction, and conditions for swipe are met. | `function(){ // DO STUFF HERE }` |
| | `{` | | | | | |