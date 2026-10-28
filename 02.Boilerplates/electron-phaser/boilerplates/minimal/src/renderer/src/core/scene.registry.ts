import { LoadingScene } from '../scenes/loading/loading.scene.js';
import Phaser from 'phaser';
import { MainScene } from '../scenes/main/main.scene.js';

export function createScenes(onScore: (score: number) => void, initialScore: number): Phaser.Scene[] {
  return [new LoadingScene(), new MainScene(onScore, initialScore)];
}
