import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ingreso = async (req, res) => {
  try {
    const conn = await new Promise((resolve, reject) => {
      req.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });

    const usuario = {
      username: req.body.username,
      password: req.body.password,
    };

    // Verificar si el usuario ya existe
    const existingUser = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM usuario WHERE username = ?",
        [usuario.username],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(usuario.password, salt);
    usuario.password = hashedPassword;

    const result = await new Promise((resolve, reject) => {
      conn.query("INSERT INTO usuario SET ?", [usuario], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (!result) {
      res.status(500).json({ msg: "Error al registrar el usuario" });
    }else{
        res.status(200).json({ msg: 'Usuario registrado exitosamente'})
    }
  } catch (error) {
    const errorMessage = error.message || "Error interno del servidor";
    res.json({ msg: errorMessage });
  }
};

// Resto del código de autenticar y exportaciones sigue igual

const autenticar = async (req, res) => {
  try {
    const conn = await new Promise((resolve, reject) => {
      req.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          resolve(connection);
        }
      });
    });

    const usuario = {
      username: req.body.username,
      password: req.body.password,
    };

    const usuarioDB = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT username, password, ID FROM usuario WHERE username = ?",
        [usuario.username],
        (err, result) => {
          if (err) {
            reject(err);
          } else if (result.length === 0) {
            reject(new Error("No existe el usuario"));
          } else {
            resolve(result[0]);
          }
        }
      );
    });

    const { ID, username } = usuarioDB;

    if (usuarioDB) {
      const validPassword = await bcrypt.compare(
        usuario.password,
        usuarioDB.password
      );
      if (validPassword) {
        const token = jwt.sign(
          { username: usuarioDB.username },
          "tu_llave_secreta",
          { expiresIn: "30d" }
        );

        // Guardar el token en la base de datos
        const updateToken = await new Promise((resolve, reject) => {
          conn.query(
            "UPDATE usuario SET token = ? WHERE username = ?",
            [token, usuario.username],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });

        console.log(updateToken)

        if (updateToken) {
            res.json({
              msg: "Autenticación exitosa",
              usuario: { ID, username, token },
            });
        } else {
          res.status(500).json({ msg: "Error al actualizar el token" });
        }
      } else {
        res.status(401).json({ msg: "Contraseña Incorrecta" });
      }
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(error.message);
    const errorMessage = error.message || "Error interno del servidor";
    res.status(error.message ? 404 : 500).json({ msg: errorMessage });
  }
};

const perfil = async (req, res) => {
    const { usuario } = req

    res.json(usuario)
}

export { ingreso, autenticar, perfil};
