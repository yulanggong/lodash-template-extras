require('mocha');
var expect = require('chai').expect;

var initTemplateEx = require('../underscore-template-extras');

test('underscore');
test('lodash');

function test(name){
	var _ = require(name);
	initTemplateEx(_);

	describe(name + '-templateEx', function(){
		it(name + '-add/get template', function(){

			_.templateEx.add('home','<div></div>');
			expect(_.templateEx('home')).to.be.equal('<div></div>');

			_.templateEx.add({
				home: '<div id="home"></div>',
				nav: '<div id="nav"></div>'
			});
			expect(_.templateEx('home')).to.be.equal('<div id="home"></div>');
			expect(_.templateEx('nav')).to.be.equal('<div id="nav"></div>');
		});

		it(name + '-helper', function(){

			_.templateEx.addHelper('upper', function(str){
				return str.toUpperCase();
			});

			_.templateEx.add({
				abc: '<% @upper("abc") %>',
				include: '<% @include("abc") %>'
			});

			expect(_.templateEx('abc')).to.be.equal('ABC');
			expect(_.templateEx('include')).to.be.equal('ABC');
		});

		it(name + '-alias', function(){
			_.templateEx.add({
				foo: '<% @alias("bar") %>foo'
			});

			expect(_.templateEx('bar')).to.be.equal('foo');
		});
	});

	describe(name + '-inheritance', function () {

		it(name + '-block extends', function(){
			_.templateEx.add({
				layout: '<block name="head" /><block name="body" />',
				page: '<% @extends("layout")%><override name="head"><%=head%></override><override name="body"><%=body%></override>'
			});
			expect(_.templateEx('page',{
				head: 'A',
				body: 'B'
			})).to.be.equal('AB');
		});


		it(name + '-multiple extends', function(){
			_.templateEx.add({
				layout1: '<block name="head" />',
				layout2: '<% @extends("layout1")%><override name="head"><%=head%><block name="body" /></override>',
				page2: '<% @extends("layout2")%><override name="body"><%=body%></override>'
			});
			expect(_.templateEx('page2',{
				head: 'A',
				body: 'B'
			})).to.be.equal('AB');
		});

		it(name + '-prepend append', function(){
			_.templateEx.add({
				layout3: '<block name="head" />',
				page3: '<% @extends("layout3")%><prepend name="head">A</prepend><override name="head"><%=head%></override><append name="head">C</append>'
			});
			expect(_.templateEx('page3',{
				head: 'B'
			})).to.be.equal('ABC');
		});
	});
}
