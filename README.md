# Underscore Template Extras
Add inheritance to underscore/lodash template engine.

# Download
[Last verison](https://raw.githubusercontent.com/yulanggong/underscore-template-extras/master/underscore-template-extras.js)

# Installation

```html
<script src="lodash.js"></script>
<script src="underscore-template-extras.js"></script>
```

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
//<h1>Hello world!</h1>
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
    str.toUpperCase();
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