const postcss = require('postcss');

const plugin = require('.');

async function run(input, output, options = {}) {
  const result = await postcss([plugin(options)]).process(input, {
    from: undefined,
  });
  expect(result.css.trim()).toEqual(output.trim());
  expect(result.warnings()).toHaveLength(0);
}

it('replaces at-rule with media-query alternatives', async () => {
  await run(
    `@responsive { .bg-tomato { background: tomato; } }`,
    [
      `.bg-tomato { background: tomato; }`,
      `@media (--sm) { .bg-tomato\\@sm { background: tomato; } }`,
    ].join(' ')
  );
});

it('supports multiple child nodes per at-rule', async () => {
  await run(
    `@responsive { .bg-tomato { background: tomato; } .bg-coral { background: coral; } }`,
    [
      `.bg-tomato { background: tomato; } .bg-coral { background: coral; }`,
      `@media (--sm) { .bg-tomato\\@sm { background: tomato; } .bg-coral\\@sm { background: coral; } }`,
    ].join(' ')
  );
});
