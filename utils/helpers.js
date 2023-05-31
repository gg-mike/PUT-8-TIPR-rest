export const wrapper = async (req, res, callback) => {
  try {
    await callback(req, res);
  } catch (err) {
    return res.status(500).send(`[ERROR] ${err.message}`);
  }
}
