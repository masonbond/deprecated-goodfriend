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
			},
			Mesh: {
				mode: 'TRIANGLES'
			}
		};

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
				ShaderProgram: function(options) {
					// create a shader program.
					var settings = {},
						object = gl.createProgram(),
						vert = options.vertexShader,
						frag = options.fragmentShader,
						attributes = options.attributes,
						program;

					program = {
						get object() { return object; },

						get vertexShader() { return vert; },
						set vertexShader(shader) { return vert = shader; },

						get fragmentShader() { return frag; },
						set fragmentShader(shader) { return frag = shader; },

						get attributes() { return attributes; },
						set attributes(newAttributes) { return attributes = newAttributes; },

						link: function() {
							if (!(vert && vert.object && frag && frag.object)) return false;

							gl.attachShader(object, vert.object);
							gl.attachShader(object, frag.object);

							for (var i = 0, attr; attr = attributes[i]; ++i) {
								gl.bindAttribLocation(object, i, attr.name);
							}

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
						onLoad,
						id = gl.createTexture(),
						texture,
						width,
						height;

					_public.extend(settings, options || {}, defaults.Texture);
					onLoad = settings.onLoad;

					function fromElement(element, isImage) {
						bind();
						gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, element);
						gl.generateMipmap(gl.TEXTURE_2D);

						// images will have naturalWidth and Height defined

						width = element.naturalWidth || element.width;
						height = element.naturalHeight || element.height;

						if (typeof onLoad === 'function') {
							onLoad(texture);
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
						} else throw new TypeError('GF.Context.Texture - invalid source type');						
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
						onLoad: onLoad,
						load: load,
						bind: bind,
						wrap: wrap,
						filter: filter
					};
				},
				Mesh: function(options) {
					var settings = {},
						attributes = settings.attributes,
						vertices = settings.vertices,
						indices = settings.indices,
						drawMode = gl[settings.mode],
						i,
						attr;

					_public.extend(settings, defaults.Mesh, options)

					// safety checks are optional but recommended, especially for procedurally generated geometry

					if (!settings.unsafe) {
						if (attributes.length > vertices.length) throw new Error('GF.Context.Mesh construction error: attributes require ' + attributes.length + ' buffers, ' + vertices.length + ' provided');

						for (i = 0; attr = attributes[i]; ++i) {
							if (vertices[i].length % attr.size !== 0) throw new RangeError('GF.Context.Mesh construction error: attribute "' + attr.name + '" requires ' + attr.size + ' vertex elements');
							if (!((attr.type === gl.FLOAT && vertices[i] instanceof Float32Array) || (attr.type === gl.INT && vertices[i] instanceof Int32Array))) throw new TypeError('GF.Context.Mesh construction error: attribute "' + attr.name + '" type does not match type of buffer provided');
						}
					}

					var id = gl.genVertexArrays(),
						indicesId,
						bufferIds = [];

					// create vertex array id

					gl.bindVertexArray(id);

					// create and fill vertex buffers

					for (i = 0; attr = attributes[i]; ++i) {
						bufferIds[i] = gl.glGenBuffers();

						gl.bindBuffer(gl.ARRAY_BUFFER, bufferIds[i]);
						gl.bufferData(gl.ARRAY_BUFFER, vertices[i], gl.STATIC_DRAW);

						gl.vertexAttribPointer(gl.ARRAY_BUFFER, attr.size, gl[attr.type], false, 0, 0);
					}

					// create and fill index buffer

					indexId = gl.genBuffers();
					gl.bindBuffer(gl.ARRAY_BUFFER, indexId);

					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexId);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

					// unbind

					gl.bindVertexArray(0);
					gl.bindBuffer(0);

					function draw() {
						gl.bindVertexArray(id);

						var i, l = bufferIds.length;

						for (i = 0; i < l; ++i) gl.enableVertexAttribArray(i);

						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexId);
						gl.drawElements(drawMode, indices.length, gl.UNSIGNED_INT, 0);
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0);

						for (i = 0; i < l; ++i) gl.disableVertexAttribArray(i);

						gl.bindVertexArray(0);
					}

					return buffer = {
						get attributes() { return attributes; },
						get vertices() { return vertices; },
						get indices() { return indices; },
						get bufferIds() { return bufferIds; },
						get id() { return id; },
						draw: draw
					};
				}
			};

			// static methods

			context.Texture.unbind = function() {
				gl.bindTexture(gl.TEXTURE_2D, null);
			};

			context.Mesh.unbind = function() {
				gl.bindVertexArray(0);
			};

			loadModule(context, GF.Context.module);

			return context;
		}
	};

	// static members

	_public.Context.module = {};

	return _public;
}());
