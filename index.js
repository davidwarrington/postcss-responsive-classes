/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-responsive-classes',

    AtRule: {
      responsive: (rule, { AtRule }) => {
        const responsiveVariants = ['sm'].flatMap(variant => {
          const wrapper = new AtRule({
            name: 'media',
            params: `(--${variant})`,
            nodes: rule.nodes.map(node =>
              node.clone({
                selectors: node.selectors.map(
                  selector => `${selector}\\@${variant}`
                ),
              })
            ),
          });

          return wrapper;
        });

        rule.replaceWith(...rule.nodes, ...responsiveVariants);
      },
    },
  };
};

module.exports.postcss = true;
