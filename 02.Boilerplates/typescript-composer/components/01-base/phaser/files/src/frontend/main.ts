import Phaser from 'phaser';
import { createDI } from './core/di.js';
import { createGameConfig } from './core/game.config.js';
import './style.css';

const parent = document.getElementById('game');
const status = document.getElementById('status');
const save = document.getElementById('save');
if (!parent || !status || !(save instanceof HTMLButtonElement)) {
  throw new Error('게임 화면 요소가 없습니다.');
}
const { persistence } = createDI();
let game: Phaser.Game | undefined;
let score = 0;
let disposed = false;
const showError = (error: unknown) => {
  status.textContent = error instanceof Error ? error.message : '저장 처리에 실패했습니다.';
};
const saveScore = async () => {
  save.disabled = true;
  try {
    await persistence.save({ version: 1, score });
    status.textContent = '저장했습니다.';
  } catch (error) {
    showError(error);
  } finally {
    save.disabled = false;
  }
};
save.addEventListener('click', saveScore);
void persistence.load().then(value => {
  if (disposed) return;
  score = value.score;
  status.textContent = `점수: ${score}`;
  game = new Phaser.Game(createGameConfig(parent, value => {
    score = value;
    status.textContent = `점수: ${score}`;
  }, score));
  save.disabled = false;
}).catch(showError);

if (import.meta.hot) import.meta.hot.dispose(() => {
  disposed = true;
  save.removeEventListener('click', saveScore);
  game?.destroy(true);
});
