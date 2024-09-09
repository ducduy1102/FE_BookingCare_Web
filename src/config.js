//  c1
const config = {
  api: {
    API_BASE_URL: "http://localhost:4000/",
    ROUTER_BASE_NAME: null,
  },
  app: {
    /**
     * The base URL for all locations. If your app is served from a sub-directory on your server, you'll want to set
     * this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
     */
    ROUTER_BASE_NAME: null,
  },
};

// C2
// const config = {
//   api: {
//     API_BASE_URL: "http://localhost:4000/",
//     ROUTER_BASE_NAME: null,
//   },
//   app: {
//     ROUTER_BASE_NAME: null,
//   },
//   // Example of a method using an arrow function
//   getApiBaseUrl: () => config.api.API_BASE_URL,
//   getRouterBaseName: () => config.app.ROUTER_BASE_NAME,
// };

export default config;
