/**
 * create by luqingyi
 * 2018.6.26
 * version 0.1
 * 
 * Descript:
 * if you want create a small 3d project,and you has not basic for 3d,then L3D  probably let you come in 3D world.
 * 
 * you must need three javascript files:
 * L3D.js , L.js , three.js
 * and other javascript files on my github ,if you need ,you can download.
 * 
 * my gitgub : https://github.com/LoooChy
 * 
 */
import L from './L.js';
import * as THREE from './threeMoudle.js';
import './OrbitControls.js';
let _this;
class L3D {
    constructor(object) {
        _this = this;
        _this.scene = new THREE.Scene();
        _this.params = {
            box: L.select(object.el),
            width: object.viewport[0],
            height: object.viewport[1],
            allMesh: [],
            INTERSECTED: null,
            allObject: object,
            clock: new THREE.Clock(),
            controls: null,
            version: 0.1
        }
        console.log("L3D " + _this.params.version + " DEV");
        _this.init(object);
        // console.log(_this);


    }

    init(object) {
        _this.initRender(object);
        _this.initCamera(object);
        _this.initLight(object);
        _this.initAxis(object);
        _this.initObject(object);
        _this.render(object);
        _this.bindHandler(object);
    }

    initRender(object) {
        _this.renderer = new THREE.WebGLRenderer({
            antialias: object.render.antialias,
            alpha: object.render.alpha,
        });
        object.render.alpha ? _this.renderer.setClearColor(0xffffff, 0) : _this.renderer.setClearColor(0xffffff, 1);
        // _this.renderer.shadowMapEnabled = true;
        _this.renderer.setSize(_this.params.width, _this.params.height);
        L.select(object.el).append(_this.renderer.domElement);
    }

    initCamera(object) {
        _this.camera = new THREE.PerspectiveCamera(45, _this.params.width / _this.params.height, 1, 1000);
        _this.camera.position.set(...object.camera.position);
        object.camera.controls ? _this.params.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement) : _this.scene.add(_this.camera);
    }

    initLight() {

    }

    initAxis(object) {
        if (object.axis.isOpen) {
            var axes = new THREE.AxisHelper(object.axis.length);
            _this.scene.add(axes)
        }
    }

    initObject() {

    }

    render() {
        _this.animate(_this);
        requestAnimationFrame(_this.render)
    }

    animate() {
        _this.renderer.render(_this.scene,_this.camera)
    }

    loaderModle() {

    }

    animateFn() {

    }

    bindHandler() {

    }

    onResize() {

    }

    ray() {

    }

    creatPlanMessage() {

    }

    createBox() {

    }

    createSpehre() {

    }
}

export default L3D