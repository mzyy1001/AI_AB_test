import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SquareScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160016);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(75, 75, 150); // Adjusted to see the square and axes better

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const gu = {
      time: { value: 0 },
      transitionProgress: { value: 0 },
      finalStyle2Ratio: { value: 0.3 },
    };

    const sizes = [];
    const shift = [];
    const thresholds = [];

    const clusterCenter = new THREE.Vector3(50, 50, 50);

    const pushShift = () => {
      shift.push(
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2,
        (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
        Math.random() * 0.9 + 0.1
      );
    };

    const calculateClusterProbability = (position) => {
      const distance = position.distanceTo(clusterCenter);
      return Math.exp(-Math.pow(distance, 2) / 500);
    };

    const generateRandomSquarePosition = () => {
      return new THREE.Vector3(
        Math.random() * 100, // X in [0, 100]
        Math.random() * 100, // Y in [0, 100]
        Math.random() * 100 // Z in [0, 100]
      );
    };

    const pts = new Array(20000).fill().map(() => {
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();

      const position = generateRandomSquarePosition();
      const clusterProbability = calculateClusterProbability(position);

      const baseProbability = 0.02;
      thresholds.push(Math.random() > clusterProbability + baseProbability ? 0.9 + Math.random() * 0.1 : Math.random() * 0.3);

      return position;
    });

    for (let i = 0; i < 40000; i++) {
      sizes.push(Math.random() * 1.5 + 0.5);
      pushShift();

      const position = generateRandomSquarePosition();
      const clusterProbability = calculateClusterProbability(position);
      const baseProbability = 0.02;
      thresholds.push(Math.random() > clusterProbability + baseProbability ? 0.9 + Math.random() * 0.1 : Math.random() * 0.3);

      pts.push(position);
    }

    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
    g.setAttribute("threshold", new THREE.Float32BufferAttribute(thresholds, 1));

    const m = new THREE.PointsMaterial({
      size: 0.125,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = gu.time;
        shader.uniforms.transitionProgress = gu.transitionProgress;
        shader.uniforms.finalStyle2Ratio = gu.finalStyle2Ratio;

        shader.vertexShader = `
          uniform float time;
          uniform float transitionProgress;
          uniform float finalStyle2Ratio;
          attribute float sizes;
          attribute vec4 shift;
          attribute float threshold;
          varying vec3 vColor;

          ${shader.vertexShader}
        `.replace(
          `gl_PointSize = size;`,
          `gl_PointSize = size * sizes;`
        ).replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
            float currentThreshold = mix(0.0, finalStyle2Ratio, transitionProgress);
            float currentStyle = step(threshold, currentThreshold);

            if (currentStyle < 0.5) {
              vColor = vec3(1.0, 1.0, 1.0); // Style 1 color
            } else {
              vColor = vec3(1.0, 0.0, 0.6); // Style 2 color (clustered)
            }
          `
        ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
            
          `
        );

        shader.fragmentShader = `
          varying vec3 vColor;

          ${shader.fragmentShader}
        `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `float d = length(gl_PointCoord.xy - 0.5);
           vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d));`
        );
      },
    });

    const nebula = new THREE.Points(g, m);
    scene.add(nebula);

    const clock = new THREE.Clock();

    const animate = () => {
      controls.update();
      const t = clock.getElapsedTime() * 0.5;
      gu.time.value = t * Math.PI;

      gu.transitionProgress.value = Math.min(1, gu.transitionProgress.value + 0.001);

      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    // Add coordinate axes with the origin at the corner of the square
    const createAxisLine = (start, end, color) => {
      const material = new THREE.LineBasicMaterial({ color });
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
    };

    // Dimensions of the square (100 x 100 x 100, starting at the origin)
    const squareSize = 100;

    // X-axis
    const xAxis = createAxisLine(
      new THREE.Vector3(0, 0, 0), // Start at the origin
      new THREE.Vector3(1.5*squareSize, 0, 0), // Extend along X-axis
      0xffffff  // Red
    );
    scene.add(xAxis);

    // Y-axis
    const yAxis = createAxisLine(
      new THREE.Vector3(0, 0, 0), // Start at the origin
      new THREE.Vector3(0, 1.5*squareSize, 0), // Extend along Y-axis
      0xffffff  // Green
    );
    scene.add(yAxis);

    // Z-axis
    const zAxis = createAxisLine(
      new THREE.Vector3(0, 0, 0), // Start at the origin
      new THREE.Vector3(0, 0, 1.5*squareSize), // Extend along Z-axis
      0xffffff  // Blue
    );
    scene.add(zAxis);

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default SquareScene;
