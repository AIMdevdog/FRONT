import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875

// function CameraRotation() {
//   const camera = useThree(state => state.camera);
//   useEffect(() => {
//     camera.rotation.set(0, 0, 0.5);
//     camera.updateProjectionMatrix();
//   }, []);
//   return null;
// }


export default function Gallery2({ images, roomId }) {
  const [zCameraPosition, setZCameraPosition] = useState(0);
  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);
  return (
    <Canvas
      // gl={{ alpha: false }}
      // dpr={[1, 1.5]}
      style={{ width: "100vw", height: "100vh" }}
      camera={{ position: [0, 2, 15] }}
    >
      <pointLight
        position={[15, 15, 15]}
        intensity={0.1}
        castShadow
      />
      {/* <CameraRotation/> */}
      {/* <color attach="background" args={['rgb(19,19,20,0)']} />
      <fog attach="fog" args={['#191920', 0, 15]} /> */}
      <Environment preset="city" />
      <group position={[cameraPosition, zCameraPosition, yCameraPosition - 20]}>
        <Frames images={images} roomId={roomId} setCameraPosition={setCameraPosition} setYCameraPosition={setYCameraPosition} setZCameraPosition={setZCameraPosition} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.75, 2]}>
          <planeGeometry args={[58, 25]} />
          <MeshReflectorMaterial
            blur={[1000, 500]}
            resolution={2048}
            mixBlur={100}
            mixStrength={60}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#151515"
            metalness={0.5}
          />
        </mesh>
      </group>
    </Canvas>
  )
}

function Frames({ images, roomId, setCameraPosition, setYCameraPosition, setZCameraPosition, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = useRoute('/item/:id');
  const [rotationAngle, setRotationAngle] = useState(0);
  // console.log(yCameraPosition);
  const cameraMove = (e) => {
    switch (e.key) {
      case "e":
      case "E":
      case "ㄷ":
        setZCameraPosition(prev => prev + 0.2);
        break;
      case "q":
      case "Q":
      case "ㅂ":
        setZCameraPosition(prev => prev - 0.2);
        break;
      case "ArrowUp":
        setYCameraPosition(prev => prev + 0.2);
        break;
      case "ArrowDown":
        setYCameraPosition(prev => prev - 0.2);
        break;
      case "ArrowLeft":
        setCameraPosition(prev => prev + 0.2);
        break;
      case "ArrowRight":
        setCameraPosition(prev => prev - 0.2);
        break;
      case "a":
      case "A":
      case "ㅁ":
        setRotationAngle(prev => prev + 0.4);
        break;
      case "d":
      case "D":
      case "ㅇ":
        setRotationAngle(prev => prev - 0.4);
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", cameraMove);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", cameraMove);
    };
  }, []);

  useFrame((state, dt) => {
    state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt));
    state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt));
    state.camera.rotation.set(0, Math.PI/180*rotationAngle, 0);
  })
  return (
    <group
      ref={ref}
    // onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? `/room3/${roomId}` : '/item/' + e.object.name))}
    // onPointerMissed={() => setLocation(`/room3/${roomId}`)}
    >
      {images.map((props) => <Frame key={props.url} {...props} />)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const image = useRef();
  const frame = useRef();
  const name = getUuid(url);
  let xScale = 10;
  let yScale = 15;

  return (
    <group {...props} >
      <mesh
        name={name}
        scale={[xScale, yScale, 0.05]}
        position={[0, GOLDENRATIO / 2, -1]}>
        {/* <boxGeometry />
        <meshStandardMaterial color="#EAEAEA" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh> */}
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
    </group>
  )
}