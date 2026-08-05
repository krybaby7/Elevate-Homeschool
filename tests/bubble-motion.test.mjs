import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAttraction } from '../assets/js/bubble-motion.mjs';

test('each result points from its own origin toward the pointer', () => {
  const left = calculateAttraction({ originX: 100, originY: 100, pointerX: 300, pointerY: 50, limit: 14 });
  const right = calculateAttraction({ originX: 400, originY: 100, pointerX: 300, pointerY: 50, limit: 20 });
  assert.ok(left.x > 0 && left.y < 0);
  assert.ok(right.x < 0 && right.y < 0);
});

test('travel never exceeds the bubble limit', () => {
  const result = calculateAttraction({ originX: 0, originY: 0, pointerX: 1000, pointerY: 1000, limit: 12 });
  assert.ok(Math.hypot(result.x, result.y) <= 12.000001);
});

test('zero distance produces no movement', () => {
  assert.deepEqual(calculateAttraction({ originX: 5, originY: 5, pointerX: 5, pointerY: 5, limit: 20 }), { x: 0, y: 0 });
});
