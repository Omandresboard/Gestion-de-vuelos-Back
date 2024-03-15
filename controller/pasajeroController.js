import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imagenes/Pasajeros"); // Directorio de destino para los archivos subidos
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop(); // Obtiene la extensión del archivo original
    cb(null, `${Date.now()}.${ext}`); // Asigna un nombre único al archivo
  },
});

const upload = multer({ storage }).single("foto"); // 'file' debe coincidir con el nombre del campo en el formulario

const pasajeros = async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).send("Hubo un error al cargar el archivo");
      }

      const conn = await new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      });

      let pasajero = {
        identificacion: req.body.identificacion,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        telefono: req.body.telefono,
        codvuelo: req.body.codvuelo,
      };

      // Verificar si se proporcionó una imagen
      if (req.file && req.file.filename) {
        pasajero.foto = req.file.filename;
      }

      console.log(pasajero);
      // Verificar si el pasajero ya existe
      const existingPasajero = await new Promise((resolve, reject) => {
        conn.query(
          "SELECT * FROM pasajero WHERE identificacion = ? AND codvuelo = ?",
          [pasajero.identificacion, pasajero.codvuelo],
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });


      if (existingPasajero.length > 0) {
        return res.status(400).json({ msg: "El pasajero ya existe" });
      }


      const result = await new Promise((resolve, reject) => {
        conn.query("INSERT INTO pasajero SET ?", [pasajero], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      console.log(result);

      if (result) {
        res.json({ msg: "Pasajero registrado exitosamente" });
      } else {
        res.status(500).json({ msg: "Error al registrar el pasajero" });
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.message || "Error interno del servidor";
      res.json({ msg: errorMessage });
    }
  });
};


const pasajeroExiste = async (req, res) => {
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
      email: req.body.email,
    };

    const usuarioDB = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM pasajero WHERE email = ?",
        [usuario.email],
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

    if (usuarioDB) {
      res.json({ msg: "Autenticación exitosa" });
    } else {
      res.status(404).json({ msg: "Usuario no encontrado" });
    }
  } catch (error) {
    const errorMessage = error.message || "Error interno del servidor";
    res.json({ msg: errorMessage });
  }
};

const pasajeroVuelos = async function (req, res) {
  console.log(req.params);
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

    const codvuelo = req.params.codvuelo;

    const pasajeros = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM pasajero WHERE codvuelo = ?",
        [codvuelo],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (pasajeros.length > 0) {
      res.json(pasajeros);
    } else {
      res
        .status(404)
        .json({ msg: "No se encontraron pasajeros para este código de vuelo" });
    }
  } catch (error) {
    const errorMessage = error.message || "Error interno del servidor";
    res.status(500).json({ msg: errorMessage });
  }
};

const eliminarPasajero = async function (req, res) {
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

    const idPasajero = req.params.pasajero;
    console.log(idPasajero);

    const usuarioDB = await new Promise((resolve, reject) => {
      conn.query(
        "SELECT * FROM pasajero WHERE id = ?",
        [idPasajero],
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

    console.log(usuarioDB);

    if (fs.existsSync(`./imagenes/Pasajeros/${usuarioDB.foto}` && usuarioDB.foto !== 'No-picture.png')) {
      fs.unlinkSync(`./imagenes/Pasajeros/${usuarioDB.foto}`);
    }

    await new Promise((resolve, reject) => {
      conn.query(
        "DELETE FROM pasajero WHERE id = ? AND codvuelo = ?",
        [idPasajero, req.params.codvuelo],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    res.json({
      msg: `El pasajero con ID ${idPasajero} ha sido eliminado correctamente del vuelo ${req.params.codvuelo}`,
    });
  } catch (error) {
    const errorMessage = error.message || "Error interno del servidor";
    res.status(500).json({ msg: errorMessage });
  }
};

const detallesPasajero = async function (req, res) {
  const conn = await new Promise((resolve, reject) => {
    req.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
  console.log(req.params);
  const pasajero = await new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM pasajero WHERE codvuelo=? AND id=?",
      [req.params.codvuelo, req.params.pasajero],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      }
    );
  });

  res.json(pasajero);
};

export {
  pasajeros,
  pasajeroExiste,
  pasajeroVuelos,
  eliminarPasajero,
  detallesPasajero,
};
