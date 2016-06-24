;(function () {
	var templates = {};
	var templateHelpers = {};

	_.templateEx = function(tplName, data){
		return templates[tplName].compile(data);
	};

	_.templateEx.templates = templates;

	var addTemplate = function(name, text, _templates){
		var compile;
		var parent;
		var alias;
		var blocks = {};
		var overrides = {};
		var prepends = {};
		var appends = {};
		var markedText;
		var compileText;

		markedText = text.replace(/<%\s*@alias\(['"]([^'"]+)['"]\)\s*%>/g, function(all, name){
			alias = name;
			return '';
		});

		markedText = markedText.replace(/<%\s*@extends\(['"]([^'"]+)['"]\)\s*%>/g, function(all, name){
			parent = templates[name];

			if(!parent){
				addTemplate(name, _templates[name], _templates);
				parent = templates[name];
			}

			return '';
		});

		//parse block
		markedText = markedText.replace(/<block\s+name=['"]?([^'">\s]+)['"]?\s*\/>/g, function(all, name){
			return '<block '+ name +'>';
		});

		//parse block
		markedText = markedText.replace(/<block\s+name=['"]?([^'">\s]+)['"]?\s*>([\s\S]*?)<\/block>/g, function(all, name, block){
			blocks[name] = block;
			return '<block '+ name +'>';
		});

		//parse override
		markedText = markedText.replace(/<override\s+name=['"]?([^'">\s]+)['"]?\s*>([\s\S]*?)<\/override>/g, function(all, name, override){
			overrides[name] = override;
			return '';
		});

		//parse prepend
		markedText = markedText.replace(/<prepend\s+name=['"]?([^'">\s]+)['"]?\s*>([\s\S]*?)<\/prepend>/g, function(all, name, prepend){
			prepends[name] = prepend;
			return '';
		});

		//parse prepend
		markedText = markedText.replace(/<append\s+name=['"]?([^'">\s]+)['"]?\s*>([\s\S]*?)<\/append>/g, function(all, name, append){
			appends[name] = append;
			return '';
		});

		if(parent) {
			markedText = parent.markedText.replace(/<block\s([^>]+)>/g, function(all, name){
				return (prepends[name]||'')
					+ (overrides[name] != null ? overrides[name] :
						parent&&parent.blocks[name] != null ? parent.blocks[name] : all)
					+ (appends[name]||'');
			});
		}

		compileText = markedText.replace(/<block\s([^>]+)>/g, function(all, name){
			return blocks[name]||'';
		});


		compileText = compileText.replace(/(<%|${)\s*@([^\(]+)\(/g, function(all, tag, name){
			return (tag == '${'? tag : (tag + '=')) + '_.templateEx.helper(\'' + name + '\',';
		});

		compile = _.template(compileText, {sourceURL: 'templates/'+name+'.html'});

		templates[name] = {
			text: text,
			markedText: markedText,
			blocks: blocks,
			compile: compile,
			name: name
		};

		if (alias) {
			templates[name].alias = alias;
			templates[alias] = templates[name];
		}

		return templates[name];
	};

	_.templateEx.add = function(name, text){
		if(arguments.length == 2){
			addTemplate(name, text);
		} else {
			_.each(name, function(text, name, templates){
				addTemplate(name, text, templates);
			})
		}
	};

	_.templateEx.addHelper = function(name, fn){
		templateHelpers[name] = fn;
	};

	_.templateEx.helper = function(name/*, ...rest*/){
		var helper = templateHelpers[name];
		var rest = [].slice.call(arguments, 0, arguments.length);
		rest.shift();
		if(!helper){
			helper = templates[name].compile;
			if(!rest.length) rest.push({});
		}
		return helper ? helper.apply(_, rest) : '';
	};

	_.templateEx.addHelper('include', _.templateEx);
})();