import { useEffect, useRef } from "react";
import * as THREE from "three";

export function QuizScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: document.createElement("canvas"),
    });

    const updateSize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Create floating particles
    const particles = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x646cff),
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < 200; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      particle.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.002,
          y: (Math.random() - 0.5) * 0.002,
          z: (Math.random() - 0.5) * 0.002,
        },
      };
      particles.add(particle);
    }

    scene.add(particles);
    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);

      particles.children.forEach((particle) => {
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;
      });

      camera.position.x = Math.sin(Date.now() * 0.0002) * 0.5;
      camera.position.y = Math.cos(Date.now() * 0.0002) * 0.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    mountRef.current.appendChild(renderer.domElement);
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 -z-10 opacity-30" />;
}
