import * as React from 'react';
import * as THREE from 'three';

import MTLLoader from 'lib/MTLLoader';
import OBJLoader from 'lib/OBJLoader';
import Sky from 'lib/Sky';

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
    this.initSky();
    this.loadModel();
    // this.loadModel2();
    this.initFloor();

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

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000000);
    this.camera.position.set(0, 200, 200);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    document.getElementById(this.id).appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxDistance = 1000;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
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

  private initSky() {
    const sky = new Sky();

    sky.scale.setScalar(450000);
    this.scene.add(sky);
  }

  private loadModel() {
    const mtlLoader = new MTLLoader();
    mtlLoader.setTexturePath('api/assets/');
    mtlLoader.load('api/assets/r2-d2.mtl', (materials) => {
      console.log(materials);
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('api/assets/r2-d2.obj', (object) => {
        console.log(object);
        this.scene.add(object);

        object.position.y -= 60;
      });
    });
  }

  // private loadModel2() {
  //   const objLoader = new THREE.ObjectLoader();
  //   objLoader.load('api/assets/wooden-coffe-table.json', (object) => {
  //     console.log(object);
  //     this.scene.add(object);
  //   });
  // }

  private initFloor() {
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0xffffff),
    });
    const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), floorMaterial);
    floorMesh.position.setY(-80);
    floorMesh.rotation.x = - Math.PI / 2;

    this.scene.add(floorMesh);
  }

  private update() {
    requestAnimationFrame(() => this.update());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
