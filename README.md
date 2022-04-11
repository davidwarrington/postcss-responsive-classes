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

**NOTE**: This does not work, the plugin has not been published yet.

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-responsive-classes
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
