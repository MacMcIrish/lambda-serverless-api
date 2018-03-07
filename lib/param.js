const get = require("lodash.get");
const response = require("./response");

const positionMapping = {
  query: "queryStringParameters",
  json: "body",
  path: "pathParameters",
  header: "headers",
  context: "requestContext"
};

class Param {
  constructor(name, position = 'query', required = true) {
    if (Object.keys(positionMapping).indexOf(position) === -1) {
      throw new Error(`Parameter Position needs to be one of: ${Object.keys(positionMapping).join(", ")}`);
    }
    this.name = name;
    this.position = position;
    this.required = required;
    this.type = null;
  }

  // eslint-disable-next-line class-methods-use-this
  validate(value) {
    return true;
  }

  get(event) {
    const result = get(event, `${positionMapping[this.position]}.${this.name}`);
    if (result === undefined) {
      if (this.required) {
        throw response.ApiError(`Required ${this.position}-Parameter "${this.name}" missing.`, 400, 99002);
      }
    } else if (!this.validate(result)) {
      throw response.ApiError(`Invalid Value for ${this.position}-Parameter "${this.name}" provided.`, 400, 99003, {
        value: result
      });
    }
    return result;
  }
}

class Str extends Param {
  constructor(...args) {
    super(...args);
    this.type = "string";
  }
  validate(value) {
    let valid = super.validate(value);
    if (!(typeof value === 'string' || value instanceof String)) {
      valid = false;
    }
    return valid;
  }
}
module.exports.Str = (...args) => new Str(...args);

class Email extends Str {
  validate(value) {
    let valid = super.validate(value);
    if (!value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
      valid = false;
    }
    return valid;
  }
}
module.exports.Email = (...args) => new Email(...args);