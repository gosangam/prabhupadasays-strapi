import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'url',
      pluginId: 'url-input',
      type: 'string',
      intlLabel: {
        id: 'url-input.label',
        defaultMessage: 'URL',
      },
      intlDescription: {
        id: 'url-input.description',
        defaultMessage: 'A clickable URL field with validation',
      },
      icon: PluginIcon,
      components: {
        Input: async () =>
          import('./components/Input').then((module) => ({
            default: module.default,
          })),
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
