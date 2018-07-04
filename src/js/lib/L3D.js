/**
 * create by luqingyi
 * 2018.6.26
 * version 0.1
 * 
 * Descript:
 * if you want create a small 3d project,and you has not basic for 3d,then L3D  probably let you come in 3D world.
 * 
 * you must need two javascript files:
 * L3D.js , L.js , three.js
 * and other javascript files on my github ,if you need ,you can download.
 * 
 * my gitgub : https://github.com/LoooChy
 * 
 */
import L from './L.js';
import * as THREE from './threeMoudle.js';
import './OrbitControls.js';
import './loaders/MTLLoader.js';
import './loaders/OBJLoader.js';
import './loaders/STLLoader.js';
import './loaders/FBXLoader.js';
import './NURBSCurve.js';
import './NURBSSurface.js';
import './NURBSUtils.js';



import TWEEN from  './tween.min.js';

// import  MyModule from './loaders/inflate.min.js';
// console.log(MyModule(),"ddd")
// require('./loaders/inflate.min.js')

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
        _this.createObj(object);
        _this.render(object);
        _this.bindHandler(object);
    }

    initRender(object) {
        _this.renderer = new THREE.WebGLRenderer({
            antialias: object.render.antialias, //开启抗锯齿
            alpha: object.render.alpha,//背景透明
            // logarithmicDepthBuffer: true //解决z-fighting alpha:true
        });
        object.render.alpha ? _this.renderer.setClearColor(0xffffff, 0) : _this.renderer.setClearColor(0xffffff, 1)
        _this.renderer.shadowMapEnabled = true;
        _this.renderer.setSize(_this.params.width, _this.params.height);
        L.select(object.el).append(_this.renderer.domElement);
    }

    initCamera(object) {
        _this.camera = new THREE.PerspectiveCamera(45, _this.params.width / _this.params.height, 1, 1000);
        _this.camera.position.set(...object.camera.position);
        object.camera.controls ? _this.params.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement) : _this.scene.add(_this.camera);
    }

    initLight(obj) {
        for (var i = 0; i < obj.light.length; i++) {
            switch (obj.light[i].type) {
                case "环境光":
                    var hemiLight = new THREE.HemisphereLight(obj.light[i].color, obj.light[i].color, obj.light[i].intensity);
                    hemiLight.position.set(obj.light[i].position[0], obj.light[i].position[1], obj.light[i].position[2]);
                    hemiLight.name = obj.light[i].name
                    _this.scene.add(hemiLight);
                    break;
                case "平行光":
                    var dir = new THREE.DirectionalLight(obj.light[i].color);
                    dir.position.set(obj.light[i].position[0], obj.light[i].position[1], obj.light[i].position[2]);
                    dir.name = obj.light[i].name
                    _this.scene.add(dir);
                    break;
                case "点光源":
                    var point = new THREE.PointLight(obj.light[i].color);
                    point.position.set(obj.light[i].position[0], obj.light[i].position[1], obj.light[i].position[2]);
                    point.name = obj.light[i].name
                    _this.scene.add(point);
                    break;
            }
        }
    }

    initAxis(object) {
        if (object.axis.isOpen) {
            var axes = new THREE.AxisHelper(object.axis.length);
            _this.scene.add(axes);
            var gridHelper = new THREE.GridHelper(object.axis.length, 50);
            _this.scene.add(gridHelper);
        }
    }

    createObj(object) {
        object.createObj(_this);
    }

    render() {
        TWEEN.update();
        _this.animate(_this);
        requestAnimationFrame(_this.render)
    }

    animate(obj) {
        _this.params.allObject.animate(obj)
        _this.renderer.render(_this.scene, _this.camera)
    }

    loaderModle(file, fn) {
        var suffix;
        var newFile = L.deepCopy(file);
        var path;
        var obj;
        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
        // model
        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function (xhr) {
        };
        if (newFile.length > 1) {
            for (var i = 0; i < newFile.length; i++) {
                if (newFile[i].replace(/.+\./, "").toLowerCase() == "obj") {
                    suffix = newFile[i].replace(/.+\./, "").toLowerCase();
                    obj = file[i]
                } else {
                    path = file[i]
                }
            }

            switch (suffix) {
                case "obj":
                    var mtlLoader = new THREE.MTLLoader();
                    mtlLoader.load(path, function (materials) {
                        materials.preload();
                        var objLoader = new THREE.OBJLoader();
                        objLoader.setMaterials(materials);
                        objLoader.load(obj, function (object) {
                            fn(object);
                        }, onProgress, onError);

                    });
                    break;
            }
        } else {
            suffix = newFile[0].replace(/.+\./, "").toLowerCase()
            switch (suffix) {
                case "obj":
                    var loader = new THREE.OBJLoader(manager);
                    loader.load(file[0], function (object) {
                        fn(object);
                    }, onProgress, onError);
                    break;
                case "fbx":
                    var loader = new THREE.FBXLoader(manager);
                    loader.load(file[0], function (object) {
                        fn(object);
                    }, onProgress, onError);
                    break;
            }
        }
    }
    loaderTexture(obj) {
        var textureLoader = new THREE.TextureLoader();

        var map0 = textureLoader.load(obj[0]);

        map0.wrapS = map0.wrapT = THREE.RepeatWrapping;
        map0.repeat.set(obj[1], obj[2]);
        map0.needsUpdate = true;

        return map0
    }
    animateFn(anObj, complete) {
        var animate = new TWEEN.Tween(anObj.from)
            .to(anObj.to, anObj.time)
            .onComplete(function () {
                typeof complete == "undefined" ? null : complete()

            })
            .easing(anObj.type)

        if (anObj.startNow) {
            animate.start();
        } else {
            if (anObj.delay) {
                animate.delay(anObj.delay).start();
            }
        }
        return animate
    }

    bindHandler(obj) {
        obj.bindHandler(_this);
        window.addEventListener('resize',_this.onResize)
    }

    onResize() {
        _this.params.width = _this.params.box.offsetWidth;
        _this.params.height = _this.params.box.offsetHeight;
        _this.camera.aspect = _this.params.width / _this.params.height;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(_this.params.width, _this.params.height);
    }

    ray(event) {
        var Sx = event.clientX; //鼠标单击位置横坐标
        var Sy = event.clientY; //鼠标单击位置纵坐标
        //屏幕坐标转标准设备坐标
        var x = (Sx / _this.params.width) * 2 - 1; //标准设备横坐标
        var y = -(Sy / _this.params.height) * 2 + 1; //标准设备纵坐标

        // console.log(Sx, Sy, "---------------------------------", x, y)
        var standardVector = new THREE.Vector3(x, y, 0.5); //标准设备坐标
        //标准设备坐标转世界坐标
        var worldVector = standardVector.unproject(_this.camera);
        //射线投射方向单位向量(worldVector坐标减相机位置坐标)
        var ray = worldVector
            .sub(_this.camera.position)
            .normalize();
        //创建射线投射器对象        var raycaster = new THREE.Raycaster(camera.position, ray);
        var raycaster = new THREE.Raycaster(_this.camera.position, ray);
        //返回射线选中的对象
        var intersects = raycaster.intersectObjects(_this.params.allMesh);

        if (intersects.length > 0) {
            if (_this.params.INTERSECTED != intersects[0].object) {
                _this.params.INTERSECTED = intersects[0].object;
                // _this.params.INTERSECTED.material.color.setHex(0xff0000);
                console.log(intersects[0])
            }
            // cube2.visible = true

            _this.params.allObject.ray(_this, intersects[0])
        } else {
            if (_this.params.INTERSECTED) {
                // _this.params.INTERSECTED.material.color.setHex(0xffffff);
            }

            _this.params.INTERSECTED = null;
        }
    }

    creatPlanMessage(obj, fn) {
        var planObj = {
            background: obj.background,
            width: obj.width,
            height: obj.height,
            x: obj.x,
            y: obj.y,
            z: obj.z,
            borderWidth: obj.borderWidth,
            borderColor: obj.borderColor,
        }
        // _this.params.allObject.creatPlanMessage(T, x, y, z)

        var canvas = document.createElement("canvas");
        canvas.width = planObj.width;
        canvas.height = planObj.height;
        /*2、创建图形，这部分可以去看w3c canvas教程*/
        var ctx = canvas.getContext("2d");
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.beginPath();
            this.moveTo(x + r, y);
            this.arcTo(x + w, y, x + w, y + h, r);
            this.arcTo(x + w, y + h, x, y + h, r);
            this.arcTo(x, y + h, x, y, r);
            this.arcTo(x, y, x + w, y, r);
            this.closePath();
            return this;
        }

        if (planObj.background.replace(/.+\./, "").toLowerCase() == "png" || planObj.background.replace(/.+\./, "").toLowerCase() == "jpg") {
            var imgbg = new Image();
            imgbg.src = planObj.background;

            imgbg.onload = function () {
                fff()
            }
        } else {
            fff()
        }

        function fff() {
            // ctx.drawImage(imgbg, 0, 0, canvas.width, canvas.height);
            if (planObj.background.replace(/.+\./, "").toLowerCase() == "png" || planObj.background.replace(/.+\./, "").toLowerCase() == "jpg") {
                var bg = ctx.createPattern(imgbg, "no-repeat");
                ctx.fillStyle = bg;

            } else {
                ctx.fillStyle = planObj.background
            }

            ctx.lineWidth = planObj.borderWidth;
            ctx.strokeStyle = planObj.borderColor;
            // ctx.fillStyle = "#ffffff";

            ctx.roundRect(0, 0, planObj.width, planObj.height, 50).stroke();
            ctx.fill();

            // 文字
            ctx.fillStyle = "#333333";
            ctx.font = "Bold 24px Arial";
            ctx.fillText("提示信息", 105, 40)
            ctx.fillText("我是提示信息", 20, 80)
            // ctx.fillText("故障类型：", 20, 90)
            // ctx.fillStyle = "#ff0000";
            // ctx.fillText("紧急", 100, 100)


            /*3、将canvas作为纹理，创建Sprite*/
            var texture = new THREE.Texture(canvas);
            texture.needsUpdate = true; //注意这句不能少
            var material = new THREE.SpriteMaterial({ map: texture });

            var planMessage = cube2 = new THREE.Sprite(material);
            planMessage.position.set(planObj.x, 40, planObj.z);
            planMessage.name = "planMessage";
            planMessage.material.transparent = true;
            planMessage.rotation.z = -Math.PI / 2;
            // mesh
            planMessage.scale.set(1, 1, 1);
            // planMessage.material.opacity = 0;
            planMessage.visible = true;
            _this.params.allMesh.push(planMessage)
            // console.log(cube2)
            _this.scene.add(planMessage);

            //更新材质
            // var a = setTimeout(function(){
            //     cube2.material = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load('./images/arrow.png') })
            //     clearTimeout(a)
            // },3000)

            fn(planMessage)
        }
    }

    createBox(obj) {
        var box = new THREE.BoxBufferGeometry(obj.a, obj.b, obj.c);
        // var material = new THREE.MeshPhongMaterial({ color: obj.color,map:!!obj.texture?obj.texture:[] });
        var material = new THREE.MeshPhongMaterial({
            color: obj.color,
            map: obj.texture,
            //  color: 0x552811,
            specular: !!obj.specular ? obj.specular : null,
            shininess: 20,
            bumpMap: obj.texture,
            bumpScale: 1
        });

        var boxMesh = new THREE.Mesh(box, material);
        boxMesh.position.set(obj.x, obj.y, obj.z);
        // boxMesh.material.transparent = true;
        // opacity?boxMesh.material.opacity = opacity:null;
        boxMesh.name = obj.name;
        // debugger
        boxMesh.material.visible = !!obj.hide ? false : true;
        if (obj.border) {
            var border = new THREE.EdgesHelper(boxMesh, obj.border[0]);
            border.name = obj.border[1]
            border.position.set(obj.border[2], obj.border[3], obj.border[4])
            _this.scene.add(border)
        }
        if (obj.isObject3D) {
            return boxMesh;
        } else {
            _this.scene.add(boxMesh);
        }
    }

    createSphere(obj) {
        var sphere = new THREE.SphereBufferGeometry(obj.a, obj.b, obj.c);
        var material = new THREE.MeshBasicMaterial({ color: obj.color });

        var sphereMesh = new THREE.Mesh(sphere, material);
        sphereMesh.position.set(obj.x, obj.y, obj.z);
        sphereMesh.material.visible = !!obj.hide ? false : true;
        sphereMesh.name = obj.name;
        if (obj.isObject3D) {
            return sphereMesh;
        } else {
            _this.scene.add(sphereMesh);
        }
    }

    deleteMesh() {
        // remove()
        // dispose()
    }

    getMesh() {

    }

    hideMesh() {

    }

    showMesh() {

    }
}


window.L3D = L3D
window.L = L
window.THREE = THREE
window.TWEEN = TWEEN

// export  {L3D,L,THREE,TWEEN}