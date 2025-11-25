import React from 'react';
import { usePlane } from '@react-three/cannon';

const Track = () => {
    // The Floor
    const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0, 0],
        material: { friction: 0.1, restitution: 0.5 }
    }));

    return (
        <group>
            {/* Floor Visual */}
            <mesh ref={ref} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* Grid Helper */}
            <gridHelper args={[100, 100, 0xffffff, 0x334155]} position={[0, 0.01, 0]} />

            {/* Finish Line */}
            <mesh position={[0, 0.02, -40]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 2]} />
                <meshStandardMaterial color="#fbbf24" />
            </mesh>
        </group>
    );
};

export default Track;
