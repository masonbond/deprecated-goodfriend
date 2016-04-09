;var GF=(function(){'use strict';
	var _public,
		_static = {
			nextContextId: 0,
			contexts: [],
			listeners: {}
		},
		shaderTypeMap,
		defaults = {
			Texture: {
				minFilter: 'LINEAR_MIPMAP_LINEAR',
				magFilter: 'LINEAR',
				wrapU: 'CLAMP_TO_EDGE',
				wrapV: 'CLAMP_TO_EDGE'
			}
		};

	// TODO finish refactor
	// -	fix ur object literal initializer getter/setters
	// -	convert ShaderProgram to have getters/setters for vert/frag and link method, like Shader
	// -	convert context to have getter/setter for active shaderprogram
	// -	general cleanup pass

	function loadModule(destination, modules) {
		for (var name in modules) {
			destination[name] = modules[name](destination);
		}
	}

	_public = {

		// utility

		extend: function() {
			var deepCopy = arguments[0] === true,
				temp = {},
				source,
				dest,
				prop,
				end = deepCopy - 1,
				last = end + 1,
				i;

			for (i = arguments.length - 1; i > end; --i) {
				source = arguments[i];

				if (typeof source !== 'object') return false;

				dest = temp;

				if (i === last) {
					dest = source;
					source = temp;
				}

				for (prop in source) {
					if (deepCopy && typeof source[prop] === 'object' && typeof dest[prop] === 'object') {
						_public.extend(true, dest[prop], source[prop]);
					} else {
						dest[prop] = Object.prototype.hasOwnProperty.call(dest, prop) ? dest[prop] : source[prop];						
					}
				}
			}

			return true;
		},

		// graphics constructors

		Context: function(canvas) {
			var gl = canvas && canvas.getContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
			
			// TODO log context creation failed
			if (!gl) return false;

			var shaderProgram = 0,
				context,
				id = _static.nextContextId++,
				active = {
					shaderProgram: 0,
					vertexShader: 0,
					fragmentShader: 0
				};

			// map out shader types to enumerated webgl types, but only once
			shaderTypeMap = shaderTypeMap || {
				'x-shader/x-vertex': gl.VERTEX_SHADER,
				'x-shader/x-fragment': gl.FRAGMENT_SHADER
			};

			context = {
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
					// script parameter can be an HTMLScriptElement, the id of an HTMLScriptElement, or raw GLSL source.
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
							shaderType = shaderType || (/\bgl_Position\b/.test(glsl) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
							
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
				},
				Texture: function(textureSource, options) {
					var settings = {},
						id = gl.createTexture(),
						texture,
						width,
						height;

					_public.extend(settings, options || {}, defaults.Texture);

					function fromElement(element, isImage) {
						bind();
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
						gl.generateMipmap(gl.TEXTURE_2D);

						// images will have naturalWidth and Height defined

						width = element.naturalWidth || element.width;
						height = element.naturalHeight || element.height;

						if (typeof settings.onLoad === 'function') {
							settings.onLoad(texture);
						}
					}

					function load(source) {
						// source can be a url to an image, an image element, a canvas element, or the id of an image or canvas element

						source = typeof source === 'string' && document.getElementById(source) || source;

						var isImage;

						if (typeof source === 'string') {
							var image = new Image();

							image.onload = function() { fromElement(image); };
							image.src = source;
						} else if ((isImage = source instanceof HTMLImageElement) || source instanceof HTMLCanvasElement) {
							fromElement(source, isImage);
						} else throw new TypeError('GF.Texture - invalid source type');						
					}

					function bind(unit) {
						gl.activeTexture(gl['TEXTURE' + (unit || '0')]);
						gl.bindTexture(gl.TEXTURE_2D, id);
					}

					function wrap(u, v) {
						bind();

						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[u]);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[v || u]);

						context.Texture.unbind();
					}

					function filter(min, mag) {
						bind();
						
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[min]);
						gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[mag || min]);
						
						context.Texture.unbind();
					}
					
					load(textureSource);

					return texture = {
						get id() { return id; },
						get width() { return width; },
						get height() { return height; },
						load: load,
						bind: bind,
						wrap: wrap,
						filter: filter
					};
				},
				BufferObject: function() {
					var buffer;

					return buffer = {

					};
				}
			};

			// static methods

			context.Texture.unbind = function() {
				gl.bindTexture(gl.TEXTURE_2D, null);
			};

			loadModule(context, GF.Context.module);

			return context;
		}
	};

	// static members

	_public.Context.module = {};

	return _public;
}());
