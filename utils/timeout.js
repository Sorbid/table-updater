function timeout(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

module.exports = timeout;
