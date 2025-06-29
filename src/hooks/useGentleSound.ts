import { useState, useEffect, useRef } from 'react';

const soundList = [
  '/sounds/medium-light-rain.mp3',
  '/sounds/amazon-forest-sounds-uruara-para-brazil.wav',
  '/sounds/tranquil-harmony-calm-piano.mp3',
  '/sounds/ocean-waves-big-lagoon.wav',
];

export function useGentleSound() {
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(true);
  const [sound, setSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const pick = soundList[Math.floor(Math.random() * soundList.length)];
    setSound(pick);
  }, []);

  return { sound, muted, loop, setMuted, setLoop, audioRef };
}