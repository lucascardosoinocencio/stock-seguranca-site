const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  try {
    const value = await kv.incr('visits:stock-seguranca');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ value });
  } catch (err) {
    return res.status(500).json({ error: 'counter unavailable' });
  }
};
