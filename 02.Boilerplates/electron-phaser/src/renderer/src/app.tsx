import { PersistenceApi } from './apis/persistence.api.js';
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './core/game.config.js';
import { GreetingApi } from './apis/greeting.api.js';

const persistenceApi = new PersistenceApi();
const greetingApi = new GreetingApi();

export function App() {
  const host = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [loaded, setLoaded] = useState<number | null>(null);
  useEffect(() => { let active = true; void persistenceApi.load().then(data => { if (active) { setLoaded(data.score); setScore(data.score); } }).catch(error => { if (active) setStatus(String(error)); }); return () => { active = false; }; }, []);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (loaded === null) return;
    const game = new Phaser.Game(createGameConfig(host.current!, setScore, round === 0 ? loaded : 0));
    return () => game.destroy(true);
  }, [round, loaded]);

  async function checkDesktop(): Promise<void> {
    try {
      const result = await greetingApi.greet('플레이어');
      setStatus(result.success ? result.message : result.error);
    } catch {
      setStatus('Electron IPC를 사용할 수 없습니다.');
    }
  }

  return (
    <main>
      <h1>Phaser Game Starter</h1>
      <p>원을 클릭하세요. 점수: <output aria-live="polite">{score}</output></p>
      <div className="game-host" ref={host} aria-label="원 클릭 게임" />
      <nav>
        <button disabled={loaded === null} onClick={() => { setScore(0); setRound(value => value + 1); }}>다시 시작</button>
        <button disabled={loaded === null} onClick={() => void persistenceApi.save({ version: 1, score }).then(() => setStatus('저장 완료')).catch(error => setStatus(String(error)))}>점수 저장</button>
        <button onClick={() => void checkDesktop()}>데스크톱 연결 확인</button>
      </nav>
      <p role="status">{status}</p>
    </main>
  );
}
