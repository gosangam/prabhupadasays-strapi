import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  // // Register the custom field
  strapi.customFields.register({
    name: 'url',
    plugin: 'url-input',
    type: 'text',
  });
};

export default register;
