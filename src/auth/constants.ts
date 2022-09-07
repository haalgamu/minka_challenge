export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY || 'secretKey',
  experiesIn: process.env.JWT_EXPIRES_IN || '24h',
};
