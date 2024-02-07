class ApplicationError extends Error {

  constructor(message,
    point,
    status) {
    super();
    this.data = {
      message,
      point,
      status
    };
  }
}

module.exports = ApplicationError;