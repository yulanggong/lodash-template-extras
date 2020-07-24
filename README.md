# Lodash Template Extras
Add inheritance to lodash/underscore template engine.

# Download
[Last verison](https://raw.githubusercontent.com/yulanggong/lodash-template-extras/master/lodash-template-extras.js)

# Installation

In browser:
```html
<script src="lodash.js"></script>
<script src="lodash-template-extras.js"></script>
```

Using npm:
```sh
$ npm i lodash-template-extras
```

In Node.js:
```js
var _ = require('lodash');
require('lodash-template-extras')(_);
````

# Usage

## Naming templates

```js
//add a template
_.templateEx.add('layout', ''
    + '<block name="head">'
        + '<h1>Foo</h1>'
    + '</block>'
    + '<block name="body"/>');

//add some templates
_.templateEx.add({
    layout: '<block name="head">'
                 + '<h1>Foo</h1>'
             + '</block>'
             + '<block name="body"/>',
     page: '<% @extends("layout")%>'
            + '<append name="head">'
                + '<p>Hello world!</p>'
            + '</append>'
});

//template can have alias
_.templateEx.add({
    'long/long/name': '<% @alias("short")%>'
                    + '<h1><%=h1%></h1>'
});
````

## Use template

```js
_.templateEx.add({
    hello: '<h1>Hello <%=name%>!</h1>'
});

_.templateEx('hello',{
    name: 'world'
});
// ➜ <h1>Hello world!</h1>
````

## Inheritance

```html
<!-- layout -->
<div id="header">
    <block name="header">
        <h1>Foo</h1>
    </block>
</div>
<div id="main">
    <block name="main"/>
</div>
```

```html
<!-- page -->
<% @extends("layout")%>
<prepend name="header">
    <i>:)</i>
</prepend>
<append name="header">
    <h2>Hello world!</h2>
</append>
<overrid name="main">
    <p>bar</p>
</overrid>
````

`_.templateEx('page');` compiles to:

```html
<div id="header">
    <i>:)</i>
    <h1>Foo</h1>
    <h2>Hello world!</h2>
</div>
<div id="main">
    <p>bar</p>
</div>
```

## Include

```html
<!-- page -->
<div id="header"></div>
<div id="main"></div>
<% @include("footer")%>
```
```html
<!-- footer -->
<div id="footer"></div>
```

`_.templateEx('page');` compiles to:

```html
<div id="header"></div>
<div id="main"></div>
<div id="footer"></div>
```

## Helper
```js
_.templateEx.addHelper('upper', function(str){
    return str.toUpperCase();
})
````
```html
<!-- page -->
<div>Hello <% @upper(name)%>!</div>
```

`_.templateEx('page', {name: 'world' });` compiles to:

```html
<div>Hello WORLD!</div>
```
