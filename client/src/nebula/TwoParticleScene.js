import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ParticleScene = ({
  percentageToCenter1 = 0.5, // Percentage of particles to center 1
  mean = 10, // Mean of the normal distribution for particle distance
  stdDev = 5, // Standard deviation of the normal distribution for particle distance
  transitionTime = 15, // Time (in seconds) for particles to reach their destination
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160016);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 4, 100);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    let gu = { time: { value: 0 } };

    // Particle attributes
    let sizes = [];
    let speeds = [];
    let startPositions = [];
    let targetPositions = [];
    let controlPoints = [];
    let startTimes = [];

    // Define the two centers
    const centers = [
      new THREE.Vector3(-50, 0, 0), // Fixed left center
      new THREE.Vector3(50, 0, 0),  // Fixed right center
    ];

    // Particle count
    const particleCount = 50000;
    const startClusterRadius = 5;

    // Function to generate random values following a normal distribution
    const generateNormalRandom = (mean = 0, stdDev = 1) => {
      let u1 = Math.random();
      let u2 = Math.random();
      let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      return z0 * stdDev + mean;
    };

    // Generate particle attributes
    for (let i = 0; i < particleCount; i++) {
      // Assign particles to one of the centers based on percentage
      const centerIndex = Math.random() < percentageToCenter1 ? 0 : 1;
      const center = centers[centerIndex];

      // Final position: Normal distribution for radius
      const radius = Math.abs(generateNormalRandom(mean, stdDev)); // Mean and StdDev from props
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
      const y = center.y + radius * Math.sin(phi) * Math.sin(theta);
      const z = center.z + radius * Math.cos(phi);
      targetPositions.push(x, y, z);

      // Start position: Random cluster near the origin
      const startTheta = Math.random() * 2 * Math.PI;
      const startPhi = Math.acos(2 * Math.random() - 1);
      const startRadius = Math.random() * startClusterRadius;
      const startX = startRadius * Math.sin(startPhi) * Math.cos(startTheta);
      const startY = startRadius * Math.sin(startPhi) * Math.sin(startTheta);
      const startZ = startRadius * Math.cos(startPhi);
      startPositions.push(startX, startY, startZ);

      // Random intermediate control points to create curves
      const controlX = startX + (Math.random() - 0.5) * 10;
      const controlY = startY + (Math.random() - 0.5) * 10;
      const controlZ = startZ + (Math.random() - 0.5) * 10;
      controlPoints.push(controlX, controlY, controlZ);

      sizes.push(Math.random() * 1.5 + 0.5);
      speeds.push(1 / transitionTime); // Uniform speed to control total duration
      startTimes.push(Math.random() * 5); // Randomized start delay
    }

    let g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(startPositions, 3));
    g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));

    let m = new THREE.PointsMaterial({
      size: 0.125,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          attribute float sizes;
          varying vec3 vColor;

          ${shader.vertexShader}
        `.replace(
          `gl_PointSize = size;`,
          `gl_PointSize = size * sizes;`
        ).replace(
          `#include <color_vertex>`,
          `#include <color_vertex>
            float d = length(position) / ${mean.toFixed(1)};
            d = clamp(d, 0., 1.);
            vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.;
          `
        );

        shader.fragmentShader = `
          varying vec3 vColor;

          ${shader.fragmentShader}
        `.replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
            
          `
        ).replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `float d = length(gl_PointCoord.xy - 0.5);
           vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d) );`
        );
      },
    });

    let p = new THREE.Points(g, m);
    scene.add(p);

    const clock = new THREE.Clock();

    const animate = () => {
      controls.update();
      let t = clock.getElapsedTime();

      let positions = g.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        if (t < startTimes[i]) continue; // Skip if particle hasn't started moving yet

        const idx = i * 3;
        const progress = Math.min((t - startTimes[i]) * speeds[i], 1); // Slower transition progress

        // Quadratic Bezier curve interpolation
        const startX = startPositions[idx];
        const startY = startPositions[idx + 1];
        const startZ = startPositions[idx + 2];

        const controlX = controlPoints[idx];
        const controlY = controlPoints[idx + 1];
        const controlZ = controlPoints[idx + 2];

        const targetX = targetPositions[idx];
        const targetY = targetPositions[idx + 1];
        const targetZ = targetPositions[idx + 2];

        if (progress < 1) {
          positions[idx] =
            (1 - progress) * (1 - progress) * startX +
            2 * (1 - progress) * progress * controlX +
            progress * progress * targetX;
          positions[idx + 1] =
            (1 - progress) * (1 - progress) * startY +
            2 * (1 - progress) * progress * controlY +
            progress * progress * targetY;
          positions[idx + 2] =
            (1 - progress) * (1 - progress) * startZ +
            2 * (1 - progress) * progress * controlZ +
            progress * progress * targetZ;
        } else {
          // Once particles reach the destination, they stop moving
          positions[idx] = targetX;
          positions[idx + 1] = targetY;
          positions[idx + 2] = targetZ;
        }
      }

      g.attributes.position.needsUpdate = true;

      p.rotation.y = t * 0.005; // Slow rotation for visual effect
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [percentageToCenter1, mean, stdDev, transitionTime]);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ParticleScene;
