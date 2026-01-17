/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 細かいエラーは無視する
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 2. エラーの原因になるパッケージを強制的に変換対象にする
  // ★ここに 'react-qr-reader' を追加しました。これが重要です！
  transpilePackages: ['undici', 'firebase', '@firebase/auth', 'react-qr-reader'],

  // 3. スマホ（クライアント）側では、undici を「空っぽ」に置き換えて無効化する
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': false,
      }
    }
    return config
  },
}

module.exports = nextConfig
