import Phaser from 'phaser';
import { ASSETS } from '../../resource/assets.js';
export class LoadingScene extends Phaser.Scene {
  constructor() { super('loading'); }
  preload(): void {
    const label = this.add.text(20, 20, '리소스 로딩 중');
    this.load.on('progress', (progress: number) => label.setText(`로딩 ${Math.floor(progress * 100)}%`));
    this.load.once('loaderror', () => label.setText('리소스 로딩 실패. 앱을 다시 실행해 주세요.'));
    this.load.image(ASSETS.target.key, ASSETS.target.url);
  }
  create(): void { if (this.textures.exists(ASSETS.target.key)) this.scene.start('game'); }
}
