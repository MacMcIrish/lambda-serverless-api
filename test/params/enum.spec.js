const expect = require('chai').expect;
const api = require('../../src/index').Api();

describe('Testing Enum Parameter', () => {
  describe('Testing query param', () => {
    const queryParam = api.Enum('value', 'query', ['value', 'item']);
    it('Testing valid query parameter', () => {
      expect(queryParam.get({
        queryStringParameters: {
          value: 'value'
        }
      })).to.equal('value');
    });

    it('Testing invalid query parameter', () => {
      expect(() => queryParam.get({
        queryStringParameters: {
          value: 'invalid'
        }
      })).to.throw('Invalid Value for query-Parameter "value" provided.');
    });
  });

  describe('Testing json param', () => {
    const jsonParam = api.Enum('value', 'json', ['value', 'item']);
    it('Testing valid json parameter', () => {
      expect(jsonParam.get({
        body: {
          value: 'value'
        }
      })).to.equal('value');
    });

    it('Testing invalid json parameter', () => {
      expect(() => jsonParam.get({
        body: {
          value: 'invalid'
        }
      })).to.throw('Invalid Value for json-Parameter "value" provided.');
    });
  });
});
