import { describe, expect, it } from 'vitest';
import { clampPercent, createLock, prefersReducedMotion, staggerDelay } from './motion';

describe('staggerDelay', () => {
  it('starts at zero and steps evenly', () => {
    expect(staggerDelay(0)).toBe(0);
    expect(staggerDelay(1)).toBe(40);
    expect(staggerDelay(3)).toBe(120);
  });

  it('caps the delay so a big batch is not left waiting', () => {
    expect(staggerDelay(8)).toBe(320);
    expect(staggerDelay(200)).toBe(320);
  });

  it('treats bad input as no delay', () => {
    expect(staggerDelay(-2)).toBe(0);
    expect(staggerDelay(Number.NaN)).toBe(0);
  });
});

describe('clampPercent', () => {
  it('keeps values inside 0-100', () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(42)).toBe(42);
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(Number.NaN)).toBe(0);
  });
});

describe('createLock', () => {
  it('ignores a second call while the first is animating', () => {
    let t = 1000;
    const lock = createLock(() => t);
    let runs = 0;
    expect(lock.run(() => runs++, 460)).toBe(true);
    t += 100;
    expect(lock.isLocked()).toBe(true);
    expect(lock.run(() => runs++, 460)).toBe(false);
    t += 400;
    expect(lock.isLocked()).toBe(false);
    expect(lock.run(() => runs++, 460)).toBe(true);
    expect(runs).toBe(2);
  });

  it('never locks with a zero duration', () => {
    const lock = createLock(() => 5);
    let runs = 0;
    lock.run(() => runs++, 0);
    lock.run(() => runs++, 0);
    expect(runs).toBe(2);
  });
});

describe('prefersReducedMotion', () => {
  it('is false where there is no window', () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
