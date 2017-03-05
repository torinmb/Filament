
importScripts('three.js');
importScripts('TessellateModifier.js');

onmessage = function(e) {
	var geomToUpdate = e.data[0]; //'A' or 'B'
	var selectedGeometry = e.data[1]; 
	var size = e.data[2];
	var detail = e.data[3];
	var geometry;

	if ( selectedGeometry == "Plane" ) {
		geometry = new THREE.PlaneBufferGeometry(size, size, detail, detail).toNonIndexed();
	} else if( selectedGeometry == "Sphere" ) {
		geometry = new THREE.SphereBufferGeometry(size / 2.0, detail, detail).toNonIndexed();
	} else if( selectedGeometry == "Solid Sphere" ) {
		var triangleSize = e.data[4];
		// var triangleSize = 30.0;
		geometry = generateSolidSphereGeometry(size, detail * 4, triangleSize).toNonIndexed();
	} else if ( selectedGeometry == "Text" ) {
		var font = e.data[4];
		var text = e.data[5];
		tempFont = new THREE.Font();
		tempFont.data = font.data;
		font = tempFont;

		geometry = generateText(size, detail, font, text);
	}
	postMessage([geomToUpdate, geometry]);
}

function generateSolidSphereGeometry(size, detail, triangleSize) {

	var triangles = Math.round(detail * 100);

	var geometry = new THREE.BufferGeometry();

	var indices = new Uint32Array( triangles * 3 );

	for ( var i = 0; i < indices.length; i ++ ) {
		indices[ i ] = i;
	}

	var positions = new Float32Array( triangles * 3 * 3 );
	var normals = new Int16Array( triangles * 3 * 3 );
	var colors = new Uint8Array( triangles * 3 * 3 );

	var color = new THREE.Color();

	var n = Math.round(size);	// triangles spread in the sphere
	var d = Math.round(triangleSize), d2 = d/2;	// individual triangle size

	var pA = new THREE.Vector3();
	var pB = new THREE.Vector3();
	var pC = new THREE.Vector3();

	var cb = new THREE.Vector3();
	var ab = new THREE.Vector3();
	
	var sphereRaduis = n / 3;

	for ( var i = 0; i < positions.length; i += 9 ) {
		var x = Math.random() * n -  n / 2;
		var y = Math.random() * n -  n / 2;
		var z = Math.random() * n -  n / 2;
		while(Math.sqrt(x * x + y * y + z * z) > sphereRaduis) {
			x = Math.random() * n -  n / 2;
			y = Math.random() * n -  n / 2;
			z = Math.random() * n -  n / 2;
		}

		var ax = x + Math.random() * d - d2;
		var ay = y + Math.random() * d - d2;
		var az = z + Math.random() * d - d2;

		var bx = x + Math.random() * d - d2;
		var by = y + Math.random() * d - d2;
		var bz = z + Math.random() * d - d2;

		var cx = x + Math.random() * d - d2;
		var cy = y + Math.random() * d - d2;
		var cz = z + Math.random() * d - d2;

		positions[ i ]     = ax;
		positions[ i + 1 ] = ay;
		positions[ i + 2 ] = az;

		positions[ i + 3 ] = bx;
		positions[ i + 4 ] = by;
		positions[ i + 5 ] = bz;

		positions[ i + 6 ] = cx;
		positions[ i + 7 ] = cy;
		positions[ i + 8 ] = cz;

		// flat face normals

		pA.set( ax, ay, az );
		pB.set( bx, by, bz );
		pC.set( cx, cy, cz );

		cb.subVectors( pC, pB );
		ab.subVectors( pA, pB );
		cb.cross( ab );

		cb.normalize();

		var nx = cb.x;
		var ny = cb.y;
		var nz = cb.z;

		normals[ i ]     = nx * 32767;
		normals[ i + 1 ] = ny * 32767;
		normals[ i + 2 ] = nz * 32767;

		normals[ i + 3 ] = nx * 32767;
		normals[ i + 4 ] = ny * 32767;
		normals[ i + 5 ] = nz * 32767;

		normals[ i + 6 ] = nx * 32767;
		normals[ i + 7 ] = ny * 32767;
		normals[ i + 8 ] = nz * 32767;

	}

	geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3, true ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true ) );
	geometry.computeBoundingSphere();

	return geometry;				
}


function generateText(size, detail, font, text) {
	
	var geometry = new THREE.TextGeometry( text, {
		font: font,
		size: size/10.0,
		height: 5,
		curveSegments: detail*10.0,
		bevelThickness: 10,
		bevelSize: 1,
		bevelEnabled: true
	});

	var tessellateModifier = new THREE.TessellateModifier( 5 );

	for ( var i = 0; i < 6; i ++ ) {
		tessellateModifier.modify( geometry );
	}
	
	var t = new THREE.BufferGeometry().fromGeometry( geometry );
	t.computeBoundingBox();
	t.computeVertexNormals();
	t.center();


	return t;
}