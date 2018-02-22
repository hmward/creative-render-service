import * as React from 'react';
import * as Three from 'three';

const styles = require('./Home.scss');

/**
 * @class
 * @extends {React.Component}
 */
export class Home extends React.Component<{}, {}> {
  private renderer: Three.WebGLRenderer;
  private camera: Three.PerspectiveCamera;
  private scene: Three.Scene;

  /**
   * @inheritdoc
   */
  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    // Set the scene size.
    const WIDTH = 400;
    const HEIGHT = 300;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Get the DOM element to attach to
    const container = document.querySelector('#container');

    // Create a WebGL renderer, camera
    // and a scene
    this.renderer = new Three.WebGLRenderer();
    this.camera = new Three.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR,
    );

    this.scene = new Three.Scene();

    // Add the camera to the scene.
    this.scene.add(this.camera);

    // Set up the sphere vars
    const RADIUS = 50;
    const SEGMENTS = 16;
    const RINGS = 16;

    const sphereMaterial =
      new Three.MeshLambertMaterial(
        {
          color: 0xCC0000,
        });

    // Create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    const sphere = new Three.Mesh(

      new Three.SphereGeometry(
        RADIUS,
        SEGMENTS,
        RINGS),

      sphereMaterial);

    // Move the Sphere back in Z so we
    // can see it.
    sphere.position.z = -300;

    // Finally, add the sphere to the scene.
    this.scene.add(sphere);

    // create a point light
    const pointLight =
      new Three.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    this.scene.add(pointLight);

    // Start the renderer.
    this.renderer.setSize(WIDTH, HEIGHT);

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(this.renderer.domElement);

    // Schedule the first frame.
    requestAnimationFrame(() => {
      this.update();
    });
  }

  /**
   * @inheritdoc
   */
  public render() {
    return (
      <div className={styles.Home}>
        <div>Home</div>
        <div id="container" />
      </div>
    );
  }

  private update() {
    console.log('update');
    // Draw!
    this.renderer.render(this.scene, this.camera);

    // Schedule the next frame.
    requestAnimationFrame(() => {
      this.update();
    });
  }
}
