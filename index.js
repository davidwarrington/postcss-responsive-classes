/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  const customMediaNames = [];

  return {
    postcssPlugin: 'postcss-responsive-classes',

    AtRule: {
      responsive: (rule, { AtRule }) => {
        const responsiveVariants = customMediaNames.flatMap(variant => {
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

    Once(root) {
      const customMediaRules = root.nodes.filter(
        node => node.type === 'atrule' && node.name === 'custom-media'
      );

      customMediaRules.forEach(rule => {
        const [name] = rule.params.split(' ');
        const unprefixedName = name.replace(/^--/, '');

        customMediaNames.push(unprefixedName);
      });
    },
  };
};

module.exports.postcss = true;
