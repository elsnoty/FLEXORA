import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com',
      },
      {
        hostname: 'pxcfqkigxjrevuqkniwu.supabase.co',
      },
    ],
  },
  logging:{fetches:{fullUrl:true}}
};

export default nextConfig;
