/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true },
  transpilePackages: [
    '@tiptap/core',
    '@tiptap/pm',
    '@tiptap/extensions',
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-underline',
    '@tiptap/extension-link',
    '@tiptap/extension-image',
    '@tiptap/extension-table',
    '@tiptap/extension-table-cell',
    '@tiptap/extension-table-header',
    '@tiptap/extension-table-row',
    '@tiptap/extension-text-align',
    '@tiptap/extension-color',
    '@tiptap/extension-text-style',
  ],
};

module.exports = nextConfig;
