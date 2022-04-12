const postcss = require('postcss');
const postcssCustomMedia = require('postcss-custom-media');

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
    `@custom-media --sm (min-width: 768px); @responsive { .bg-tomato { background: tomato; } }`,
    [
      `@custom-media --sm (min-width: 768px);`,
      `.bg-tomato { background: tomato; }`,
      `@media (--sm){ .sm\\:bg-tomato { background: tomato; } }`,
    ].join(' ')
  );
});

it('supports multiple child nodes per at-rule', async () => {
  await run(
    `@custom-media --sm (min-width: 780px); @responsive { .bg-tomato { background: tomato; } .bg-coral { background: coral; } }`,
    [
      `@custom-media --sm (min-width: 780px);`,
      `.bg-tomato { background: tomato; } .bg-coral { background: coral; }`,
      `@media (--sm){ .sm\\:bg-tomato { background: tomato; } .sm\\:bg-coral { background: coral; } }`,
    ].join(' ')
  );
});

it('supports multiple selectors per rule', async () => {
  await run(
    `@custom-media --sm (min-width: 780px); @responsive { .bg-tomato, .tomato-bg { background: tomato; } }`,
    [
      `@custom-media --sm (min-width: 780px);`,
      `.bg-tomato, .tomato-bg { background: tomato; }`,
      `@media (--sm){ .sm\\:bg-tomato, .sm\\:tomato-bg { background: tomato; } }`,
    ].join(' ')
  );
});

it('creates no media query if there are no custom-media at-rules', async () => {
  const input = `@responsive { .bg-tomato { background: tomato; } }`;
  const output = `.bg-tomato { background: tomato; }`;

  const result = await postcss([plugin, postcssCustomMedia]).process(input, {
    from: undefined,
  });
  expect(result.css.trim()).toEqual(output.trim());
});

it('provides a warning if there are no @custom-media values', async () => {
  const input = `@responsive { .bg-tomato { background: tomato; } }`;

  const result = await postcss([plugin, postcssCustomMedia]).process(input, {
    from: undefined,
  });
  expect(result.warnings().length).toEqual(1);
  expect(result.warnings()[0].text).toEqual(
    'Unable to find any @custom-media values; @responsive will have no effect.'
  );
});

it('creates one media query per custom-media at-rule', async () => {
  await run(
    `@custom-media --sm (min-width: 780px); @custom-media --md (min-width: 900px); @custom-media --lg (min-width: 1200px); @responsive { .bg-tomato { background: tomato; } }`,
    [
      `@custom-media --sm (min-width: 780px);`,
      `@custom-media --md (min-width: 900px);`,
      `@custom-media --lg (min-width: 1200px);`,
      `.bg-tomato { background: tomato; }`,
      `@media (--sm){ .sm\\:bg-tomato { background: tomato; } }`,
      `@media (--md){ .md\\:bg-tomato { background: tomato; } }`,
      `@media (--lg){ .lg\\:bg-tomato { background: tomato; } }`,
    ].join(' ')
  );
});

it('works alongside postcss-custom-media', async () => {
  const input = `@custom-media --sm (min-width: 768px); @custom-media --md (min-width: 900px); @responsive { .bg-tomato { background: tomato; } }`;
  const output = [
    `.bg-tomato { background: tomato; }`,
    `@media (min-width: 768px) { .sm\\:bg-tomato { background: tomato; } }`,
    `@media (min-width: 900px) { .md\\:bg-tomato { background: tomato; } }`,
  ].join(' ');

  const result = await postcss([plugin, postcssCustomMedia]).process(input, {
    from: undefined,
  });
  expect(result.css.trim()).toEqual(output.trim());
  expect(result.warnings()).toHaveLength(0);
});

it('supports a custom class naming format', async () => {
  await run(
    `@custom-media --sm (min-width: 780px); @responsive { .bg-tomato { background: tomato; } }`,
    [
      `@custom-media --sm (min-width: 780px);`,
      `.bg-tomato { background: tomato; }`,
      `@media (--sm){ .bg-tomato\\@sm { background: tomato; } }`,
    ].join(' '),
    {
      className: '[class]\\@[breakpoint]',
    }
  );
});
