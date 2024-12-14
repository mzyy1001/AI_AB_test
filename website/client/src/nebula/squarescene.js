import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SquareScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(75, 75, 150); // Adjusted to see the square and axes better

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.5;
    controls.zoomSpeed = 0.05;
    const gu = {
      time: { value: 0 },
      transitionProgress: { value: 0 },
      finalStyle2Ratio: { value: 0.8 },
      columnTransitionProgress: { value: 0 }, 
      columnWidth: { value: 100 },
    };
    const sizes = [];
    const sizes2 = [];
    const shift = [];
    const thresholds = [];

    const clusterCenter = new THREE.Vector3(80, 80, 80);

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
      return Math.exp(-Math.pow(distance, 2) / 4000);
    };

    const generateRandomSquarePosition = () => {
      return new THREE.Vector3(
        Math.random() * 100, // X in [0, 100]
        Math.random() * 100, // Y in [0, 100]
        Math.random() * 100 // Z in [0, 100]
      );
    };

    const pts = new Array(40000).fill().map(() => {
      sizes.push(Math.random());
      sizes2.push(Math.random());
      pushShift();

      const position = generateRandomSquarePosition();
      const clusterProbability = calculateClusterProbability(position);

      const baseProbability = 0.02;
      thresholds.push(Math.random() > clusterProbability + baseProbability ? 0.9 + Math.random() * 0.1 : Math.random() * 0.3);

      return position;
    });

    for (let i = 0; i < 80000; i++) {
      sizes.push(Math.random());
      sizes2.push(Math.random());
      pushShift();

      const position = generateRandomSquarePosition();
      const clusterProbability = calculateClusterProbability(position);
      const baseProbability = 0.02;
      thresholds.push(Math.random() > clusterProbability + baseProbability ? 0.9 + Math.random() * 0.1 : Math.random() * 0.3);

      pts.push(position);
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("sizes2", new THREE.Float32BufferAttribute(sizes2, 1));
    g.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
    g.setAttribute("threshold", new THREE.Float32BufferAttribute(thresholds, 1));


    const style1Count = thresholds.filter((threshold) => threshold >= 0.5).length;
    const style2Count = thresholds.filter((threshold) => threshold < 0.5).length;
    const totalCount = style1Count + style2Count;

    console.log("Style 1 Count:", style1Count);
    console.log("Style 2 Count:", style2Count);
    const style1Width = (style1Count / totalCount) * 100; // Proportional width for style1
    const style2Width = (style2Count / totalCount) * 100; // Proportional width for style2


    const m = new THREE.PointsMaterial({
      size: 0.125,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      onBeforeCompile: (shader) => {
        shader.uniforms.time = gu.time;
        shader.uniforms.transitionProgress = gu.transitionProgress;
        shader.uniforms.finalStyle2Ratio = gu.finalStyle2Ratio;
        shader.uniforms.columnTransitionProgress = gu.columnTransitionProgress;
        shader.uniforms.style1ColumnCenter = { value: new THREE.Vector3(-20, 0, 0) };
        shader.uniforms.style2ColumnCenter = { value: new THREE.Vector3(20, 0, 0) };
        shader.uniforms.style1columnWidth = { value: style1Width };
        shader.uniforms.style2columnWidth = { value: style2Width };
        shader.vertexShader = `
        uniform float time;
        uniform float transitionProgress;
        uniform float finalStyle2Ratio;
        uniform float columnTransitionProgress;
        uniform float style1columnWidth;
        uniform float style2columnWidth;
        uniform vec3 style1ColumnCenter;
        uniform vec3 style2ColumnCenter;
        attribute float sizes;
        attribute float sizes2;
        attribute vec4 shift;
        attribute float threshold;
        varying vec3 vColor;

        ${shader.vertexShader}
    `.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>

            // Calculate target position for each style
            vec3 targetPosition;
            if (currentStyle < 0.5) {
                targetPosition = style1ColumnCenter + vec3(sizes2*10.0, sizes * style1columnWidth, 0.0);
            } else {
                targetPosition = style2ColumnCenter + vec3(sizes2*10.0, sizes * style2columnWidth, 0.0);
            }

            // Interpolate between original and target positions
            transformed = mix(transformed, targetPosition, columnTransitionProgress);
        `
    ).replace(
        `#include <color_vertex>`,
        `#include <color_vertex>
            float currentThreshold = mix(0.0, finalStyle2Ratio, transitionProgress);
            float currentStyle = step(threshold, currentThreshold);

            if (currentStyle < 0.5) {
                vColor = vec3(1.0, 1.0, 1.0); // Style 1 color
            } else {
                vColor = vec3(1.0, 0.0, 0.6); // Style 2 color
            }
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
    let systemAdded = false;

    const animate = () => {
      controls.update();
      const t = clock.getElapsedTime() * 0.5;
      gu.time.value = t * Math.PI;
    
      // Transition progress for changing color
      if (clock.getElapsedTime() > 20 && gu.transitionProgress.value < 1) {
        gu.transitionProgress.value = Math.min(1, gu.transitionProgress.value + 0.001);
      }
    
      // Start moving to columns once all points have changed colors
      if (gu.transitionProgress.value >= 1) {
        if (!gu.moveStartTime) {
          gu.moveStartTime = clock.getElapsedTime(); // Record the time when color change completes
        }
        const elapsedAfterColorChange = clock.getElapsedTime() - gu.moveStartTime;
    
        if (elapsedAfterColorChange > 30 && gu.columnTransitionProgress.value < 1) {
          if (gu.columnTransitionProgress.value > 0 && scene.children.includes(xAxis)) {
            scene.remove(xAxis, yAxis, zAxis);
          }
          gu.columnTransitionProgress.value = Math.min(1, gu.columnTransitionProgress.value + 0.001);
        }
      }
      if (gu.columnTransitionProgress.value >= 1 && !systemAdded) {
        addXYSystem();
        systemAdded = true; // Ensure it is only added once
      }
      renderer.render(scene, camera);
    };
    

    renderer.setAnimationLoop(animate);



    // Add coordinate axes with the origin at the corner of the square
    const createAxisLine = (start, end, color) => {
      const material = new THREE.LineBasicMaterial({ color });
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
    };
    
    const createGridlinesXY = (size, divisions, color, opacity = 0.5) => {
      const gridMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
      });
    
      const gridGeometry = new THREE.BufferGeometry();
      const gridVertices = [];
    
      const step = size / divisions;
    
      // Create lines for positive X (horizontal lines along Y-axis)
      for (let i = 0; i <= 2*divisions; i++) {
        const y = i * step; // Step along positive Y
        gridVertices.push(-size, y, 0); // Start of line
        gridVertices.push(size, y, 0); // End of line
      }
    
      // Create lines for positive Y (vertical lines along X-axis)
      for (let i = -divisions; i <= divisions; i++) {
        const x = i * step; // Step along positive X
        gridVertices.push(x, 0, 0); // Start of line
        gridVertices.push(x, 2*size, 0); // End of line
      }
    
      gridGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(gridVertices, 3)
      );
    
      return new THREE.LineSegments(gridGeometry, gridMaterial);
    };
    
    


    const addXYSystem = () => {
      // X-Axis (horizontal on x-y plane)
      const xAxis = createAxisLine(
        new THREE.Vector3(-50, 0, 0), // Start of the x-axis
        new THREE.Vector3(100, 0, 0),  // End of the x-axis
        0xffffff // White color
      );
      scene.add(xAxis);
    
      // Y-Axis (vertical on x-y plane)
      const yAxis = createAxisLine(
        new THREE.Vector3(-50, 0, 0), // Start of the y-axis
        new THREE.Vector3(-50, 150, 0), // End of the y-axis
        0xffffff // White color
      );
      scene.add(yAxis);
    
      // Gridlines on the X-Y plane
      const gridXY = createGridlinesXY(50, 50, 0xffffff, 0.3); // Semi-transparent grid
      scene.add(gridXY);
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
