import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';

const Ball = ({ country, position, onFinish }) => {
    const [ref, api] = useSphere(() => ({
        mass: 1,
        position,
        args: [1],
        material: { friction: 0.1, restitution: 0.7 }
    }));

    // Random speed factors for the race
    const speedFactor = useRef(5 + Math.random() * 5);
    const wobble = useRef(Math.random() * 2 - 1);

    useFrame(() => {
        // Apply force to move forward (negative Z)
        api.applyForce([wobble.current * 0.5, 0, -speedFactor.current], [0, 0, 0]);

        // Check for finish line
        const currentPos = ref.current.position;
        if (currentPos.z < -40) {
            onFinish(country);
        }
    });

    return (
        <mesh ref={ref} castShadow>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={country.color} roughness={0.3} metalness={0.2} />
        </mesh>
    );
};

export default Ball;
