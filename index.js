function buildClassName(template, className, breakpoint) {
  const classString = template
    .replace('[class]', className.replace(/^\./, ''))
    .replace('[breakpoint]', breakpoint);

  return `.${classString}`;
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = ({ className = '[class]\\@[breakpoint]' } = {}) => {
  const customMediaNames = [];

  return {
    postcssPlugin: 'postcss-responsive-classes',

    Once(root, { AtRule, result }) {
      const customMediaRules = root.nodes.filter(
        node => node.type === 'atrule' && node.name === 'custom-media'
      );

      customMediaRules.forEach(rule => {
        const [name] = rule.params.split(' ');
        const unprefixedName = name.replace(/^--/, '');

        customMediaNames.push(unprefixedName);
      });

      /**
       * @todo move back to `plugin.AtRule.responsive` once
       * `postcss-custom-media` plugin is updated to use
       * the postcss event api
       */
      root.walkAtRules('responsive', rule => {
        if (customMediaNames.length === 0) {
          rule.warn(
            result,
            'Unable to find any @custom-media values; @responsive will have no effect.'
          );
        }

        const responsiveVariants = customMediaNames.flatMap(variant => {
          const wrapper = new AtRule({
            name: 'media',
            params: `(--${variant})`,
            nodes: rule.nodes.map(node =>
              node.clone({
                selectors: node.selectors.map(selector =>
                  buildClassName(className, selector, variant)
                ),
              })
            ),
          });

          return wrapper;
        });

        rule.replaceWith(...rule.nodes, ...responsiveVariants);
      });
    },
  };
};

module.exports.postcss = true;
