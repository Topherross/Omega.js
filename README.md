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
| | `attributes`: `Object` | Y | NA | `false` | An object containing HTML element attributes to apply to the newly created element. | `{'class': 'blue-button disabled', 'title': 'Submit'}` |
| | `text`: `String` | Y | NA | `false` | A string of text to be inserted into the newly created element. | `'Hello Omega!'` |
| | `html`: `Boolean` | Y | `false` | `false` | Requires `text` to be set. Renders `text` as HTML content | `'<h1 id="header">Hello Omega!</h1>'` |
| `Ω.setAttributes(el, attributes)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `attributes`: `Object` | N | NA | | An object containing HTML element attributes to apply to the `el`. | `{'class': 'blue-button disabled', 'title': 'Submit'}` |
| `Ω.hasClass(el, klass)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | `false` | The class to check for on the `el`. | `'selected'` |
| `Ω.removeClass(el, klass)` | | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | `false` | The class to remove from the `el`. | `'selected'` |
| `Ω.addClass(el, klass)` | `el`: `Element` | N | NA | | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | `false` | The class to remove to the `el`. | `'selected'` |
| `Ω.toggleClass(el, klass)` | `el`: `Element` | N | NA | `false` | The HTML target element. | `document.querySelector('#header');` | 
| | `klass`: `String` | N | NA | `false` | The class to add, or remove from the `el`. | `'selected'` |