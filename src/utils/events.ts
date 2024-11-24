const eventRegister = (type: string, listener: (event: Event) => void) => {
  document.addEventListener(type, listener);
};

const eventRemove = (type: string, listener: (event: Event) => void) => {
  document.removeEventListener(type, listener);
};

const eventEmit = <T>(type: string, data?: T) => {
  const event = new CustomEvent<T>(type, { detail: data });

  document.dispatchEvent(event);
};

export { eventRegister, eventRemove, eventEmit };
