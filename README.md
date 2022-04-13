# postcss-responsive-classes

[PostCSS] plugin for generating classes at multiple breakpoints.

[postcss]: https://github.com/postcss/postcss

```css
/* Input example */

@custom-media --sm (min-width: 768px);
@custom-media --md (min-width: 900px);

@responsive {
  .bg-tomato {
    background: tomato;
  }

  .bg-coral {
    background: coral;
  }
}
```

```css
/* Output example */

.bg-tomato {
  background: tomato;
}

.bg-coral {
  background: coral;
}

@media (min-width: 768px) {
  .sm\:bg-tomato {
    background: tomato;
  }

  .sm\:bg-coral {
    background: coral;
  }
}

@media (min-width: 900px) {
  .md\:bg-tomato {
    background: tomato;
  }

  .md\:bg-coral {
    background: coral;
  }
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-preset-env postcss-responsive-classes
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-classes'),
    require('postcss-preset-env')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

## Options

### className

The `className` option allows you to provide a template for the generated classes. Use `[class]` to represent the class extracted from your CSS file and `[breakpoint]` to represent the breakpoint name that will be generated.

For example, the following configuration:

```js
postcssResponsiveClasses({
  className: `[class]--[breakpoint]`,
})
```

Given this input:

```css
@custom-media --sm (min-width: 780px);
@custom-media --md (min-width: 900px);

@responsive {
  .hide {
    display: none;
  }
}
```

Would generate:

```css
.hide {
  display: none;
}

@media (min-width: 780px) {
  .hide--sm {
    display: none;
  }
}

@media (min-width: 900px) {
  .hide--md {
    display: none;
  }
}
```

Default: `[breakpoint]\\:[class]`
