import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  let token;
  console.log(req.headers)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("token:",token);
      const decoded = jwt.verify(token, "tu_llave_secreta");

      console.log(decoded)

      const conn = await new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });

      req.usuario = await new Promise((resolve, reject) => {
        conn.query(
          "SELECT * FROM usuario WHERE username = ?",
          [decoded.username],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result[0]);
            }
          }
        );
      });

      console.log(req.usuario)

      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }

  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
