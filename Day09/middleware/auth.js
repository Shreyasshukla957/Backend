
const Autho = (req, res, next) => {
  const auth = "ABCDEF";
  const ans = auth === "ABCDEF" ? 1 : 0;
  if (!ans) {
    res.status(403).send("Authorization failed");
  }

  next();
};

module.exports = {
    Autho,
}
