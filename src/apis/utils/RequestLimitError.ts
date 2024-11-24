class RequestLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestLimitError';
  }
}

export default RequestLimitError;
