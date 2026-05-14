import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url, interactionState, onUpdateState, isEditable }) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useEffect(() => {
    if (interactionState && modelRef.current) {
      const { rotation } = interactionState;
      modelRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }, [interactionState]);

  useFrame(() => {
    if (isEditable && modelRef.current && onUpdateState) {
      const currentRotation = modelRef.current.rotation;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1} />;
};

const Viewer3D = ({ 
  fileUrl, 
  interactionState, 
  onSaveState, 
  isEditable = true 
}) => {
  const controlsRef = useRef();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!controlsRef.current) return;

    setSaving(true);
    const camera = controlsRef.current.object;
    const rotation = {
      x: 0,  
      y: 0,
      z: 0
    };

    const newState = {
      rotation,
      cameraPosition: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      },
      zoom: camera.zoom
    };

    onSaveState(newState).finally(() => setSaving(false));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} contactShadow={false}>
            <Model url={fileUrl} interactionState={interactionState} isEditable={isEditable} />
          </Stage>
          <OrbitControls 
            ref={controlsRef} 
            makeDefault 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        </Suspense>
      </Canvas>
      
      {isEditable && (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 10 }}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save View State'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Viewer3D;
