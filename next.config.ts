import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com', 'pxcfqkigxjrevuqkniwu.supabase.co'],
  },
  logging:{fetches:{fullUrl:true}}
};

export default nextConfig;
