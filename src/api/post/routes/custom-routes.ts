export default {
  routes: [
    {
      method: 'GET',
      path: '/posts/random',
      handler: 'post.getRandom',
      config: {
        auth: false, // Set to true if you want to protect this endpoint
      },
    },
  ],
};