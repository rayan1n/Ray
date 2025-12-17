/* 
 * Property of 0.tk
 * Visualization Component
 */

import React from 'react';
import { GamepadState } from '../types';
import { Gamepad2 } from 'lucide-react';

interface Props {
  state: GamepadState;
}

export const GamepadVisualizer: React.FC<Props> = ({ state }) => {
  // Simple mapping for standard gamepad layout to visualize button presses
  // 0: A/Cross, 1: B/Circle, 2: X/Square, 3: Y/Triangle
  // 4: LB/L1, 5: RB/R1, 6: LT/L2, 7: RT/R2
  // 12: D-Up, 13: D-Down, 14: D-Left, 15: D-Right

  const isPressed = (index: number) => {
    return state.buttons[index]?.pressed;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className={`relative transition-all duration-500 ${state.connected ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
        {/* Glow Effect */}
        <div className={`absolute inset-0 bg-purple-500/20 blur-3xl rounded-full transition-opacity duration-500 ${state.connected ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Icon */}
        <Gamepad2 
          size={120} 
          className={`relative z-10 transition-colors duration-300 ${state.connected ? 'text-gray-200' : 'text-gray-700'}`} 
          strokeWidth={1}
        />

        {/* Visual Indicators for buttons (Simple overlay mapping) */}
        {state.connected && (
          <>
            {/* Face Buttons */}
            <div className={`absolute top-10 right-4 w-3 h-3 rounded-full bg-purple-500 transition-opacity ${isPressed(3) ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute top-14 right-2 w-3 h-3 rounded-full bg-purple-500 transition-opacity ${isPressed(1) ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute top-14 right-6 w-3 h-3 rounded-full bg-purple-500 transition-opacity ${isPressed(2) ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute top-18 right-4 w-3 h-3 rounded-full bg-purple-500 transition-opacity ${isPressed(0) ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* D-Pad */}
             <div className={`absolute top-14 left-4 w-3 h-3 rounded-full bg-purple-500 transition-opacity ${isPressed(12) ? 'opacity-100' : 'opacity-0'}`} />
          </>
        )}
      </div>

      <div className="text-center z-10">
        <p className={`text-lg font-medium transition-colors ${state.connected ? 'text-green-400' : 'text-gray-500'}`}>
          {state.connected ? `Connected: ${state.id.length > 20 ? state.id.substring(0, 20) + '...' : state.id}` : 'No Controller Connected'}
        </p>
      </div>
    </div>
  );
};