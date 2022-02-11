window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;
  // カラーリスト
  const colors = [
    0x01cdf0,
    0x87549c,
    0xe93e3e,
    0xfa8e2e,
    0xf6eb37,
    0x77d94c
  ];

  const squares = [];  // オブジェクト用配列
  const num = 150; // オブジェクトの数


  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);
  
  // ジオメトリ作成
  const geometry = new THREE.PlaneBufferGeometry(15, 30, 30);
  
  // メッシュ生成
  for(let i = 0; i < num; i++){
    const material =  new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide //両サイドに反映
      // vertexColors: THREE.FaceColors, //faceColorを適用
      //transparent: true,
      //opacity: 0.9
    });

    squares[i] =  new THREE.Mesh(geometry,material);
    squares[i].position.x = (Math.random() - 0.5) * (width / 1.7) + 25;
    squares[i].position.y = Math.random() * (height + 200);
    squares[i].position.z = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
    squares[i].rotation.z = Math.random() * 15;
    squares[i].rotation.x = Math.random() * 10;
    squares[i].rotation.y = Math.random() * 10;
    
    scene.add(squares[i]);
  }



  let rot = 0; // 角度
  let mouseX = 0; // マウス座標

  // マウス座標の取得
  document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
  });

  tick();

  // ループイベント
  function tick() {

    
    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRot = (mouseX / window.innerWidth) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rot += (targetRot - rot) * 0.005;

    // ラジアンに変換する
    const radian = rot * Math.PI / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    renderer.render(scene, camera);

    
    // ループアニメーション
    for(let i = 0; i < squares.length; i++){
      const speedRotate = Math.random() * 0.3;
      squares[i].rotation.y += speedRotate;
      //squares[i].rotation.z += 0.01;
      squares[i].position.y -= 3.5;
      //squares[i].position.x += 0.8;

      if(i % 2) {
        if(i % 5) {
          squares[i].position.x += 1.5;
        } else {
          squares[i].position.x += 0.5;
        }
      } else {
        if(i % 3) {
          squares[i].position.x -= 1.2;
        } else {
          squares[i].position.x -= 0.5;
        }
      }


      // 上下ループ
      if(-(squares[i].position.y) > height / 2 + 100) {
        //squares[i].position.y += height + 300;
        squares[i].position.y = height / 2 + 100;
        squares[i].position.x = (Math.random() - 0.5) * (width / 1.7) + 25;
      }
        
    }

    requestAnimationFrame(tick);
  }
}