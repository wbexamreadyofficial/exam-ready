import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old, role-less URLs keep working (bookmarks, emails, cached links).
  async redirects() {
    return [
      { source: "/dashboard", destination: "/student/dashboard", permanent: false },
      { source: "/profile", destination: "/student/profile", permanent: false },
      { source: "/results", destination: "/student/results", permanent: false },
      { source: "/subscriptions", destination: "/student/subscriptions", permanent: false },
      { source: "/exam/:path*", destination: "/student/exam/:path*", permanent: false },
      { source: "/quiz/:path*", destination: "/student/quiz/:path*", permanent: false },
      { source: "/examiner", destination: "/examiner/dashboard", permanent: false },
      { source: "/partner", destination: "/partner/dashboard", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
