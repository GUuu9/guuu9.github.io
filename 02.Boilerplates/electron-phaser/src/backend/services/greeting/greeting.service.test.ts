import { describe, expect, it } from 'vitest';
import { createGreeting } from './greeting.service.js';

describe('createGreeting', () => {
  it('입력 앞뒤 공백을 정리해 인사말을 반환한다', () => {
    expect(createGreeting('  민지  ')).toBe('안녕하세요, 민지님.');
  });

  it('비문자열과 빈 이름, 40자를 넘는 이름을 거부한다', () => {
    expect(() => createGreeting(42)).toThrow('문자열');
    expect(() => createGreeting('   ')).toThrow('1~40자');
    expect(() => createGreeting('가'.repeat(41))).toThrow('1~40자');
  });
});
