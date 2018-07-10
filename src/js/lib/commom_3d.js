/*
         *camera:相机
         *angle：旋转角度
         *segs:分段，即圆弧对应的路径分为几段
         *during：动画执行的时间
        */
function myCameraTweenByAnyAxis(camera, angle, segs, during) {

    var x = camera.position.x;
    var y = camera.position.y;
    var z = camera.position.z;

    //相机向量（指向场景中心）
    var v1 = new THREE.Vector3(x, y, z);

    //求旋转轴，v1的垂直单位向量,令x=1,y=1,z=-(v1.x+v1.y)/v1.z
    var n = (new THREE.Vector3(1, 0, -1.0 * v1.x / v1.z)).normalize();

    var endPosArray = new Array();

    var perAngle = angle / segs;

    for (var i = 1; i <= segs; i++) {
        var sinDelta = Math.sin(THREE.Math.degToRad(i * perAngle));
        var cosDelta = Math.cos(THREE.Math.degToRad(i * perAngle));

        var tempX = x * (n.x * n.x * (1 - cosDelta) + cosDelta) + y * (n.x * n.y * (1 - cosDelta) - n.z * sinDelta) + z * (n.x * n.z * (1 - cosDelta) + n.y * sinDelta);
        var tempY = x * (n.x * n.y * (1 - cosDelta) + n.z * sinDelta) + y * (n.y * n.y * (1 - cosDelta) + cosDelta) + z * (n.y * n.z * (1 - cosDelta) - n.x * sinDelta);
        var tempZ = x * (n.x * n.z * (1 - cosDelta) - n.y * sinDelta) + y * (n.y * n.z * (1 - cosDelta) + n.x * sinDelta) + z * (n.z * n.z * (1 - cosDelta) + cosDelta);

        var endPos = { "x": tempX, "y": tempY, "z": tempZ };

        //console.log(endPos);
        endPosArray.push(endPos);
    }

    var flag = 0;
    var id = setInterval(function () {
        if (flag == segs) {
            clearInterval(id);
        } else {
            camera.position.x = endPosArray[flag].x;
            camera.position.y = endPosArray[flag].y;
            camera.position.z = endPosArray[flag].z;

            camera.updateMatrix();

            flag++;
        }
    }, during / segs);
}
/*
* r OC的距离
* phi OC与世界坐标系y轴的夹角
* theta OC在XOZ平面投影与Z轴的夹角
*/
function updateAngles(r, phi, theta) {
    //var vec = new THREE.Vector3();
    var x, y, z;
    z = r * Math.sin(phi) * Math.cos(theta);
    x = r * Math.sin(phi) * Math.sin(theta);
    y = r * Math.cos(phi);

    console.log("x " + x + " : " + y + " : " + z + " theta:" + theta + " phi:" + phi);
    return { "x": x, "y": y, "z": z };
}
// ================================================================


/**
 * 经纬度转xyz
 * @param longitude 经度
 * @param latitude 纬度
 * @param radius 半径
 */
function lglt2xyz(longitude, latitude, radius) {
    var lg = degToRad(longitude), lt = degToRad(latitude);
    var y = radius * Math.sin(lt);
    var temp = radius * Math.cos(lt);
    var x = temp * Math.sin(lg);
    var z = temp * Math.cos(lg);
    return { x: x, y: y, z: z }
}

//通过x,y,z指定旋转中心，obj是要旋转的对象
function changePivot(x, y, z, obj) {
    let wrapper = new THREE.Object3D();
    wrapper.position.set(x, y, z);
    wrapper.add(obj);
    obj.position.set(-x, -y, -z);
    return wrapper;
}

//设置导入模型的中心点
geometry.computeBoundingBox();
geometry.center()

//创建边框
function creatBorder() {
    // 方法1：
    var mesh = new THREE.Mesh(geom, material);

    scene.add(mesh);

    border = new THREE.BoxHelper(mesh, 0x0dc3b4);//设置边框，这个边框不会旋转

    scene.add(border);

    // 用这种方法，比如我要旋转立方体，边框不会跟着改变。

    // 方法2：
    var mesh = new THREE.Mesh(geom, material);

    scene.add(mesh);

    edges = new THREE.EdgesHelper(mesh, 0x1535f7);//设置边框，可以旋转

    scene.add(edges);

    // 用这种方法，比如我要旋转立方体，边框会跟着改变。
}


function calculate3xyzToDiv2xy() {
    //获取到窗口的一半高度和一半宽度
    let halfWidth = window.innerWidth / 2;
    let halfHeight = window.innerHeight / 2;

    let vector1 = cube.position.clone().project(camera);
    let vector2 = cube2.position.clone().project(camera);
    let vector3 = cube3.position.clone().project(camera);

    //修改第一个的div的位置
    $(".one").css({
        left: vector1.x * halfWidth + halfWidth,
        top: -vector1.y * halfHeight + halfHeight
    });


    $(".two").css({
        left: vector2.x * halfWidth + halfWidth,
        top: -vector2.y * halfHeight + halfHeight
    });


    $(".three").css({
        left: vector3.x * halfWidth + halfWidth,
        top: -vector3.y * halfHeight + halfHeight
    });
}