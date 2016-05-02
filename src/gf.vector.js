;(function(GF){'use strict';
	// TODO quaternions

	if (typeof GF === 'undefined') throw new TypeError('GF is undefined - include gf.core.js first');

	//
	// Vec2 transforms
	//

	function gfCopyVec2(v, result) {
		result[0] = v[0];
		result[1] = v[1];
	}

	function gfNormalizeVec2(v, result) {
		var x = v[0],
			y = v[1],
			m = Math.sqrt(x * x + y * y);

		result[0] = x / m;
		result[1] = y / m;
	}

	function gfAddVec2(a, b, result) {
		result[0] = a[0] + b[0];
		result[1] = a[1] + b[1];
	}

	function gfSubtractVec2(a, b, result) {
		result[0] = a[0] - b[0];
		result[1] = a[1] - b[1];
	}

	function gfMultiplyVec2(a, b, result) {
		result[0] = a[0] * b[0];
		result[1] = a[1] * b[1];
	}

	function gfDivideVec2(a, b, result) {
		result[0] = a[0] / b[0];
		result[1] = a[1] / b[1];
	}

	function gfMagnitudeVec2(v) {
		var x = v[0],
			y = v[1];
		
		return Math.sqrt(x * x + y * y);
	}

	function gfDotVec2(a, b) {
		return a[0] * b[0] + a[1] * b[1];
	}

	//
	// Vec3 operations
	//

	function gfCopyVec3(v, result) {
		result[0] = v[0];
		result[1] = v[1];
		result[2] = v[2];
	}

	function gfNormalizeVec3(v, result) {
		var x = v[0],
			y = v[1],
			z = v[2],
			m = Math.sqrt(x * x + y * y + z * z);

		result[0] = x / m;
		result[1] = y / m;
		result[2] = z / m;
	}

	function gfAddVec3(a, b, result) {
		result[0] = a[0] + b[0];
		result[1] = a[1] + b[1];
		result[2] = a[2] + b[2];
	}

	function gfSubtractVec3(a, b, result) {
		result[0] = a[0] - b[0];
		result[1] = a[1] - b[1];
		result[2] = a[2] - b[2];
	}

	function gfMultiplyVec3(a, b, result) {
		result[0] = a[0] * b[0];
		result[1] = a[1] * b[1];
		result[2] = a[2] * b[2];
	}

	function gfDivideVec3(a, b, result) {
		result[0] = a[0] / b[0];
		result[1] = a[1] / b[1];
		result[2] = a[2] / b[2];
	}

	function gfMagnitudeVec3(v) {
		var x = v[0],
			y = v[1],
			z = v[2];
		
		return Math.sqrt(x * x + y * y + z * z);
	}

	function gfDotVec3(a, b) {
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	function gfCrossVec3(a, b, result) {
		var a0 = a[0],
			a1 = a[1],
			a2 = a[2],
			b0 = b[0],
			b1 = b[1],
			b2 = b[2];

		result[0] = a1 * b2 - a2 * b1;
		result[1] = a2 * b0 - a0 * b2;
		result[2] = a0 * b1 - a1 * b0;
	}

	//
	// Vec4 copy, the only operation that requires setting the w component
	//

	function gfCopyVec4(v, result) {
		result[0] = v[0];
		result[1] = v[1];
		result[2] = v[2];
		result[3] = v[3];
	}

	//
	// Mat3 operations
	//

	function gfCopyMat3(m, result) {
		result[0] = m[0];
		result[1] = m[1];
		result[2] = m[2];
		
		result[3] = m[3];
		result[4] = m[4];
		result[5] = m[5];

		result[6] = m[6];
		result[7] = m[7];
		result[8] = m[8];
	}

	function gfMultiplyMat3(a, b, result) {
		var a00 = a[0], a10 = a[1], a20 = a[2],
			a01 = a[3], a11 = a[4], a21 = a[5],
			a02 = a[6], a12 = a[7], a22 = a[8],
			b00 = b[0], b10 = b[1], b20 = b[2],
			b01 = b[2], b11 = b[3], b21 = b[4],
			b02 = b[5], b12 = b[6], b22 = b[7];

		result[0] = a00 * b00 + a10 * b01 + a20 * b02;
		result[1] = a00 * b10 + a10 * b11 + a20 * b12;
		result[2] = a00 * b20 + a10 * b21 + a20 * b22;

		result[3] = a01 * b00 + a11 * b01 + a21 * b02;
		result[4] = a01 * b10 + a11 * b11 + a21 * b12;
		result[5] = a01 * b20 + a11 * b21 + a21 * b22;

		result[6] = a02 * b00 + a12 * b01 + a22 * b02;
		result[7] = a02 * b10 + a12 * b11 + a22 * b12;
		result[8] = a02 * b20 + a12 * b21 + a22 * b22;
	}

	function gfMultiplyMat3ByVector(m, v, result) {
		var v0 = v[0],
			v1 = v[1],
			v2 = v[2];

		result[0] = v0 * m[0] + v1 * m[1] + v2 * m[2];
		result[1] = v0 * m[3] + v1 * m[4] + v2 * m[5];
		result[2] = v0 * m[6] + v1 * m[7] + v2 * m[8];
	}

	function gfTransposeMat3(m, result) {
		result[0] = m[0];
		result[1] = m[3];
		result[2] = m[6];

		result[3] = m[1];
		result[4] = m[4];
		result[5] = m[7];

		result[6] = m[2];
		result[7] = m[5];
		result[8] = m[8];
	}

	function gfTransposeSelfMat3(m) {
		var m10 = m[1],
			m20 = m[2],
			m21 = m[5];

		m[1] = m[3];
		m[2] = m[6];
		m[5] = m[7];

		m[3] = m10;
		m[6] = m20;
		m[7] = m21;
	}

	function gfInverseMat3(m, result) {
		var m00 = m[0], m10 = m[1], m20 = m[2],
			m01 = m[3], m11 = m[4], m21 = m[5],
			m02 = m[6], m11 = m[7], m21 = m[8];

		result[0] = m11 * m22 - m12 * m21;
		result[1] = m12 * m20 - m10 * m22;
		result[2] = m10 * m21 - m11 * m20;

		result[3] = m02 * m21 - m01 * m22;
		result[4] = m00 * m22 - m02 * m20;
		result[5] = m01 * m20 - m00 * m21;

		result[6] = a01 * m12 - m02 * m11;
		result[7] = m02 * m10 - m00 * m12;
		result[8] = m00 * m11 - m01 * m10;

		var d = 1 / (m00 * result[0] + m01 * result[1] + m02 * result[2]);

		result[0] *= d;
		result[1] *= d;
		result[2] *= d;

		result[3] *= d;
		result[4] *= d;
		result[5] *= d;

		result[6] *= d;
		result[7] *= d;
		result[8] *= d;
	}

	function gfDeterminantMat3(m) {
		var m00 = m[0], m10 = m[1], m20 = m[2],
			m01 = m[3], m11 = m[4], m21 = m[5],
			m02 = m[6], m12 = m[7], m23 = m[8];

		return m00 * (m11 * m22 - m32 * m23)
			+ m10 * (m21 * m02 - m01 * m22)
			+ m20 * (m01 * m12 - m11 * m02);
	}

	function gfIdentityMat3(result) {
		result[0] = result[4] = result[8] = 1;
		result[1] = result[2] = result[3] = result[5] = result[6] = result[7] = 0;
	}

	//
	// Mat4 operations
	//

	function gfCopyMat4(m, result) {
		result[0] = m[0];
		result[1] = m[1];
		result[2] = m[2];
		result[3] = m[3];

		result[4] = m[4];
		result[5] = m[5];
		result[6] = m[6];
		result[7] = m[7];

		result[8] = m[8];
		result[9] = m[9];
		result[10] = m[10];
		result[11] = m[11];

		result[12] = m[12];
		result[13] = m[13];
		result[14] = m[14];
		result[15] = m[15];
	}

	function gfMultiplyMat4(a, b, result) {
		var a00 = a[0], a10 = a[1], a20 = a[2], a30 = a[3],
			a01 = a[4], a11 = a[5], a21 = a[6], a31 = a[7],
			a02 = a[8], a12 = a[9], a22 = a[10], a32 = a[11],
			a03 = a[12], a13 = a[13], a23 = a[14], a33 = a[15],
			b00 = b[0], b10 = b[1], b20 = b[2], b30 = b[3],
			b01 = b[4], b11 = b[5], b21 = b[6], b31 = b[7],
			b02 = b[8], b12 = b[9], b22 = b[10], b32 = b[11],
			b03 = b[12], b13 = b[13], b23 = b[14], b33 = b[15];

		result[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
		result[1] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
		result[2] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
		result[3] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;

		result[4] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
		result[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
		result[6] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
		result[7] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;

		result[8] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
		result[9] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
		result[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
		result[11] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;

		result[12] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
		result[13] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
		result[14] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
		result[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
	}

	function gfMultiplyMat4ByVector(m, v, result) {
		var v0 = v[0],
			v1 = v[1],
			v2 = v[2],
			v3 = v[3];

		result[0] = v0 * m[0] + v1 * m[1] + v2 * m[2] + v3 * m[3];
		result[1] = v0 * m[4] + v1 * m[5] + v2 * m[6] + v3 * m[7];
		result[2] = v0 * m[8] + v1 * m[9] + v2 * m[10] + v3 * m[11];
		result[3] = v0 * m[12] + v1 * m[13] + v2 * m[14] + v3 * m[15];
	}

	function gfTransposeMat4(m, result) {
		result[0] = m[0];
		result[1] = m[4];
		result[2] = m[8];
		result[3] = m[12];

		result[4] = m[1];
		result[5] = m[5];
		result[6] = m[9];
		result[7] = m[13];

		result[8] = m[2];
		result[9] = m[6];
		result[10] = m[10];
		result[11] = m[14];

		result[12] = m[3];
		result[13] = m[7];
		result[14] = m[11];
		result[15] = m[15];
	}

	function gfTransposeSelfMat4(m) {
		var m10 = m[1], m20 = m[2], m30 = m[3],
			m21 = m[6], m31 = m[7],
			m32 = m[11];

		m[1] = m[4];
		m[2] = m[8];
		m[3] = m[12];
		m[6] = m[9];
		m[7] = m[13];
		m[11] = m[14];

		m[4] = m10;
		m[8] = m20;
		m[12] = m30;
		m[9] = m21;
		m[13] = m31;
		m[14] = m32;
	}

	function gfInverseMat4(m, result) {
		var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3],
			m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7],
			m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11],
			m12 = m[12], m13 = m[13], m14 = m[14], m15 = m[15],
			m4m14 = m4 * m14,
			m10m12 = m10 * m12,
			m1m14 = m1 * m14,
			m3m12 = m3 * m12,
			m2m12 = m2 * m12,
			m1m10 = m1 * m10,
			m6m9 = m6 * m9,
			m6m15 = m6 * m15,
			m9m15 = m9 * m15,
			m7m9 = m7 * m9,
			m2m4 = m2 * m4,
			m2m13 = m2 * m13,
			m6m11 = m6 * m11,
			m7m8 = m7 * m8,
			m5m15 = m5 * m15,
			m0m14 = m0 * m14,
			m3m8 = m3 * m8,
			m0m13 = m0 * m13,
			m6m8 = m6 * m8,
			m5m8 = m5 * m8,
			m1m4 = m1 * m4,
			m3m4 = m3 * m4,
			m4m13 = m4 * m13,
			m1m12 = m1 * m12,
			m0m10 = m0 * m10,
			m8m15 = m8 * m15,
			m10m13 = m10 * m13,
			m3m14 = m3 * m14;

		result[0] = m5m15 * m10
			- m5m11 * m14
			- m6m9 * m15
			+ m7m9 * m14
			+ m6m11 * m13
			- m10m13 * m7;

		result[1] = m4m14 * m11
			+ m6m15 * m8
			- m7m8 * m14
			- m4 * m10 * m15
			- m6m11 * m12
			+ m10m12 * m7;

		result[2] = m9m15 * m4
			- m4m13 * m11
			- m5m15 * m8
			+ m7m8 * m13
			+ m5m11 * m12
			- m7m9 * m12;

		result[3] = m4m13 * m10
			+ m5m8 * m14
			- m6m8 * m13
			- m4m14 * m9
			- m10m12 * m5
			+ m6m9 * m12;

		result[4] = m1m14 * m11
			+ m9m15 * m2
			- m3m14 * m9
			- m1m10 * m15
			- m2m13 * m11
			+ m10m13 * m3;

		result[5] = m0m10 * m15
			- m0m14 * m11
			- m8m15 * m2
			+ m3m8 * m14
			+ m2m12 * m11
			- m10m12 * m3;

		result[6] = m0m13 * m11
			+ m8m15 * m1
			- m3m8 * m13
			- m9m15 * m0
			- m1m12 * m11
			+ m3m12 * m9;

		result[7] = m0m14 * m9
			- m0m13 * m10
			- m1m14 * m8
			+ m2m13 * m8
			+ m10m12 * m1
			- m2m12 * m9;

		result[8] = m6m15 * m1
			- m1m14 * m7
			- m5m15 * m2
			+ m3m14 * m5
			+ m2m13 * m7
			- m13 * m3 * m6;

		result[9] = m0m14 * m7
			+ m2m4 * m15
			- m4m14 * m3
			- m6m15 * m0
			- m2m12 * m7
			+ m3m12 * m6;

		result[10] = m5m15 * m0
			- m0m13  * m7
			- m1m4 * m15
			+ m3m4 * m13
			+ m1m12 * m7
			- m3m12 * m5;

		result[11] = m0m13 * m6
			+ m4m14 * m1
			- m2m4 * m13
			- m0m14 * m5
			- m1m12 * m6
			+ m2m12 * m5;

		result[12] = m1m10 * m7
			+ m5m11 * m2
			- m3m10 * m5
			- m6m11 * m1
			- m7m9 * m2
			+ m6m9 * m3;

		result[13] = m6m11 * m0
			- m0m10 * m7
			- m2m4 * m11
			+ m3m10 * m4
			+ m7m8 * m2
			- m3m8 * m6;

		result[14] = m7m9 * m0
			+ m1m4 * m11
			- m3m4 * m9
			- m5m11 * m0
			- m7m8 * m1
			+ m3m8 * m5;

		result[15] = m0m10 * m5
			- m6m9 * m0
			- m1m10 * m4
			+ m2m4 * m9
			+ m6m8 * m1
			- m5m8 * m2;

		var d = 1 / (m0 * result[0] + m1 * result[1] + m2 * result[2] + m3 * result[3]);

		result[0] *= d;
		result[1] *= d;
		result[2] *= d;
		result[3] *= d;

		result[4] *= d;
		result[5] *= d;
		result[6] *= d;
		result[7] *= d;
		
		result[8] *= d;
		result[9] *= d;
		result[10] *= d;
		result[11] *= d;
		
		result[12] *= d;
		result[13] *= d;
		result[14] *= d;
		result[15] *= d;
	}

	function gfDeterminantMat4(m) {
		var m00 = m[0], m10 = m[1], m20 = m[2], m30 = m[3],
			m01 = m[4], m11 = m[5], m21 = m[6], m31 = m[7],
			m02 = m[8], m12 = m[9], m22 = m[10], m32 = m[11],
			m03 = m[12], m13 = m[13], m23 = m[14], m33 = m[15],
			m03m12 = m03 * m12,
			m02m13 = m02 * m13,
			m01m13 = m01 * m13,
			m03m11 = m03 * m11,
			m02m11 = m02 * m11,
			m01m12 = m01 * m12,
			m03m10 = m03 * m10,
			m00m13 = m00 * m13,
			m00m12 = m00 * m12,
			m02m10 = m02 * m10,
			m01m10 = m01 * m10,
			m00m11 = m00 * m11;
		
		return m21 * m30 * (m03m12 - m02m13)
			+ m22 * m30 * (m01m13 - m03m11)
			+ m23 * m30 * (m02m11 - m01m12)
			+ m20 * m31 * (m02m13 - m03m12)
			+ m22 * m31 * (m03m10 - m00m13)
			+ m23 * m31 * (m00m12 - m02m10)
			+ m20 * m32 * (m03m11 - m01m13)
			+ m21 * m32 * (m00m13 - m03m10)
			+ m23 * m32 * (m01m10 - m00m11)
			+ m20 * m33 * (m01m12 - m02m11)
			+ m21 * m33 * (m02m10 - m00m12)
			+ m22 * m33 * (m00m11 - m01m10);
	}

	function gfIdentityMat4(result) {
		result[0] = result[5] = result[10] = result[15] = 1;
		result[1] = result[2] = result[3] = result[4] = result[6] = result[7] = result[8] = result[9] = result[11] = result[12] = result[13] = result[14] = 0;
	}

	//
	// expose methods in GF namespace for people who want pretty code, or bracket access?
	//

	GF.copyVec2 = gfCopyVec2;
	GF.normalizeVec2 = gfNormalizeVec2;
	GF.addVec2 = gfAddVec2;
	GF.subtractVec2 = gfSubtractVec2;
	GF.multiplyVec2 = gfMultiplyVec2;
	GF.divideVec2 = gfDivideVec2;
	GF.magnitudeVec2 = gfMagnitudeVec2;
	GF.dotVec2 = gfDotVec2;

	GF.copyVec3 = gfCopyVec3;
	GF.normalizeVec4 = GF.normalizeVec3 = gfNormalizeVec3;
	GF.addVec4 = GF.addVec3 = gfAddVec3;
	GF.subtractVec4 = GF.subtractVec3 = gfSubtractVec3;
	GF.multiplyVec4 = GF.multiplyVec3 = gfMultiplyVec3;
	GF.divideVec4 = GF.divideVec3 = gfDivideVec3;
	GF.magnitudeVec4 = GF.magnitudeVec3 = gfMagnitudeVec3;
	GF.crossVec4 = GF.crossVec3 = gfCrossVec3;
	GF.dotVec4 = GF.dotVec3 = gfDotVec3;

	GF.copyVec4 = gfCopyVec4;

	GF.copyMat3 = gfCopyMat3;
	GF.determinantMat3 = gfDeterminantMat3;
	GF.multiplyMat3 = gfMultiplyMat3;
	GF.multiplyMat3ByVector = gfMultiplyMat3ByVector;
	GF.transposeMat3 = gfTransposeMat3;
	GF.transposeSelfMat3 = gfTransposeSelfMat3;
	GF.inverseMat3 = gfInverseMat3;
	GF.determinantMat3 = gfDeterminantMat3;
	GF.identityMat3 = gfIdentityMat3;

	GF.copyMat4 = gfCopyMat4;
	GF.determinantMat4 = gfDeterminantMat4;
	GF.multiplyMat4 = gfMultiplyMat4;
	GF.multiplyMat4ByVector = gfMultiplyMat4ByVector;
	GF.transposeMat4 = gfTransposeMat4;
	GF.transposeSelfMat4 = gfTransposeSelfMat4;
	GF.inverseMat4 = gfInverseMat4;
	GF.determinantMat4 = gfDeterminantMat4;
	GF.identityMat4 = gfIdentityMat4;

	var upVector = new Float32Array(4),
		degreesToRadians = Math.PI / 180,
		angleEpsilon = 0.00001;

	upVector[1] = upVector[3] = 1;

	GF.MatrixStack = function(initialSize, growAmount) {
		var size = initialSize || 64,
			grow = growAmount || size,
			pool = [],
			top,
			stack = [new Float32Array(16)],
			operand = new Float32Array(16),
			eyePos = new Float32Array(4),
			eyeDir = new Float32Array(4),
			upDir = new Float32Array(4),
			_public;

		eyePos[3] = eyeDir[3] = upDir[3] = upDir[1] = 1;

		function expandPool(n) {
			for (var i = 0; i < n; ++i) {
				pool.push(new Float32Array(16));
			}
		}

		function pushSafe() {
			if (pool.length === 0) {
				expandPool(grow);
			}

			return push();
		}

		function push() {
			var newTop = pool.pop();

			stack.push(top);

			gfCopyMat4(top, newTop);
			top = newTop;

			return _public;
		}

		function popSafe() {
			if (stack.length === 0) {
				return undefined;
			}

			return pop();
		}

		function pop() {
			pool.push(top);
			return top = stack.pop();
		}

		function peek() {
			return top;
		}

		function identity() {
			gfIdentityMat4(top);

			return _public;
		}

		function transform(m) {
			gfMultiplyMat4(top, m, top);

			return _public;
		}

		function translate(x, y, z) {
			operand[12] = x;
			operand[13] = y;
			operand[14] = z;

			gfMultiplyMat4(operand, top, top);

			operand[12] = operand[13] = operand[14] = 0;

			return _public;
		}

		function translateTo(x, y, z) {
			top[12] = x;
			top[13] = y;
			top[14] = z;

			return _public;
		}

		function scale(x, y, z) {
			operand[0] = x;
			operand[5] = y;
			operand[10] = z;

			gfMultiplyMat4(operand, top, top);

			operand[0] = operand[5] = operand[10] = 1;

			return _public;
		}

		function rotateX(a) {
			var radians = degreesToRadians * a,
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			operand[5] = operand[10] = cos;
			operand[6] = -sin;
			operand[9] = sin;

			gfMultiplyMat4(operand, top, top);

			operand[5] = operand[10] = 1;
			operand[6] = operand[9] = 0;

			return _public;
		}

		function rotateY(a) {
			var radians = degreesToRadians * a,
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			operand[0] = operand[10] = cos;
			operand[2] = sin;
			operand[8] = -sin;

			gfMultiplyMat4(operand, top, top);

			operand[0] = operand[10] = 1;
			operand[2] = operand[8] = 0;

			return _public;
		}

		function rotateZ(a) {
			var radians = degreesToRadians * a,
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			operand[0] = operand[5] = cos;
			operand[1] = -sin;
			operand[4] = sin;

			gfMultiplyMat4(operand, top, top);

			operand[0] = operand[5] = 1;
			operand[1] = operand[4] = 0;

			return _public;
		}

		function rotateZYX(z, y, x) {
			var xRadians = degreesToRadians * x,
				yRadians = degreesToRadians * y,
				zRadians = degreesToRadians * z,
				cx = Math.cos(xRadians),
				cy = Math.cos(yRadians),
				cz = Math.cos(zRadians),
				sx = Math.sin(xRadians),
				sy = Math.sin(yRadians),
				sz = Math.sin(zRadians),
				cxsy = cx * sy;

			operand[0] = cy * cz;
            operand[1] = cxsy * sx - cx * sz;
            operand[2] = cxsy * cz;

            operand[4] = cy * sz;
            operand[5] = cx * cz + sx * sy * sz;
            operand[6] = cxsy * sz - cz * sx;

            operand[8] = -sy;
            operand[9] = cy * sx;
            operand[10] = cx * cy;

            gfMultiplyMat4(operand, top, top);

            operand[0] = operand[5] = operand[10] = 1;
            operand[1] = operand[2] = operand[4] = operand[6] = operand[8] = operand[9] = 0;

			return _public;
		}

		function rotateYXZ(y, x, z) {
			// TODO fix - y works, xz are broke
			var xRadians = degreesToRadians * x,
				yRadians = degreesToRadians * y,
				zRadians = degreesToRadians * z,
				cx = Math.cos(xRadians),
				cy = Math.cos(yRadians),
				cz = Math.cos(zRadians),
				sx = Math.sin(xRadians),
				sy = Math.sin(yRadians),
				sz = Math.sin(zRadians),
				cysx = cy * sx;

            operand[0] = cy * cz + sx * sy * sz;
            operand[1] = cz * sx * sy - cy * sz;
            operand[2] = cx * sy;

            operand[4] = cx * sx;
            operand[5] = cx * cz;
            operand[6] = -sx;

            operand[8] = cysx * sz - cz * sy;
            operand[9] = cysx * cz + sy * sz;
            operand[10] = cx * cy;

            gfMultiplyMat4(operand, top, top);

            operand[0] = operand[5] = operand[10] = 1;
            operand[1] = operand[2] = operand[4] = operand[6] = operand[8] = operand[9] = 0;

			return _public;
		}

		function clearRotation() {
            operand[0] = operand[5] = operand[10] = 1;
            operand[1] = operand[2] = operand[4] = operand[6] = operand[8] = operand[9] = 0;

			return _public;
		}

		function lookAt(target, up) {
			eyePos[0] = -top[12];
			eyePos[1] = -top[13];
			eyePos[2] = -top[14];

			gfSubtractVec3(target, eyePos, eyeDir);
			gfNormalizeVec3(eyeDir, eyeDir);

			gfCopyVec3(up || upVector, upDir);

			if (gfDotVec3(eyeDir, upDir) < angleEpsilon - 1) {
				upDir[0] += angleEpsilon;
				upDir[1] += angleEpsilon;
				upDir[2] += angleEpsilon;

				gfNormalizeVec3(upDir, upDir);
			}

			gfCrossVec3(eyeDir, upDir, eyePos);
			gfNormalizeVec3(eyePos, eyePos);

			gfCrossVec3(eyePos, eyeDir, upDir);

			top[0] = eyePos[0];
			top[4] = eyePos[1];
			top[8] = eyePos[2];

			top[1] = upDir[0];
			top[5] = upDir[1];
			top[9] = upDir[2];

			top[2] = eyeDir[0];
			top[6] = eyeDir[1];
			top[10] = eyeDir[2];

			return _public;
		}

		gfIdentityMat4(top = stack[0]);
		gfIdentityMat4(operand);

		expandPool(size);

		return _public = {
			pushSafe: pushSafe,
			push: push,
			popSafe: popSafe,
			pop: pop,
			peek: peek,
			identity: identity,
			transform: transform,
			translate: translate,
			translateTo: translateTo,
			scale: scale,
			rotateX: rotateX,
			rotateY: rotateY,
			rotateZ: rotateZ,
			rotateZYX: rotateZYX,
			rotateYXZ: rotateYXZ,
			clearRotation: clearRotation,
			lookAt: lookAt
		};
	};

	// static MatrixStack methods 

	GF.MatrixStack.createOrtho = function(x1, y1, x2, y2) {
		var dx = x2 - x1,
			dy = y2 - y1,
			result = new Float32Array(16);

		result[0] = 2 / dx;
		result[5] = 2 / dy;
		result[10] = result[15] = 1;
		result[12] = x1 + x2 / -dx;
		result[13] = y1 + y2 / -dy;

		result[1] = result[2] = result[3] = result[4] = result[6] = 0;
		result[7] = result[8] = result[9] = result[11] = result[14] = 0;

		return result;
	}

	GF.MatrixStack.createPerspectiveFromFOV = function(fov, aspect, near, far) {
		// TODO test near/far and
		var ys = 1 / Math.tan(degreesToRadians * fov / 2),
			l = far - near,
			result = new Float32Array(16);

		result[0] = -ys / aspect;
		result[5] = ys;
		result[10] = far / l;
		result[11] = -near * far / l;
		result[14] = 1;

		result[1] = result[2] = result[3] = result[4] = 0;
		result[6] = result[7] = result[8] = result[9] = 0;
		result[12] = result[13] = result[15] = 0;
		
		return result;
	}

	GF.MatrixStack.createPerspectiveFromBounds = function(top, bottom, left, right, near, far) {
		var dx = right - left,
			dy = top - bottom,
			dz = far - near,
			n2 = 2 * near,
			result = new Float32Array(16);

		result[0] = n2 / dx;
		result[2] = (left + right) / dx;
		result[5] = n2 / dy;
		result[6] = (top + bottom) / dy;
		result[10] = -(far + near) / l;
		result[11] = -n2 * far / l;
		result[14] = -1;

		result[1] = result[3] = result[4] = 0;
		result[7] = result[8] = result[9] = 0;
		result[12] = result[13] = result[15] = 0;

		return result;
	}

}(window.GF));
