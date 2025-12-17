/* 
 * Property of 0.tk
 * Main Application Logic
 * Protected by Anti-Tamper
 */

import React, { useState, useEffect } from 'react';
import { Gamepad2, Save, Play, Square, Power, MessageCircle, Info, ArrowRight, CheckCircle2, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { useGamepad } from './hooks/useGamepad';
import { GamepadVisualizer } from './components/GamepadVisualizer';
import { SettingsPanel } from './components/SettingsPanel';
import { InfoModal } from './components/InfoModal';
import { MacroSettings, AppStatus, HelpKey } from './types';

// Help Content Data
const HELP_CONTENT: Record<HelpKey, { title: string; description: string; recommendation?: string }> = {
  edit: {
    title: "زر الإديت (Edit Button)",
    description: "هذا هو الزر الأساسي الذي تستخدمه داخل اللعبة لفتح قائمة البناء (Edit). البرنامج يحتاج يعرف هذا الزر عشان يقدر يرسل أوامر التعديل بدالك.",
    recommendation: "اختر الزر اللي متعود عليه (مثل L3 أو الدائرة أو المثلث)."
  },
  select: {
    title: "زر السليكت (Select Button)",
    description: "هذا الزر هو المسؤول عن تحديد المربعات داخل البناء (Tile Selection). عند تفعيل الماكرو، البرنامج بيضغط هذا الزر نيابة عنك بسرعة فائقة.",
    recommendation: "عادة يكون زر R2 في يد السوني أو RT في يد الاكسبوكس."
  },
  delay: {
    title: "الديلاي (Delay)",
    description: "هو الوقت المستغرق بين كل خطوة وخطوة (بالمللي ثانية). تقليل الرقم يعني سرعة أكبر، لكن إذا كان جهازك أو الانترنت ضعيف، السرعة الزايدة ممكن تسبب تقطيع.",
    recommendation: "ينصح بوضعه بين 5ms إلى 15ms لأفضل توازن بين السرعة والثبات."
  },
  reset: {
    title: "ماكرو مع ريست (Instant Reset)",
    description: "عند تفعيل هذا الخيار، إذا ضغطت زر الإديت واللعبة اكتشفت انك ماسك بناء، البرنامج بيسوي (ريست) فوراً ويرجع الجدار زي ما كان بلمح البصر.",
    recommendation: "فعله إذا تبي تلعب بأسلوب سريع ومفاجئ للخصم."
  },
  turbo: {
    title: "كسر سرعة اليد (Polling Rate)",
    description: "هذه الخاصية تحاول تجبر اليد ترسل إشارات للكمبيوتر بشكل أسرع من المعتاد (Overclocking)، مما يقلل التأخير (Input Lag) بشكل ملحوظ.",
    recommendation: "استخدمها دايماً للحصول على أفضل استجابة ممكنة."
  }
};

function App() {
  const gamepadState = useGamepad();
  const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.READY);
  const [showAbout, setShowAbout] = useState(false);
  const [helpKey, setHelpKey] = useState<HelpKey | null>(null);
  const [discordCopied, setDiscordCopied] = useState(false);
  
  const [settings, setSettings] = useState<MacroSettings>({
    selectedKey: null,
    selectButton: null,
    delay: 0,
    useResetMacro: false,
    breakPollingRate: false,
  });
  const [listeningFor, setListeningFor] = useState<'main' | 'select' | null>(null);

  const handleStart = () => {
    if (!gamepadState.connected) {
      alert("الرجاء توصيل يد التحكم أولاً! (Please connect a controller first)");
      return;
    }
    if (!settings.selectedKey) {
      alert("الرجاء تحديد زر الإديت قبل التشغيل! (Please configure the Edit button)");
      return;
    }
    setAppStatus(AppStatus.RUNNING);
  };

  const handleStop = () => {
    setAppStatus(AppStatus.STOPPED);
    setTimeout(() => setAppStatus(AppStatus.READY), 1000);
  };

  const handleDiscordClick = () => {
    const username = '0.tk';
    navigator.clipboard.writeText(username).then(() => {
      setDiscordCopied(true);
      setTimeout(() => setDiscordCopied(false), 2500);
      // Open Discord web in a new tab to avoid generic login page
      window.open('https://discord.com/app', '_blank');
    }).catch(err => {
      console.error('Failed to copy!', err);
      alert(`Discord Username: ${username}`);
    });
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white relative transition-all duration-500 ${appStatus === AppStatus.RUNNING ? 'ring-4 ring-purple-500/20 ring-inset' : ''}`}>
      
      {/* Active Indicator Overlay */}
      {appStatus === AppStatus.RUNNING && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x z-50"></div>
      )}

      {/* Help Modal Overlay */}
      {helpKey && (
        <InfoModal 
          title={HELP_CONTENT[helpKey].title}
          description={HELP_CONTENT[helpKey].description}
          recommendation={HELP_CONTENT[helpKey].recommendation}
          onClose={() => setHelpKey(null)}
        />
      )}

      {/* Header */}
      <header className="pt-8 pb-4 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 className={`w-8 h-8 ${appStatus === AppStatus.RUNNING ? 'text-green-400 animate-pulse' : 'text-purple-500'}`} />
          <h1 className="text-3xl font-black tracking-tight text-purple-500">Ray controller macro</h1>
        </div>
        <button 
          onClick={() => setShowAbout(true)}
          className="group flex items-center justify-center gap-2 mx-auto text-gray-500 hover:text-purple-400 transition-all duration-300"
        >
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium underline underline-offset-4 decoration-dashed group-hover:decoration-purple-500">
            اضغط هنا لمعرفة المزيد عن التطبيق ومميزاته
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-20">
        
        {showAbout ? (
          /* About Page View */
          <div className="bg-[#0B1120] border border-gray-800 rounded-xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Info className="text-purple-500" />
                نبذة عن التطبيق
              </h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-[#1e293b] hover:bg-[#283548] px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع للقائمة</span>
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed text-lg">
                  برنامج <strong className="text-purple-400">Ray controller macro</strong> من تطوير <strong className="text-white">0.tk</strong> هو أداة احترافية مصممة للاعبي فورتنايت. يهدف البرنامج إلى تحسين سرعة الاستجابة وأتمتة عمليات البناء باستخدام خوارزميات آمنة.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Feature 1 */}
                <div className="bg-[#111827] p-5 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors">
                  <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    ماكرو الإديت (Edit Macro)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    عند تفعيل هذا الخيار، سيقوم البرنامج بدمج خطوات الإديت في ضغطة واحدة، مما يجعل التعديل فوريًا.
                  </p>
                </div>

                {/* Feature 2: Anti-Ban */}
                <div className="bg-[#111827] p-5 rounded-lg border border-green-500/30 hover:border-green-500/50 transition-colors">
                  <h3 className="text-green-400 font-bold text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    نظام حماية متطور (Anti-Ban)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    يستخدم البرنامج توقيتات عشوائية دقيقة (Humanization) لمحاكاة اللعب البشري الطبيعي، مما يجعله غير قابل للكشف وآمن تماماً من الحظر.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#111827] p-5 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors">
                  <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    الريست السريع (Instant Reset)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    بضغطة زر واحدة، يعيد البرنامج البناء إلى حالته الأصلية فورًا.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-[#111827] p-5 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-colors">
                  <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    تحكم كامل
                  </h3>
                  <p className="text-gray-400 text-sm">
                    واجهة مستخدم بسيطة وداكنة تتيح لك تخصيص الأزرار والسرعة بسهولة تامة.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-800 text-center">
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-purple-900/20"
              >
                فهمت، خذني للإعدادات
              </button>
            </div>
          </div>
        ) : (
          /* Main App View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section: Controller Status */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-purple-500 font-bold opacity-80 text-sm uppercase tracking-wider">Controller Status</h3>
                {appStatus === AppStatus.RUNNING ? (
                  <span className="bg-green-500/10 text-green-400 text-xs px-2 py-1 rounded border border-green-500/20 animate-pulse flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> PROTECTED
                  </span>
                ) : (
                  <span className="text-gray-600 text-xs px-2 py-1 border border-gray-800 rounded">Safe Mode Ready</span>
                )}
              </div>
              <div className={`bg-[#0B1120] border rounded-xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-500 ${appStatus === AppStatus.RUNNING ? 'border-green-500/30' : 'border-gray-800'}`}>
                <GamepadVisualizer state={gamepadState} />
              </div>
            </section>

            {/* Section: Settings */}
            <SettingsPanel 
              settings={settings} 
              setSettings={setSettings} 
              gamepadState={gamepadState}
              listeningFor={listeningFor}
              setListeningFor={setListeningFor}
              onShowHelp={setHelpKey}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#283548] text-gray-300 py-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-all font-semibold">
                <Save className="w-4 h-4" />
                <span>Save Mapping</span>
              </button>
              
              <button 
                onClick={handleStart}
                disabled={appStatus === AppStatus.RUNNING}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-semibold shadow-lg shadow-purple-900/20
                  ${appStatus === AppStatus.RUNNING 
                    ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-500 border-purple-500 text-white'}
                `}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{appStatus === AppStatus.RUNNING ? 'Running...' : 'Start Macro'}</span>
              </button>

              <button 
                onClick={handleStop}
                disabled={appStatus !== AppStatus.RUNNING}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-semibold
                   ${appStatus !== AppStatus.RUNNING
                    ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-900/30 hover:bg-red-900/50 border-red-800 text-red-400'}
                `}
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Macro</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-[#0B1120] border-t border-gray-800 py-3 px-6 fixed bottom-0 w-full flex items-center justify-between text-xs sm:text-sm z-50">
        <div className="flex items-center gap-2">
           <span className="text-gray-500">Status:</span>
           <span className={`font-mono font-bold ${appStatus === AppStatus.RUNNING ? 'text-green-400 animate-pulse' : 'text-purple-500'}`}>
             {appStatus.toUpperCase()}
           </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-gray-600">
           <span className="hidden sm:inline">© 2024 0.tk | Private Build</span>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Power className="w-4 h-4" />
            <span>طف البرنامج</span>
          </button>
          <button 
            onClick={handleDiscordClick}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group relative"
          >
            {discordCopied ? (
              <ClipboardCheck className="w-4 h-4 text-green-400" />
            ) : (
              <MessageCircle className="w-4 h-4 group-hover:text-purple-400" />
            )}
            <span className={discordCopied ? 'text-green-400 font-bold' : ''}>
              {discordCopied ? 'تم نسخ اليوزر: 0.tk' : 'حسابي دسكورد'}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;