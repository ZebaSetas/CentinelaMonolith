module.exports = class VagosController {
  hola = async(req, res) => {
    return res.status(200).json({
      error: 'Cant find bug'
    });

  }
}
