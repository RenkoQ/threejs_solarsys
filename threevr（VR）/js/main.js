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

const canvas = document.getElementById('main');    //�����õ�������ʱ�����ı�������const���������Ա���δ����С�������������³���bug
const  clock = new THREE.Clock();  //���ڼ�������animationFrame֮����ʱ��

var cameraFar = 3000; //��ͷ�Ӿ�

var starNames = {}; //ָ����ʾ���������ֶ���
var displayName = undefined; //��ǰ��ʾ����

var raycaster = new THREE.Raycaster(); //ָ������
var mouse = new THREE.Vector2(); //�����Ļ����

    function init(){

        var _this = this;

        /*FPS��¼*/
        stat = new Stats();
        stat.domElement.style.position = 'absolute';
        stat.domElement.style.right = '0px';
        stat.domElement.style.top = '0px';
        document.body.appendChild(stat.domElement);


        /*����#fff�����������*/
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        /*���������˫��ȫ��*/
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
        /*������*/
        renderer.shadowMapSoft = true;
        /*�����Ӱ*/
        renderer.setClearColor(0xffffff, 0);

        /*����*/
        effect = new THREE.StereoEffect(renderer);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        //Զ�����PerspectiveCamera( fov��׶�崹ֱ�ӽ�, aspect��߱�, near���ü���, farԶ�ü��� )
        camera.position.set(0, 20, 60);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);



        /*̫������*/
        let sunSkinPic = THREE.ImageUtils.loadTexture('img/sun.jpg',{},function(){
            renderer.render(scene,camera);
        });

        /*����̫��*/
        const Sun = new THREE.Mesh(new THREE.SphereGeometry(12, 16, 16),               //һ���뾶Ϊ12�����Ȼ��ֳ�16�ݣ�γ�Ȼ��ֳ�16�ݵ�����
            new THREE.MeshLambertMaterial({
                //color: 0xffff00,
                emissive: 0xdd4422,     //����ɫ
                map: sunSkinPic
            })
        );
        Sun.name = 'Sun';
        scene.add(Sun);

        /*̫����ת*/
        Sun.rotation.y = (Sun.rotation.y == 2*Math.PI ? 0.0008*Math.PI : Sun.rotation.y+0.0008*Math.PI);

        ///*���õ���*/
        //const Earth = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16),
        //    new THREE.MeshLambertMaterial({
        //        color: 'rgb(46,69,119)',
        //        emissive: 'rgb(46,69,119)'
        //    })
        //);
        //Earth.name = 'Earth';
        //Earth.position.z = -40;       //�������ǵĹ������(x, 0, z)��ƽ����
        //scene.add(Earth);
        /*��������*/
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



        /*��������*/
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




        /*������*/
        let ambient = new THREE.AmbientLight(0x999999);
        scene.add(ambient);

        /*̫����*/
        let sunLight = new THREE.PointLight(0xddddaa,1.5,500);
        scene.add(sunLight);

        //������͵�⡣���ǵı�����̫���⣬��Ҫ������AmbientLight����������
        //PointLight�ĺ����������������ǿ�Ⱥ͹���Ӱ��ľ��롣���յ����������Ļ��ʹ������˥��


        /*/!*��һ�˳��Ӿ�*!/
        control = new THREE.FirstPersonControls( camera, canvas);
        control.movementSpeed = 100;   //��ͷ����
        control.lookSpeed = 0.125;  //�Ӿ��ı��ٶ�
        control.lookVertical = true;  //�Ƿ������Ӿ����¸ı�*/

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


        /*��Ⱦ*/
        renderer.render(scene, camera);

        /*�ƶ�*/
        requestAnimationFrame(function(){
            return _this.move();
        });

    }

    /*��ʼ������returns{{name:*,speed:*,angle:*,color:*, distance: *,volume: *,Mesh: THREE.Mesh}} */
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

        //���ǹ��
        let  track = new  THREE.Mesh( new THREE.RingGeometry(distance-0.2, distance+0.2, 64,1),
            new THREE.MeshBasicMaterial({color: 0x888888, side: THREE.DoubleSide })
        );
        track.rotation.x = Math.PI/2;    //RingĬ�ϴ�ֱ��x�ᣬ��Ҫ��ת90��
        scene.add(track);

        return star;
    }

    /*���ǹ�ת����*/
    function moveEachStar(star){
        star.angle += star.speed;          //���嵱ǰ�ǶȺͽ��ٶ�

        if(star.angle > Math.PI *2 ){
            star.angle -= Math.PI *2;
        }
        //�����Ѿ��߹�һȦ

        star.Mesh.position.set(star.distance * Math.sin(star.angle), 0, star.distance * Math.cos(star.angle));



    }

    /*�ƶ�*/
    function move(){
        var _this2 = this;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        effect.setSize(window.innerWidth, window.innerHeight);

        /*���ǹ�ת*/
        for (let i = 0; i < stars.length; i++) {
            moveEachStar(stars[i]);
        }

        controls.update();
        //control.update( clock.getDelta());
        //����ӽǿ���
        //�˴������delta������animationFrame�ļ��ʱ�䣬���ڼ����ٶ�

        //renderer.render(scene, camera);
        effect.render(scene, camera);

        requestAnimationFrame(function(){
            return _this2.move();
        });

        stat.update();
    }














