type ServiceErrors = "MESSAGE_DOES_NOT_EXIST";

class ServiceError {
  name: ServiceErrors;

  constructor(name: ServiceErrors) {
    this.name = name;
  }
}

export { ServiceError };
