/* 
 * Property of 0.tk
 * Low-level gamepad polling engine.
 */

import { useState, useEffect, useRef } from 'react';
import { GamepadState } from '../types';

export const useGamepad = () => {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    connected: false,
    id: '',
    buttons: [],
    axes: [],
  });

  const requestRef = useRef<number>(0);

  const scanGamepads = () => {
    const gamepads = navigator.getGamepads();
    let activeGamepad: Gamepad | null = null;

    // Find the first connected gamepad
    for (const gp of gamepads) {
      if (gp) {
        activeGamepad = gp;
        break;
      }
    }

    if (activeGamepad) {
      setGamepadState({
        connected: true,
        id: activeGamepad.id,
        buttons: activeGamepad.buttons,
        axes: activeGamepad.axes,
      });
    } else {
      setGamepadState((prev) => (prev.connected ? { ...prev, connected: false } : prev));
    }

    requestRef.current = requestAnimationFrame(scanGamepads);
  };

  useEffect(() => {
    window.addEventListener("gamepadconnected", scanGamepads);
    window.addEventListener("gamepaddisconnected", scanGamepads);
    
    // Start polling loop
    requestRef.current = requestAnimationFrame(scanGamepads);

    return () => {
      window.removeEventListener("gamepadconnected", scanGamepads);
      window.removeEventListener("gamepaddisconnected", scanGamepads);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return gamepadState;
};