/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    //  for images
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: "i.pravatar.cc",
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: "avatars.githubusercontent.com",
            pathname: '/**',
          }
        
        ],
    },
};

export default config;
