export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "script-src": [
            "'self'",
            "unsafe-inline",
            "https://maps.googleapis.com",
          ],
          "media-src": [
            "'self'",
            "blob:",
            "data:",
            "s3.prabhupadasays.com",
            "a7d04b7578371b28c4c80447ec0854b9.r2.cloudflarestorage.com"
          ],
          "img-src": [
            "'self'",
            "blob:",
            "data:",
            "s3.prabhupadasays.com",
            "a7d04b7578371b28c4c80447ec0854b9.r2.cloudflarestorage.com"
          ],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
