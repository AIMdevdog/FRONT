import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import getUuid from 'uuid-by-string'

const GOLDENRATIO = 1.61803398875

export default function Gallery2({ images, roomId, cameraPosition, yCameraPosition }) {
  return (
    <Canvas
      // gl={{ alpha: false }}
      // dpr={[1, 1.5]}
      // style={{ height: "100%" }}
      camera={{ position: [0, 2, 15] }}
    >
      <color attach="background" args={['#191920']} />
      {/* <fog attach="fog" args={['#191920', 0, 15]} />
      <Environment preset="city" /> */}
      <group position={[cameraPosition, -1, yCameraPosition + 6]}>
          <Frames images={images} roomId={roomId} />
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

function Frames({ images, roomId, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
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
  useFrame((state, dt) => {
    state.camera.position.lerp(p, THREE.MathUtils.damp(0, 1, 3, dt))
    state.camera.quaternion.slerp(q, THREE.MathUtils.damp(0, 1, 3, dt))
  })
  return (
    <group
      ref={ref}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? `/room2/${roomId}` : '/item/' + e.object.name))}
      onPointerMissed={() => setLocation(`/room2/${roomId}`)}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  const [hovered, hover] = useState(false)
  const image = useRef();
  const frame = useRef();
  const name = getUuid(url);
  let xScale = 2 *GOLDENRATIO;
  let yScale = 2;
  useCursor(hovered)
  // console.log(props);
  if(props.center){
    // console.log("center!!!!!!!!!!!!!!!");
    xScale *= 2;
    // yScale *= 1.05;
  }
  useFrame((state) => {
    // image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    image.current.scale.x = THREE.MathUtils.lerp(image.current.scale.x, 0.85, 0.1)
    image.current.scale.y = THREE.MathUtils.lerp(image.current.scale.y, 0.9, 0.1)
    // frame.current.material.color.lerp(c.set(hovered ? 'orange' : 'white').convertSRGBToLinear(), 0.1)
  })
  return (
    <group {...props}>
      <mesh
        name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[xScale, yScale, 0.05]}
        position={[0, yScale / 2, 0]}>
        {/* <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} /> */}
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial color="#191920" toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text>
    </group>
  )
}