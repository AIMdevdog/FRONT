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


export default function Gallery3({ images, roomId, cameraPosition, yCameraPosition }) {
  const [xRotation, setXRotation] = useState(0);
  const [yRotation, setYRotation] = useState(0);

  return (
    <Canvas
      // gl={{ alpha: false }}
      // dpr={[1, 1.5]}
      camera={{ position: [0, 2, 15] }}
    >
      {/* <CameraRotation/> */}
      {/* <color attach="background" args={['rgb(19,19,20,0)']} /> */}
      {/* <fog attach="fog" args={['#191920', 0, 15]} />
      <Environment preset="city" /> */}
      <group position={[cameraPosition + xRotation, -0.3, yCameraPosition + yRotation - 8]}>
        <Frames images={images} roomId={roomId} yCameraPosition={yCameraPosition} setXRotation={setXRotation}  setYRotation={setYRotation}/>
        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={60}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#151515"
            metalness={0.5}
          />
        </mesh> */}
      </group>
    </Canvas>
  )
}

function Frames({ images, roomId, yCameraPosition, setXRotation, setYRotation ,q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const [cameraAngle, setCameraAngle] = useState(1);
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  // console.log(yCameraPosition);
  const cameraRotate = (e) => {
    switch (e.key) {
      case "e":
      case "E":
      case "ㄷ":
        setCameraAngle(prev => {
          prev = prev + 1;
          if (prev > 4) {
            prev = 1;
          }
          return prev;
        });
        break;

      case "q":
      case "Q":
      case "ㅂ":
        setCameraAngle(prev => {
          prev = prev - 1;
          if (prev < 1) {
            prev = 4;
          }
          return prev;
        });
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", cameraRotate);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", cameraRotate);
    };
  }, []);

  useFrame((state, dt) => {
    state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt))
    state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt))
    switch (cameraAngle) {
      case 1:
        state.camera.rotation.set(0, 0, 0);
        setXRotation(0);
        setYRotation(0);
        break;
      case 2:
        state.camera.rotation.set(0, - Math.PI / 2, 0);
        setXRotation(6);
        setYRotation(6);
        break;
      case 3:
        state.camera.rotation.set(0, - Math.PI, 0);
        setXRotation(0);
        setYRotation(12);
        break;
      case 4:
        state.camera.rotation.set(0, Math.PI / 2, 0);
        setXRotation(-6);
        setYRotation(6);
        break;
    }
  })
  return (
    <group
      ref={ref}
    // onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? `/room3/${roomId}` : '/item/' + e.object.name))}
    // onPointerMissed={() => setLocation(`/room3/${roomId}`)}
    >
      {images.map((props) => <Frame yCameraPosition={yCameraPosition} key={props.url} {...props} />)}
    </group>
  )
}

function Frame({ yCameraPosition, url, c = new THREE.Color(), ...props }) {
  const [hovered, hover] = useState(false)
  const image = useRef()
  const frame = useRef()
  const name = getUuid(url)
  let xScale = GOLDENRATIO * 5;
  let yScale = 6.5;
  useCursor(hovered)
  useFrame((state) => {
    // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85, 0.1)
    image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9, 0.1)
    // frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
  })
  if (props.ceil) {
    xScale = xScale * 10;
    yScale = yScale * 10;
  } else if(props.half){
    xScale /= 2;

  }
  return (
    <group {...props}>
      <mesh
        name={name}
        // onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        // onPointerOut={() => hover(false)}
        scale={[xScale, yScale, 0.05]}
        position={[0, GOLDENRATIO / 2, -1]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
}