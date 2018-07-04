
import { L3D, L, THREE, TWEEN } from './lib/L3D.js';

let a = new L3D({
    el: "#canvas-frame",
    viewport: [L.select("#canvas-frame").offsetWidth, L.select("#canvas-frame").offsetHeight],
    render: {
        antialias: true,
        alpha: false,
    },
    camera: {
        position: [0, 240, 350],
        controls: true
    },
    light: [{
        type: "环境光",
        position: [0, 50, 0],
        intensity: 1,
        color: "#ffffff",
        name: "light1"
    }, {
        type: "平行光",
        position: [-100, 30, -100],
        intensity: 1,
        color: "#ffffff"
    }, {
        type: "平行光",
        position: [100, 30, 100],
        intensity: 1,
        color: "#ffffff"
    }],
    axis: {
        isOpen: true,
        length: 200
    },
    bindHandler: () => {

    },
    ray: () => {

    },
    creatObject: (TH) => {

        TH.loaderModle(["./modle/obj/001.obj"], function (object) {
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.color.set("#304ffe");
                    child.material.transparent = true;
                    child.material.opacity = 0.01;
                }
            });
            object.position.set(-40, 0, -10);
            object.scale.set(0.001, 0.001, 0.001);
            TH.scene.add(object);
            var amObj = {
                from: object.scale,//动画开始的初始值
                to: { x: 0.01, y: 0.01, z: 0.01 },//动画结束的目标值
                type: TWEEN.Easing.Exponential.Out,//动画的类型
                time: 1500,//持续时间
                startNow: true,//是否立即开始
                delay: 1000//动画延迟执行
            }
            TH.animateFn(amObj);
            var nnn = {
                from: object.children[0].material,//动画开始的初始值,需要变化的属性的上一级
                to: { opacity: 0.6 },//动画结束的目标值
                type: TWEEN.Easing.Exponential.Out,//动画的类型
                time: 1500,//持续时间
                startNow: false,//是否立即开始
                delay: 1000//动画延迟执行
            }
            TH.animateFn(nnn);
            console.log(object)
        })
    },
    animate: () => {

    }
})

console.log()