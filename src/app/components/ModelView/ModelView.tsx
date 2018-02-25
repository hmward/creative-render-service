import * as React from 'react';
import * as THREE from 'three';
import MTLLoader from 'lib/MTLLoader';
import OBJLoader from 'lib/OBJLoader';

const OrbitControls = require('three-orbit-controls')(THREE);

const styles = require('./ModelView.scss');

interface IModelViewProps {
  modelPath: string;
  materialPath: string;
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
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 200;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(this.id).appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);
    const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);
    const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();
    this.scene.add(keyLight);
    this.scene.add(fillLight);
    this.scene.add(backLight);

    const mtlLoader = new MTLLoader();
    mtlLoader.setTexturePath('api/assets/');
    mtlLoader.setPath('');
    mtlLoader.load(require('assets/obj/r2-d2.mtl'), (materials) => {
      console.log(materials);
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('');
      objLoader.load(require('assets/obj/r2-d2.obj'), (object) => {
        console.log(object);
        this.scene.add(object);
        object.position.y -= 60;
      });
    });

    this.animate();
  }

  private animate() {
    console.log('animate');
    requestAnimationFrame(() => this.animate());

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * @inheritdoc
   */
  public render() {
    return (
      <div className={styles.ModelView}>
        <div id={this.id} />
      </div>
    );
  }
}
