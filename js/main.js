import * as THREE from "./lib/three.module.js";

var container;
var camera, scene, renderer;
var sphere = null;
var clock = new THREE.Clock(), time = 0.0;
var loader = new THREE.TextureLoader();

init();

animate();

shader();

function init() 
{
   container = document.getElementById( 'container' );

   scene = new THREE.Scene();

   camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
   camera.position.set(300, 200, 300);
   camera.lookAt(new THREE.Vector3(0, 0, 0));

   renderer = new THREE.WebGLRenderer( { antialias: false } );
   renderer.setSize( window.innerWidth, window.innerHeight );
   renderer.setClearColor( 0xffaaaaff, 1);
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   container.appendChild( renderer.domElement );

   window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize()
{
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();

   renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate()
{
    time += clock.getDelta();
    
    if (sphere != null)
    {
        //sphere.material.uniforms.amplitude.value = Math.sin(time) * 5
        sphere.rotation.y = time;
    }
        

    requestAnimationFrame( animate );
    render();
}

function render()
{
   renderer.render( scene, camera );
}

function shader()
{
    var geometry = new THREE.SphereGeometry( 100, 64, 64 );
    //var earthTexture = loader.load('imgs/earth_atmos_2048.jpg');
    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            lightPosition: { value: new THREE.Vector3(10000.0, 0.0, 2500.0) },
            color: { value: new THREE.Vector4(0.6, 0.2, 1.0, 1.0) },
            ambientColor: { value: new THREE.Vector4(0.2, 0.2, 0.2, 1.0) },
            lightColor: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
            amplitude: { value: 1.0 },
            dayTexture: { value: loader.load('imgs/earth_atmos_2048.jpg') },
            nightTexture: { value: loader.load('imgs/earth_lights_2048.png') },
            //normalMap: { value: loader.load('imgs/earth_normal_2048.jpg') }
            normalMap: { value: loader.load('imgs/NormalMap.jpg') }
        },
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
        });
    
    sphere = new THREE.Mesh( geometry, shaderMaterial );
    scene.add( sphere );

    var displacement = new Float32Array(geometry.attributes.position.array.length)

    for (var i = 0; i < geometry.attributes.position.array.length; i++)
    {
        var rand = (Math.random() * 2) - 1;
        displacement[i] = rand;
    }
    
    geometry.setAttribute("displacement", new THREE.BufferAttribute (displacement, 1))
    geometry.computeTangents();
}