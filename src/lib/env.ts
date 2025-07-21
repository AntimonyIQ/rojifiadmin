const env = {
  VITE_API_BASE_URL:
    import.meta.env.MODE === "production"
      ? "https://rojifi.qurulab.com/api/v1"
      : "https://kd56qjzw-8081.uks1.devtunnels.ms/api/v1",
  ENV: import.meta.env.MODE,
  
};

export default env;
