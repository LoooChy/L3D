
import L3D from './lib/L3D.js';
import L from './lib/L.js';

let a = new L3D({
    el: "#canvas-frame",
    viewport: [L.select("#canvas-frame").offsetWidth, L.select("#canvas-frame").offsetHeight],
    render: {
        antialias: true,
        alpha: false,
    },
    camera:{
        position:[0,240,350],
        controls:true
    },
    axis:{
        isOpen:true,
        length:200
    }
})

console.log()