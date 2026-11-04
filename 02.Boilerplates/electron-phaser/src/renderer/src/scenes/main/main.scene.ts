import Phaser from 'phaser';
import { ASSETS } from '../../resource/assets.js';

export class MainScene extends Phaser.Scene {
  constructor(private readonly onScore: (score: number) => void, private readonly initialScore: number) { super('game'); }

  create(): void {
    let score = this.initialScore;
    this.add.text(20, 20, '원을 클릭해 점수를 올리세요', { fontSize: '22px' });
    const target = this.add.image(320, 180, ASSETS.target.key).setInteractive({ useHandCursor: true });
    target.on('pointerdown', () => {
      this.onScore(++score);
      target.setPosition(Phaser.Math.Between(40, 600), Phaser.Math.Between(80, 320));
    });
  }
}
