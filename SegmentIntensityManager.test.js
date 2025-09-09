const SegmentIntensityManager = require('./SegmentIntensityManager');
const sim = new SegmentIntensityManager();

test('simple add', () => {
  sim.add(10, 30, 1);
  expect(sim.getNumberLine()).toEqual([[10, 1], [30, 0]]);
  console.log("hi, received: ", sim.getNumberLine());
});

test('overlap via add', () => {
  sim.add(20, 40, 1);
  expect(sim.getNumberLine()).toEqual([[10, 1], [20, 2], [30, 1], [40, 0]]);
});

test('fuse via add', () => {
  sim.add(10, 40, -1);
  expect(sim.getNumberLine()).toEqual([[20, 1], [30, 0]]);
});

test('simple set', () => {
  sim.set(10, 30, 400);
  expect(sim.getNumberLine()).toEqual([[10, 400], [30, 0]]);
});