/* 
 * Property of 0.tk
 * Settings Logic
 */

import React from 'react';
import { MacroSettings, GamepadState, HelpKey } from '../types';
import { MousePointer2, Clock, Settings2, Zap, RotateCcw, HelpCircle } from 'lucide-react';

interface Props {
  settings: MacroSettings;
  setSettings: React.Dispatch<React.SetStateAction<MacroSettings>>;
  gamepadState: GamepadState;
  listeningFor: 'main' | 'select' | null;
  setListeningFor: React.Dispatch<React.SetStateAction<'main' | 'select' | null>>;
  onShowHelp: (key: HelpKey) => void;
}

export const SettingsPanel: React.FC<Props> = ({ 
  settings, 
  setSettings, 
  gamepadState, 
  listeningFor, 
  setListeningFor,
  onShowHelp
}) => {

  const handleListenClick = (field: 'main' | 'select') => {
    setListeningFor(field);
  };

  // Listen for gamepad input when "listening" mode is active
  React.useEffect(() => {
    if (!listeningFor || !gamepadState.connected) return;

    const pressedIndex = gamepadState.buttons.findIndex(b => b.pressed);
    if (pressedIndex !== -1) {
      const buttonName = `Button ${pressedIndex}`;
      if (listeningFor === 'main') {
        setSettings(prev => ({ ...prev, selectedKey: buttonName }));
      } else {
        setSettings(prev => ({ ...prev, selectButton: buttonName }));
      }
      setListeningFor(null);
    }
  }, [gamepadState.buttons, listeningFor, gamepadState.connected, setSettings, setListeningFor]);


  return (
    <div className="bg-[#0B1120] border border-gray-800 rounded-xl p-6 shadow-xl w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-purple-500 text-xl font-bold border-b border-gray-800 pb-2 mb-4">
        اعدادات الماكرو
      </h2>

      {/* Input Group 1: Main Button */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-gray-400 text-sm">اضغط اي زر باليد (Edit)</label>
            <button onClick={() => onShowHelp('edit')} className="text-gray-500 hover:text-purple-400 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div 
            onClick={() => handleListenClick('main')}
            className={`w-full bg-[#111827] border cursor-pointer h-12 flex items-center px-4 rounded-lg transition-all
              ${listeningFor === 'main' ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-gray-700 hover:border-gray-500'}
            `}
          >
            <Settings2 className="w-5 h-5 text-gray-500 ml-3" />
            <span className={settings.selectedKey ? 'text-white' : 'text-gray-500'}>
              {listeningFor === 'main' ? 'Waiting for input...' : (settings.selectedKey || 'Not set')}
            </span>
            {listeningFor === 'main' && <span className="mr-auto text-xs text-purple-400 animate-pulse">Listening...</span>}
          </div>
        </div>

        {/* Input Group 2: Select Button */}
        <div className="relative group">
           <div className="flex items-center gap-2 mb-2">
            <label className="block text-gray-400 text-sm">زر السليكت (Select)</label>
            <button onClick={() => onShowHelp('select')} className="text-gray-500 hover:text-purple-400 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div 
            onClick={() => handleListenClick('select')}
            className={`w-full bg-[#111827] border cursor-pointer h-12 flex items-center px-4 rounded-lg transition-all
              ${listeningFor === 'select' ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-gray-700 hover:border-gray-500'}
            `}
          >
            <MousePointer2 className="w-5 h-5 text-gray-500 ml-3" />
             <span className={settings.selectButton ? 'text-white' : 'text-gray-500'}>
              {listeningFor === 'select' ? 'Waiting for input...' : (settings.selectButton || 'Not set')}
            </span>
             {listeningFor === 'select' && <span className="mr-auto text-xs text-purple-400 animate-pulse">Listening...</span>}
          </div>
        </div>

        {/* Input Group 3: Delay */}
        <div className="relative group">
           <div className="flex items-center gap-2 mb-2">
            <label className="block text-gray-400 text-sm">الديلاي (ms)</label>
            <button onClick={() => onShowHelp('delay')} className="text-gray-500 hover:text-purple-400 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full bg-[#111827] border border-gray-700 hover:border-gray-500 rounded-lg h-12 flex items-center px-4 transition-all">
            <Clock className="w-5 h-5 text-gray-500 ml-3" />
            <input 
              type="number" 
              value={settings.delay} 
              onChange={(e) => setSettings({...settings, delay: parseInt(e.target.value) || 0})}
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-4">
        <div className="flex gap-2">
           <button 
            onClick={() => setSettings(p => ({...p, useResetMacro: !p.useResetMacro}))}
            className={`flex-1 py-4 rounded-lg flex items-center justify-center space-x-2 space-x-reverse transition-all border
            ${settings.useResetMacro 
              ? 'bg-purple-500/10 border-purple-500 text-purple-500' 
              : 'bg-[#1e293b] border-transparent text-gray-400 hover:bg-[#283548]'}
            `}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-semibold">ضيف ماكرو مع ريست</span>
          </button>
          <button 
            onClick={() => onShowHelp('reset')} 
            className="w-12 flex items-center justify-center rounded-lg bg-[#1e293b] text-gray-500 hover:text-purple-400 hover:bg-[#283548] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
       
        <div className="flex gap-2">
          <button 
            onClick={() => setSettings(p => ({...p, breakPollingRate: !p.breakPollingRate}))}
            className={`flex-1 py-4 rounded-lg flex items-center justify-center space-x-2 space-x-reverse transition-all border
            ${settings.breakPollingRate 
              ? 'bg-purple-500/10 border-purple-500 text-purple-500' 
              : 'bg-[#1e293b] border-transparent text-gray-400 hover:bg-[#283548]'}
            `}
          >
            <Zap className="w-5 h-5" />
            <span className="font-semibold">كسر سرعه اليد بولينق ريت وتيربو</span>
          </button>
           <button 
            onClick={() => onShowHelp('turbo')} 
            className="w-12 flex items-center justify-center rounded-lg bg-[#1e293b] text-gray-500 hover:text-purple-400 hover:bg-[#283548] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

    </div>
  );
};