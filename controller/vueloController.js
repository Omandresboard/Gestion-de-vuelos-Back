
const obtenerVuelos = async (req, res) => {
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

        const vuelos = await new Promise((resolve, reject) => {
            conn.query('SELECT vuelo.*, aerolinea.descripcion AS aerolinea_desc, destino.descripcion AS destino_desc FROM vuelo INNER JOIN aerolinea ON vuelo.codaerolinea = aerolinea.codaerolinea INNER JOIN destino ON vuelo.coddestino = destino.coddestino', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.json(vuelos);
    } catch (error) {
        const errorMessage = error.message || 'Error interno del servidor';
        res.json({ msg: errorMessage });
    }
};

const obtenerVuelo = async (req, res) => {
    try {
        console.log(req.params.codvuelo)
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(connection);
                }
            });
        });

        conn.query('SELECT vuelo.*, destino.descripcion AS destino_desc, aerolinea.descripcion AS aerolinea_desc FROM vuelo INNER JOIN destino ON vuelo.coddestino = destino.coddestino INNER JOIN aerolinea ON vuelo.codaerolinea = aerolinea.codaerolinea WHERE vuelo.codvuelo = ?', [req.params.codvuelo], async (err, results) => {
            if (err) {
              reject(err);
            } else {
              const pasajeros = await new Promise((pasajerosResolve, pasajerosReject) => {
                conn.query('SELECT * FROM pasajero WHERE codvuelo = ?', [req.params.codvuelo], (pasajerosErr, pasajerosResults) => {
                  if (pasajerosErr) {
                    pasajerosReject(pasajerosErr);
                  } else {
                    pasajerosResolve(pasajerosResults);
                  }
                });
              });
        
              const vueloConPasajeros = {
                ...results[0],  // Información del vuelo
                pasajeros: pasajeros,  // Lista de pasajeros con codvuelo igual a req.params.codvuelo
              };
        
              res.json(vueloConPasajeros);
              console.log(vueloConPasajeros)
            }
          });
        
    } catch (error) {
        const errorMessage = error.message || 'Error interno del servidor';
        res.json({ msg: errorMessage });
    }
};
const registrar = async (req, res) => {
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

        const vuelo = {
            codvuelo: req.body.codvuelo,
            coddestino: req.body.coddestino,
            codaerolinea: req.body.codaerolinea,
            salaabordaje: req.body.salaabordaje,
            horasalida: req.body.horasalida,
            horallegada: req.body.horallegada,
        };

        console.log(vuelo)

        const existingVuelo = await new Promise((resolve, reject) => {
            conn.query("SELECT * FROM vuelo WHERE codvuelo = ?", [vuelo.codvuelo], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (existingVuelo.length > 0) {
            return res.status(400).json({ msg: 'El vuelo ya existe' });
        }

        const result = await new Promise((resolve, reject) => {
            conn.query("INSERT INTO vuelo SET ?", [vuelo], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result) {
            res.json({ msg: 'Vuelo registrado exitosamente' });
        } else {
            res.status(500).json({ msg: 'Error al registrar el vuelo' });
        }
    } catch (error) {
        const errorMessage = error.message || 'Error interno del servidor';
        res.json({ msg: errorMessage });
    }
};

const actualizarVuelos = async (req, res) => {
    console.log(req.body)
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
  
      const vueloUpdates = {
        horasalida: req.body.horasalida,
        horallegada: req.body.horallegada,
      };
  
      const result = await new Promise((resolve, reject) => {
        conn.query("UPDATE vuelo SET ? WHERE codvuelo = ?", [vueloUpdates, req.params.codvuelo], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      const vueloActualizado = await new Promise((resolve, reject) => {
        conn.query("SELECT * FROM vuelo WHERE codvuelo = ?", [req.params.codvuelo], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result[0]);
          }
        });
      });
  
      if (result.affectedRows > 0) {
        res.json({ msg: 'Vuelo actualizado exitosamente', vueloActualizado });
      } else {
        res.status(404).json({ msg: 'Vuelo no encontrado o no se realizaron cambios' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Error interno del servidor';
      res.json({ msg: errorMessage });
    }
  };

const eliminarVuelo = async function (req, res) {
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

        const codVuelo = req.params.codvuelo;

        await new Promise((resolve, reject) => {
            conn.query("DELETE FROM pasajero WHERE codvuelo = ?", [codVuelo], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        await new Promise((resolve, reject) => {
            conn.query("DELETE FROM vuelo WHERE codvuelo = ?", [codVuelo], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        res.json({ msg: `El vuelo con código ${codVuelo} ha sido eliminado correctamente` });
    } catch (error) {
        const errorMessage = error.message || 'Error interno del servidor';
        res.status(500).json({ msg: errorMessage });
    }
};

export { obtenerVuelos, registrar, actualizarVuelos, obtenerVuelo, eliminarVuelo };
