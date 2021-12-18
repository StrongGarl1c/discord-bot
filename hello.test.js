const hello = require('./hello');

test('should be an array', () => {
  expect(Array.isArray(hello)).toBeTruthy();
});
