import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const LyraAvatar = () => {
  const controls = useAnimation();
  const avatarRef = useRef(null);
  const eyeLeftRef = useRef(null);
  const eyeRightRef = useRef(null);
  const [isIdle, setIsIdle] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  // Smooth entrance on mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, rotate: 0 });
    setHasEntered(true);
  }, [controls]);

  // Eye & head tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!avatarRef.current) return;
      const rect = avatarRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      const maxTilt = 10;

      controls.start({ rotateX: -y / 20, rotateY: x / 20 });

      const moveEye = (eye) => {
        if (!eye.current) return;
        const pupil = eye.current;
        const dx = Math.max(-8, Math.min(8, x / 20));
        const dy = Math.max(-8, Math.min(8, y / 20));
        pupil.style.transform = `translate(${dx}px, ${dy}px)`;
      };

      moveEye(eyeLeftRef);
      moveEye(eyeRightRef);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [controls]);

  // Idle detection
  useEffect(() => {
    let timeout = setTimeout(() => setIsIdle(true), 10000);
    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 10000);
    };
    window.addEventListener('mousemove', resetIdle);
    return () => window.removeEventListener('mousemove', resetIdle);
  }, []);

  return (
    <motion.div
      ref={avatarRef}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ type: 'spring', stiffness: 60 }}
      className="relative w-56 h-56 mx-auto mt-8"
    >
      {/* LYRA Face Image */}
      <img
        src="/lyra_avatar_transparent.png"
        alt="LYRA"
        className="w-full h-full object-contain"
      />

      {/* Eye overlays */}
      <div className="absolute top-[42%] left-[33%] w-4 h-4 bg-black rounded-full z-50" ref={eyeLeftRef} />
      <div className="absolute top-[42%] right-[33%] w-4 h-4 bg-black rounded-full z-50" ref={eyeRightRef} />

      {/* Glow ring */}
      <motion.div
        className="absolute w-full h-full rounded-full border border-cyan-300"
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Chest pulse when active */}
      {!isIdle && (
        <motion.div
          className="absolute top-2/3 left-1/2 w-20 h-10 bg-cyan-400 rounded-xl opacity-50 blur-xl"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Sleep state */}
      {isIdle && (
        <div className="absolute top-2/3 left-1/2 w-20 h-10 bg-gray-600 rounded-xl opacity-30 blur-xl" style={{ transform: 'translate(-50%, -50%)' }} />
      )}
    </motion.div>
  );
};

export default LyraAvatar;
