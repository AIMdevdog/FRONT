import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875


export default function Gallery1({ images, cameraAngle, cameraPosition, yCameraPosition }) {
  const [xRotation, setXRotation] = useState(0);
  const [yRotation, setYRotation] = useState(0);

  return (
    <Canvas
      camera={{ position: [0, 2, 15] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <group position={[cameraPosition + xRotation + 1, 1, yCameraPosition + yRotation+1]}>
        <Frames images={images} cameraAngle={cameraAngle} yCameraPosition={yCameraPosition} setXRotation={setXRotation} setYRotation={setYRotation} />
      </group>
    </Canvas>
  )
}

function Frames({ images, cameraAngle, yCameraPosition, setXRotation, setYRotation, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()

  useFrame((state, dt) => {
    // state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt))
    // state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt))
    switch (cameraAngle) {
      case 0:
        state.camera.rotation.set(0, 0, 0);
        setXRotation(0);
        setYRotation(0);
        break;
      case 1:
        state.camera.rotation.set(0, - Math.PI / 2, 0);
        setXRotation(3.5);
        setYRotation(5);
        break;
      case 2:
        state.camera.rotation.set(0, - Math.PI, 0);
        setXRotation(0);
        setYRotation(11.5);
        break;
      case 3:
        state.camera.rotation.set(0, Math.PI / 2, 0);
        setXRotation(-4);
        setYRotation(6.5);
        break;
    }
  })
  return (
    <group
      ref={ref}
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
  let xScale = GOLDENRATIO * 4;
  let yScale = 5.5;
  useCursor(hovered)
  useFrame((state) => {
    // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85, 0.85)
    image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9, 0.85)
    // frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
  })
  if (props.ceil) {
    xScale *= 8;
    yScale *= 12;
  } else if (props.half) {
    xScale /= 2;
  } else if (props.wall) {
    xScale *= 3;
  }

  return (
    <group {...props} >
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