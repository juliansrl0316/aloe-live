module.exports = {
  images: {
    domains: ["links.papareact.com", "fakestoreapi.com", "http2.mlstatic.com", "centrosthetic.com.co", "qhubocali.com", "i.pinimg.com", "qhubocali.com", "digitalmenta.com", "img.freepik.com", "https://res.cloudinary.com/", "freesvg.org"],
  },
  env: {
    stripe_public_key: "pk_test_51Ko9jPJG12VEnZfiEzS4OvLwbuJZElF4fxGlA2BA5VqzJDYSa16WYgNUfdk5Z30qmRzQvOeJNlKbFBMSu54pIPM000iIGwN9P7",
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};
