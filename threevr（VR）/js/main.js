/**
 * Created by HZDN on 2017/2/25.
 */



let  scene,
    renderer,
    camera,
    particleSystem,
    stat,
    control,
    effect,
    element,
    controls;


let  Sun,
    Mercury,
    Venus,
    Earth,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Neptune,
    stars = [];

const canvas = document.getElementById('main');    //当引用第三方库时声明的变量，用const来声明可以避免未来不小心重命名而导致出现bug
const  clock = new THREE.Clock();  //用于计算两次animationFrame之间间隔时间

var cameraFar = 3000; //镜头视距

var starNames = {}; //指向显示的星星名字对象
var displayName = undefined; //当前显示名字

var raycaster = new THREE.Raycaster(); //指向镭射
var mouse = new THREE.Vector2(); //鼠标屏幕向量

    function init(){

        var _this = this;

        /*FPS记录*/
        stat = new Stats();
        stat.domElement.style.position = 'absolute';
        stat.domElement.style.right = '0px';
        stat.domElement.style.top = '0px';
        document.body.appendChild(stat.domElement);


        /*设置#fff画布和摄像机*/
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        /*控制浏览器双击全屏*/
        canvas.addEventListener('click',function(){
            if (canvas.requestFullscreen) {
                canvas.requestFullscreen();
            } else if (canvas.msRequestFullscreen) {
                canvas.msRequestFullscreen();
            } else if (canvas.mozRequestFullScreen) {
                canvas.mozRequestFullScreen();
            } else if (canvas.webkitRequestFullscreen) {
                canvas.webkitRequestFullscreen();
            } else if(canvas.webkitEnterFullscreen){
                canvas.webkitEnterFullscreen();
            }
        },false);

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false,alpha: true});
        renderer.shadowMap.enabled = true;
        /*辅助线*/
        renderer.shadowMapSoft = true;
        /*柔和阴影*/
        renderer.setClearColor(0xffffff, 0);

        /*分屏*/
        effect = new THREE.StereoEffect(renderer);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        //远景相机PerspectiveCamera( fov视锥体垂直视角, aspect宽高比, near近裁剪面, far远裁剪面 )
        camera.position.set(0, 20, 60);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);



        /*太阳材质*/
        let sunSkinPic = THREE.ImageUtils.loadTexture('img/sun.jpg',{},function(){
            renderer.render(scene,camera);
        });

        /*设置太阳*/
        const Sun = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 16),               //一个半径为12，经度划分成16份，纬度划分成16份的球体
            new THREE.MeshLambertMaterial({
                //color: 0xffff00,
                emissive: 0xdd4422,     //放射色
                map: sunSkinPic
            })
        );
        Sun.name = 'Sun';
        scene.add(Sun);

        /*太阳自转*/
        Sun.rotation.y = (Sun.rotation.y == 2*Math.PI ? 0.0008*Math.PI : Sun.rotation.y+0.0008*Math.PI);

        ///*设置地球*/
        //const Earth = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16),
        //    new THREE.MeshLambertMaterial({
        //        color: 'rgb(46,69,119)',
        //        emissive: 'rgb(46,69,119)'
        //    })
        //);
        //Earth.name = 'Earth';
        //Earth.position.z = -40;       //假设行星的轨道都在(x, 0, z)的平面上
        //scene.add(Earth);
        /*其他材质*/
        let MercurySkinPic = THREE.ImageUtils.loadTexture('img/Mercury.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let VenusSkinPic = THREE.ImageUtils.loadTexture('img/Venus.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let EarthSkinPic = THREE.ImageUtils.loadTexture('img/Earth.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let MarsSkinPic = THREE.ImageUtils.loadTexture('img/Mars.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let JupiterSkinPic = THREE.ImageUtils.loadTexture('img/Jupiter.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let SaturnSkinPic = THREE.ImageUtils.loadTexture('img/Saturn.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let UranusSkinPic = THREE.ImageUtils.loadTexture('img/Uranus.jpg',{},function(){
            renderer.render(scene,camera);
        });
        let NeptuneSkinPic = THREE.ImageUtils.loadTexture('img/Neptune.jpg',{},function(){
            renderer.render(scene,camera);
        });



        /*其他行星*/
        Mercury = this.initPlanet('Mercury', 0.02, 0, 'rgb(124,131,203)', 20, 2,MercurySkinPic);
        stars.push(Mercury);

        Venus = this.initPlanet('Venus', 0.012, 0, 'rgb(190,138,44)', 30, 4,VenusSkinPic);
        stars.push(Venus);

        Earth = this.initPlanet('Earth', 0.010, 0, 'rgb(46,69,119)', 40, 5,EarthSkinPic);
        stars.push(Earth);

        Mars = this.initPlanet('Mars', 0.008, 0, 'rgb(210,81,16)', 50, 4,MarsSkinPic);
        stars.push(Mars);

        Jupiter = this.initPlanet('Jupiter', 0.006, 0, 'rgb(254,208,101)', 70, 9,JupiterSkinPic);
        stars.push(Jupiter);

        Saturn = this.initPlanet('Saturn', 0.005, 0, 'rgb(210,140,39)', 100, 7,SaturnSkinPic);
        stars.push(Saturn);

        Uranus = this.initPlanet('Uranus', 0.003, 0, 'rgb(49,168,218)', 120, 4,UranusSkinPic);
        stars.push(Uranus);

        Neptune = this.initPlanet('Neptune', 0.002, 0, 'rgb(84,125,204)', 150, 3,NeptuneSkinPic);
        stars.push(Neptune);




        /*环境光*/
        let ambient = new THREE.AmbientLight(0x999999);
        scene.add(ambient);

        /*太阳光*/
        let sunLight = new THREE.PointLight(0xddddaa,1.5,500);
        scene.add(sunLight);

        //环境光和点光。行星的背面无太阳光，需要环境光AmbientLight来辅助照明
        //PointLight的后两个参数代表光照强度和光照影响的距离。接收第三个参数的话就代表光照衰减


        /*/!*第一人称视觉*!/
        control = new THREE.FirstPersonControls( camera, canvas);
        control.movementSpeed = 100;   //镜头移速
        control.lookSpeed = 0.125;  //视觉改变速度
        control.lookVertical = true;  //是否允许视觉上下改变*/

        /*D*/
        controls = new THREE.OrbitControls(camera, canvas);
        controls.target.set(
            camera.position.x,
            camera.position.y,
            camera.position.z - 0.15
        );
        controls.noPan = true;
        controls.noZoom = true;

       /* camera.lookAt(new THREE.Vector3(0, 0, 0));
       // window.addEventListener('mousemove', this.onMouseMove, false);
        var _onMouseMove = bind( control, control.onMouseMove );
        control.domElement.addEventListener( 'mousemove', _onMouseMove, false );
        function bind( scope, fn ) {

            return function () {

                fn.apply( scope, arguments );

            };

        }*/

        function setOrientationControls(e){
            console.log(e)
            if (e.alpha) {
                controls = new THREE.DeviceOrientationControls(camera, true);
                controls.connect();
                controls.update();
            }
            window.removeEventListener('deviceorientation', setOrientationControls, true);
        }
        window.addEventListener('deviceorientation', setOrientationControls, true);


        /*渲染*/
        renderer.render(scene, camera);

        /*移动*/
        requestAnimationFrame(function(){
            return _this.move();
        });

    }

    /*初始化行星returns{{name:*,speed:*,angle:*,color:*, distance: *,volume: *,Mesh: THREE.Mesh}} */
    function initPlanet(name, speed,angle,color, distance , volume,map){
        let  mesh = new THREE.Mesh( new THREE.SphereGeometry( volume, 16, 16),
            new THREE.MeshLambertMaterial ( { color : color, map: map })
        );

        mesh.position.z = -distance;
        mesh.receiveShadow = true;
        mesh.castShadow  = true;

        mesh.name =name;

        let star = {
            name,
            speed,
            angle,
            color,
            map,
            distance,
            volume,
            Mesh : mesh
        }

        scene.add(mesh);

        //行星轨道
        let  track = new  THREE.Mesh( new THREE.RingGeometry(distance-0.2, distance+0.2, 64,1),
            new THREE.MeshBasicMaterial({color: 0x888888, side: THREE.DoubleSide })
        );
        track.rotation.x = Math.PI/2;    //Ring默认垂直于x轴，需要旋转90°
        scene.add(track);

        return star;
    }

    /*行星公转函数*/
    function moveEachStar(star){
        star.angle += star.speed;          //星体当前角度和角速度

        if(star.angle > Math.PI *2 ){
            star.angle -= Math.PI *2;
        }
        //行星已经走过一圈

        star.Mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));



    }

    /*移动*/
    function move(){
        var _this2 = this;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        effect.setSize(window.innerWidth, window.innerHeight);

        /*行星公转*/
        for (let i = 0; i < stars.length; i++) {
            moveEachStar(stars[i]);
        }

        controls.update();
        //control.update( clock.getDelta());
        //鼠标视角控制
        //此处传入的delta是两次animationFrame的间隔时间，用于计算速度

        //renderer.render(scene, camera);
        effect.render(scene, camera);

        requestAnimationFrame(function(){
            return _this2.move();
        });

        stat.update();
    }














