const authErrorHandler = async function (err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: 'Permission Denied: ' + err.message})
  } else {
    next(err)
  }
}

module.exports = {
  authErrorHandler,
};