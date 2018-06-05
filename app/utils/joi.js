
function sendJoiValidationError(error, res) {
  return res.status(400).send({message: error.name});
}

module.exports = {
  sendJoiValidationError,
};