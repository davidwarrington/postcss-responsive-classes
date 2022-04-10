/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-responsive-classes',

    AtRule: {
      responsive: (rule, { AtRule }) => {
        rule.nodes.forEach(node => {
          const responsiveRules = ['sm'].map(variant => {
            const wrapper = new AtRule({
              name: 'media',
              params: `(--${variant})`,
              nodes: [
                node.clone({
                  selector: `${node.selector}\\@${variant}`,
                }),
              ],
            });

            return wrapper;
          });

          node.after(responsiveRules);
        });

        rule.replaceWith(rule.nodes);
      },
    },
  };
};

module.exports.postcss = true;
