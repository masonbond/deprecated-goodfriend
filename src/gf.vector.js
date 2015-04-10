;(function(GF){'use strict';
	
	// TODO matrix operations
	// TODO quaternions
	// TODO gf.matrixstack.js

	if (typeof GF === 'undefined') throw new TypeError('GF is undefined - load gf.core first');

	var VectorArray = Float32Array,
		
		// prototype superclass definitions
		
		prototypes = {
			Vec2: new VectorArray(2),
			Vec3: new VectorArray(3),
			Vec4: new VectorArray(4),
			Mat3: new VectorArray(9),
			Mat4: new VectorArray(16)
		},
		definitions = {

			// helper definitions

			Copyable: {
				copy: { value: function() { return Object.create(this); } }
			},

			// vector defintions

			// 2-component vector (x, y)

			Vec2: {
				_superclass: 'Copyable',
				x: {
					get: function() { return this[0]; },
					set: function(n) { return this[0] = n; }
				},
				y: {
					get: function() { return this[1]; },
					set: function(n) { return this[1] = n; }
				},
				normalize: { value: function() {
					this.magnitude = 1;
					return this;
				}},
				dot: { value: function(v) {
					return this[0] * v[0] + this[1] * v[1];
				}},
				add: { value: function(v) {
					this[0] += v[0];
					this[1] += v[1];

					return this;
				}},
				sub: { value: function(v) {
					this[0] -= v[0];
					this[1] -= v[1];

					return this;
				}},
				mul: { value: function(v) {
					this[0] *= v[0];
					this[1] *= v[1];

					return this;
				}},
				div: { value: function(v) {
					this[0] /= v[0];
					this[1] /= v[1];

					return this;
				}},
				scale: { value: function(x, y) {
					this[0] *= x;
					this[1] *= y || x;

					return this;
				}},
				magnitude: {
					get: function() { return Math.sqrt(this[0] * this[0] + this[1] * this[1]); },
					set: function(n) {
						var l = this.length / n;

						this[0] /= l;
						this[1] /= l;

						return n;
					}
				}
			},

			// 3-component vector (x, y, z)

			Vec3: {
				_superclass: 'Vec2',
				z: {
					get: function() { return this[2]; },
					set: function(n) { return this[2] = n; }
				},
				cross: { value: function(v, result) {
					var r = result || this.copy();

					r[0] = this[1] * v[2] - this[2] * v[1];
					r[1] = this[2] * v[0] - this[0] * v[2];
					r[2] = this[0] * v[1] - this[1] * v[0];

					return r;					
				}},
				dot: { value: function(v) {
					return this[0] * v[0] + this[1] * v[1] + this[2] * v[2];
				}},
				add: { value: function(v) {
					this[0] += v[0];
					this[1] += v[1];
					this[2] += v[2];

					return this;
				}},
				sub: { value: function(v) {
					this[0] -= v[0];
					this[1] -= v[1];
					this[2] -= v[2];

					return this;
				}},
				mul: { value: function(v) {
					this[0] *= v[0];
					this[1] *= v[1];
					this[2] *= v[2];

					return this;
				}},
				div: { value: function(v) {
					this[0] /= v[0];
					this[1] /= v[1];
					this[2] /= v[2];

					return this;
				}},
				scale: { value: function(x, y, z) {
					this[0] *= x;
					this[1] *= y || x;
					this[2] *= z || x;

					return this;
				}},
				magnitude: {
					get: function() { return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]); },
					set: function(n) {
						var l = this.magnitude / n;

						this[0] /= l;
						this[1] /= l;
						this[2] /= l;

						return n;
					}
				}
			},

			// 4-component vector (x, y, z, w)

			// Note that for convenience in writing 3D applications, Vec4 behaves like a Vec3 with a w component.
			// This means that vector arithmetic performed with a Vec4 will not use or modify the w component.
			// As with Vec3, Vec4.cross only accepts 1 other parameter, which can be a Vec3 or Vec4.
			// The default value of w is 1.

			Vec4: {
				_superclass: 'Vec3',
				w: {
					get: function() { return this[3]; },
					set: function(n) { return this[3] = n; }	
				}
			},

			// matrix definitions, column major

			// 3x3 matrix

			Mat3: {
				_superclass: 'Copyable',
				m00: {
					get: function() { return this[0]; },
					set: function(n) { return this[0] = n; }
				},
				m10: {
					get: function() { return this[1]; },
					set: function(n) { return this[1] = n; }
				},
				m20: {
					get: function() { return this[2]; },
					set: function(n) { return this[2] = n; }
				},
				m01: {
					get: function() { return this[3]; },
					set: function(n) { return this[3] = n; }
				},
				m11: {
					get: function() { return this[4]; },
					set: function(n) { return this[4] = n; }
				},
				m21: {
					get: function() { return this[5]; },
					set: function(n) { return this[5] = n; }
				},
				m02: {
					get: function() { return this[6]; },
					set: function(n) { return this[6] = n; }
				},
				m12: {
					get: function() { return this[7]; },
					set: function(n) { return this[7] = n; }
				},
				m22: {
					get: function() { return this[8]; },
					set: function(n) { return this[8] = n; }
				}
			},

			// 4x4 matrix

			Mat4: {
				_superclass: 'Copyable',
				m00: {
					get: function() { return this[0]; },
					set: function(n) { return this[0] = n; }
				},
				m10: {
					get: function() { return this[1]; },
					set: function(n) { return this[1] = n; }
				},
				m20: {
					get: function() { return this[2]; },
					set: function(n) { return this[2] = n; }
				},
				m30: {
					get: function() { return this[3]; },
					set: function(n) { return this[3] = n; }
				},
				m01: {
					get: function() { return this[4]; },
					set: function(n) { return this[4] = n; }
				},
				m11: {
					get: function() { return this[5]; },
					set: function(n) { return this[5] = n; }
				},
				m21: {
					get: function() { return this[6]; },
					set: function(n) { return this[6] = n; }
				},
				m31: {
					get: function() { return this[7]; },
					set: function(n) { return this[7] = n; }
				},
				m02: {
					get: function() { return this[8]; },
					set: function(n) { return this[8] = n; }
				},
				m12: {
					get: function() { return this[9]; },
					set: function(n) { return this[9] = n; }
				},
				m22: {
					get: function() { return this[10]; },
					set: function(n) { return this[10] = n; }
				},
				m32: {
					get: function() { return this[11]; },
					set: function(n) { return this[11] = n; }
				},
				m03: {
					get: function() { return this[12]; },
					set: function(n) { return this[12] = n; }
				},
				m13: {
					get: function() { return this[13]; },
					set: function(n) { return this[13] = n; }
				},
				m23: {
					get: function() { return this[14]; },
					set: function(n) { return this[14] = n; }
				},
				m33: {
					get: function() { return this[15]; },
					set: function(n) { return this[15] = n; }
				}
			},
		};

	// assemble prototypes

	prototypes = GF.defineObjects({
		prototypes: prototypes,
		definitions: definitions
	});

	// create constructors

	GF.Vec2 = function(x, y) {
		var v = Object.create(prototypes.Vec2);

		v[0] = x || 0;
		v[1] = y || 0;

		return v;
	};

	GF.Vec3 = function(x, y, z) {
		var v = Object.create(prototypes.Vec3);

		v[0] = x || 0;
		v[1] = y || 0;
		v[2] = z || 0;

		return v;
	};

	GF.Vec4 = function(x, y, z, w) {
		var v = Object.create(prototypes.Vec4);

		v[0] = x || 0;
		v[1] = y || 0;
		v[2] = z || 0;
		v[3] = w || 1;

		return v;
	};

}(window.GF));
