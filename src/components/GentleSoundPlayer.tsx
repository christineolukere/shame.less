import React from 'react';
import { useGentleSound } from '../hooks/useGentleSound';

export default function GentleSoundPlayer() {
  const { sound, muted, loop, setMuted, setLoop, audioRef } = useGentleSound();

  return (
    <div className="rounded-xl bg-sage-50 border border-sage-100 p-4">
      <p className="text-sm font-semibold mb-2 text-sage-800">Today's calming sound</p>
      {sound && (
        <audio
          ref={audioRef}
          controls
          muted={muted}
          loop={loop}
          preload="auto"
          className="w-full rounded"
          src={sound}
        />
      )}
      <div className="mt-2 flex gap-4 text-sm">
        <button 
          onClick={() => setMuted(!muted)}
          className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
        >
          {muted ? '🔇 Unmute' : '🔊 Mute'}
        </button>
        <button 
          onClick={() => setLoop(!loop)}
          className="px-3 py-1 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
        >
          {loop ? '🔁 Looping' : '➡️ Play Once'}
        </button>
      </div>
    </div>
  );
}