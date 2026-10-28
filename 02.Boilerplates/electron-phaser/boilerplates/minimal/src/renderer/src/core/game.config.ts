import Phaser from 'phaser';
import { createScenes } from './scene.registry.js';

export function createGameConfig(parent: HTMLElement, onScore: (score: number) => void, initialScore: number): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 640,
    height: 360,
    backgroundColor: '#172334',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: createScenes(onScore, initialScore),
  };
}
