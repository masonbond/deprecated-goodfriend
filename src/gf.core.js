;var GF=(function(){'use strict';
	var _public,
		_static = {
			nextContextId: 0,
			contexts: [],
			listeners: {}
		},
		gl,
		shaderTypeMap;

	// TODO finish refactor
	// -	fix ur object literal initializer getter/setters
	// -	convert ShaderProgram to have getters/setters for vert/frag and link method, like Shader
	// -	convert context to have getter/setter for active shaderprogram
	// -	general cleanup pass

	// helpers

	function raiseEvent(type) {
		var i,
			listeners = _static.listeners[type],
			l;

		if (!(listeners && listeners.length > 0)) return false;

		l = listeners.length;

		for (i = 0; i < l; ++i) {
			listeners[i]();
		}
	}

	_public = {

		// helper constructors

		Stack: function(args) {
			// TODO Stack
		},
		
		// graphics constructors

		Context: function(canvas) {
			var gl = canvas && canvas.getContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
				shaderProgram = 0,
				context,
				id = _static.nextContextId++,
				active = {
					shaderProgram: 0,
					vertexShader: 0,
					fragmentShader: 0
				};

			// TODO log context creation failed
			if (!gl) return false;

			// map out shader types to enumerated webgl types, but only once
			shaderTypeMap = shaderTypeMap || {
				'x-shader/x-vertex': gl.VERTEX_SHADER,
				'x-shader/x-fragment': gl.FRAGMENT_SHADER
			};

			raiseEvent(_public.INIT);

			return context = {
				get id() { return id; },
				get gl() { return gl; },

				get shaderProgram() { return shaderProgram; },
				set shaderProgram(program) {
					shaderProgram = program;

					if (shaderProgram === 0 || (typeof shaderProgram === 'object' && shaderProgram.object)) {
						gl.useProgram(shaderProgram.object);
					}

					return program;
				},

				// context helper object constructors

				Shader: function(source, type) {
					// load a glsl shader.
					// script parameter can be an HTMLScriptElement, the object of an HTMLScriptElement, or raw GLSL source.
					var glsl,
						shaderType,
						object,
						shader;

					if (type) shaderType = shaderTypeMap[type];

					shader = {
						get object() { return object; },
						get type() { return shaderType; },
						
						get source() { return glsl; },
						set source(source) {
							var sourceIsString = (typeof source === 'string'),
								script = (sourceIsString && document.getElementById(source)) || source;

							if (script instanceof HTMLScriptElement) {
								// script element node or object was passed in
								shaderType = shaderTypeMap[script.type];
								glsl = script.textContent;
							} else if (sourceIsString) {
								// parameter is probably raw glsl or something, whatever
								glsl = source;
							}

							return glsl;
						},
						
						compile: function() {
							if (!glsl) return false;

							// if necessary we can try to autodetect the shader type, but it's not optimal or future-proof
							shaderType = shaderType || (/\bgl_Position/.test(glsl) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
							
							object = gl.createShader(shaderType);

							gl.shaderSource(object, glsl);
							gl.compileShader(object);

							if (!gl.getShaderParameter(object, gl.COMPILE_STATUS)) {
								console.error(gl.getShaderInfoLog(object));
								return false;
							}

							// we made it!
							return true;
						}
					};

					shader.source = source;

					if (source) shader.compile();
					
					return shader;
				},
				ShaderProgram: function(vertexShader, fragmentShader) {
					// create a shader program.
					var object = gl.createProgram(),
						vert = vertexShader,
						frag = fragmentShader,
						program;

					program = {
						get object() { return object; },

						get vertexShader() { return vert; },
						set vertexShader(shader) { return vert = shader; },

						get fragmentShader() { return frag; },
						set fragmentShader(shader) { return frag = shader; },

						link: function() {
							if (!(vert && vert.object && frag && frag.object)) return false;

							gl.attachShader(object, vert.object);
							gl.attachShader(object, frag.object);
							gl.linkProgram(object);

							if (!gl.getProgramParameter(object, gl.LINK_STATUS)) {
								// TODO link error
								return false;
							}

							return true;
						}
					};

					program.vertexShader = vertexShader;
					program.fragmentShader = fragmentShader;

					if (vertexShader && fragmentShader) program.link();

					return program;
				}
			};
		},

		// methods

		addEventListener: function(event, callback, prepend) {
			(_static.listeners[event] = _static.listeners[event] || [])[prepend ? 'unshift' : 'push'](callback);
		},
		removeEventListener: function(event, callback) {
			// remove a GF event listener with a specific callback.
			// if callback is omitted or falsy, remove all listeners for that event
			var listeners =  _static.listeners[event],
				i;

			if (!listeners) return false;

			if (callback) {
				i = listeners.indexOf(callback);
				if (i !== -1) listeners.splice(i, 1);
			} else {
				_static.listeners[event] = [];
			}
		},
		defineObjects: function(args) {
			if (!(typeof args === 'object' && typeof args.definitions === 'object')) return;

			var result = typeof args.prototypes === 'obejct' ? args.prototypes : {},
				definitions = args.definitions,
				sortedDefinitionNames = [],
				// looping vars
				prototype,
				prototypeName,
				definition,
				definitionName,
				definitionIndex,
				subclassName,
				i,
				l;

			// sort definitions in order of inheritance dependency

			for (definitionName in definitions) {
				definition = definitions[definitionName];
				definitionIndex = sortedDefinitionNames.indexOf(definitionName);

				if (definitionIndex === -1) {
					definitionIndex = result.length;
					sortedDefinitionNames.push(definitionName);
				}

				subclassName = definition._subclass;

				if (typeof subclassName === 'string' && result.indexof(subclassName) === -1) {
					result.splice(definitionIndex, 0, subclassName);
				}
			}

			// now define the listed properties for each prototype

			l = sortedDefinitionNames.length;

			for (i = 0; i < l; ++i) {
				prototypeName = sortedDefinitionNames[i];
				prototype = result[prototypeName] || (result[prototypeName] = {});
				definition = definitions[prototypeName];

				if (!definition) continue;

				if (typeof definition._superclass === 'string' && typeof definitions[definition._superclass] === 'object') {
					defineProperties(prototype, definitions[definition._superclass], prototypeName);
				}

				defineProperties(prototype, definition);
			}

			function defineProperties(prototype, definition, subclass) {
				var propertyName,
					property,
					subclassDefinition = subclass && definitions[subclass];

				for (propertyName in definition) {
					if (propertyName === '_superclass') continue;

					property = definition[propertyName];

					if (subclassDefinition) {
						// this is a superclass, add properties to subclass that it doesn't override
						subclassDefinition[propertyName] = subclassDefinition[propertyName] || property;
					} else {
						// this is a subclass, define the property
						Object.defineProperty(prototype, propertyName, property);
					}
				}
			}

			return result;
		},

		// event codes

		INIT: 'init'
	};

	return _public;
}());
