import * as React from 'react';
import * as THREE from 'three';
import MTLLoader from 'lib/MTLLoader';
import OBJLoader from 'lib/OBJLoader';

const OrbitControls = require('three-orbit-controls')(THREE);

const styles = require('./ModelView.scss');

interface IModelViewProps {
  width: number;
  height: number;
}

/**
 * @class
 * @extends {React.Component}
 */
export class ModelView extends React.Component<IModelViewProps, {}> {
  private id: string;

  private controls: THREE.OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  /**
   * @inheritdoc
   */
  public constructor(props: IModelViewProps) {
    super(props);

    this.id = 'modelview';
  }

  /**
   * @inheritDoc
   */
  public componentDidMount() {
    this.init();
    this.initLight();
    this.loadModal();

    this.update();
  }

  /**
   * @inheritdoc
   */
  public render() {
    const { width, height } = this.props;

    return (
      <div className={styles.ModelView} style={{
        width: `${width}px`,
        height: `${height}px`,
      }}>
        <div id={this.id} />
      </div>
    );
  }

  private init() {
    const { width, height } = this.props;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcce0ff);
    this.scene.fog = new THREE.Fog(0xcce0ff, 500, 10000);
    this.scene.add(new THREE.AmbientLight(0x666666));

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 200;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    document.getElementById(this.id).appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load(require('assets/obj/grasslight-big.jpg'));
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;
    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
  }

  private initLight() {
    const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);
    const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);
    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    this.scene.add(keyLight);
    this.scene.add(fillLight);
    this.scene.add(backLight);
  }

  private loadModal() {
    const mtlLoader = new MTLLoader();
    mtlLoader.setTexturePath('api/assets/');
    mtlLoader.load(require('assets/obj/r2-d2.mtl'), (materials) => {
      console.log(materials);
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(require('assets/obj/r2-d2.obj'), (object) => {
        console.log(object);
        this.scene.add(object);
        object.position.y -= 60;
      });
    });
  }

  private update() {
    requestAnimationFrame(() => this.update());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
