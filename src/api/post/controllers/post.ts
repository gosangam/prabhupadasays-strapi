import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => ({
    async getRandom(ctx) {
      const contentType = "api::post.post";

      // 1. Get the table name dynamically
      const tableName = strapi.getModel(contentType).collectionName;

      // 2. Determine the random function based on the DB client
      const client = strapi.db.config.connection.client;
      const randomFn =
        client === "postgres" || client === "sqlite3" ? "RANDOM()" : "RAND";

      // 3. Execute raw query to get a single random document_id
      // We filter by published_at is not null to ensure we only get published content
      const rawResult = await strapi.db.connection.raw(
        `SELECT document_id FROM ${tableName} WHERE is_approved IS TRUE ORDER BY ${randomFn} LIMIT 1`,
      );

      // SQL results vary by dialect (rows vs array)
      const result = rawResult.rows ? rawResult.rows[0] : rawResult[0];

      if (!result) {
        return ctx.notFound("No entries found");
      }

      // 4. Use Document Service to get the full data (handling localization/population)
      const entity = await strapi.documents(contentType).findOne({
        documentId: result.document_id,
        populate: {
          author: {
            fields: ["username"],
          },
          cover: {
            fields: ["url", "name", "alternativeText"],
          },
          topics: {
            fields: ["tag", "keywords"],
          },
        },
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    },
  }),
);
