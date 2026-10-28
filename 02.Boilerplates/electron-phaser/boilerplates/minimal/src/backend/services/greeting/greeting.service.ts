export function createGreeting(name: unknown): string {
  if (typeof name !== 'string') throw new TypeError('이름은 문자열이어야 합니다.');

  const normalized = name.trim();
  if (normalized.length < 1 || normalized.length > 40) {
    throw new RangeError('이름은 1~40자여야 합니다.');
  }

  return `안녕하세요, ${normalized}님.`;
}
