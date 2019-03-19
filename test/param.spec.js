const expect = require('chai').expect;
const api = require('../src/api').Api();

describe('Testing Params', () => {
  it('Testing Error for GET And JSON Param', (done) => {
    expect(() => api.wrap('GET route', [api.Str('name', 'json')], 1))
      .to.throw('Can not use JSON parameter with GET requests.');
    done();
  });

  it('Testing Undefined Path Parameter', (done) => {
    expect(() => api.wrap('GET route/{otherId}', [api.Str('id', 'path')], 1))
      .to.throw('Path Parameter not defined in given path.');
    done();
  });

  it('Testing Unknown Parameter Position', (done) => {
    expect(() => api.wrap('GET route', [api.Str('id', 'unknown')], 1))
      .to.throw('Unknown Parameter Position: unknown');
    done();
  });

  it('Testing only one autoPrune FieldsParam per request', (done) => {
    expect(() => api.wrap('GET route', [
      api.FieldsParam('fields1', { paths: ['id'], autoPrune: true }),
      api.FieldsParam('fields2', { paths: ['id'], autoPrune: true })
    ], 1))
      .to.throw('Only one auto pruning "FieldsParam" per endpoint.');
    done();
  });

  it('Testing IsoDate Parameter (query)', () => {
    const param = api.IsoDate('value');
    expect(param.get({
      queryStringParameters: {
        value: '2008-09-15T15:53:00+05:00'
      }
    })).to.equal('2008-09-15T15:53:00+05:00');
    expect(() => param.get({
      queryStringParameters: {
        value: '2009-02-30T15:53:00+05:00'
      }
    })).to.throw('Invalid Value for query-Parameter "value" provided.');
    expect(() => param.get({
      queryStringParameters: {
        value: '2008-09-15T15:53:00'
      }
    })).to.throw('Invalid Value for query-Parameter "value" provided.');
  });

  it('Testing IsoDate Parameter (json)', () => {
    const param = api.IsoDate('value', 'json');
    expect(param.get({
      body: {
        value: '2008-09-15T15:53:00+05:00'
      }
    })).to.equal('2008-09-15T15:53:00+05:00');
    expect(() => param.get({
      body: {
        value: '2009-02-30T15:53:00+05:00'
      }
    })).to.throw('Invalid Value for json-Parameter "value" provided.');
    expect(() => param.get({
      body: {
        value: '2008-09-15T15:53:00'
      }
    })).to.throw('Invalid Value for json-Parameter "value" provided.');
  });

  it('Testing IsoDate Parameter Undefined (json)', () => {
    const param = api.IsoDate('value', 'json', false);
    expect(param.get({
      body: {}
    })).to.equal(undefined);
  });

  it('Testing StrList Parameter (query)', () => {
    const param = api.StrList('list');
    expect(param.get({
      queryStringParameters: {
        list: '["123","345"]'
      }
    })).to.deep.equal(['123', '345']);
    expect(() => param.get({
      queryStringParameters: {
        list: 'invalid'
      }
    })).to.throw('Invalid Value for query-Parameter "list" provided.');
  });

  it('Testing StrList Parameter (json)', () => {
    const param = api.StrList('list', 'json');
    expect(param.get({
      body: {
        list: ['123', '345']
      }
    })).to.deep.equal(['123', '345']);
    expect(() => param.get({
      body: {
        list: ['123', 213]
      }
    })).to.throw('Invalid Value for json-Parameter "list" provided.');
  });

  it('Testing NumberList Parameter (query)', () => {
    const param = api.NumberList('list');
    expect(param.get({
      queryStringParameters: {
        list: '[123.123,345.234]'
      }
    })).to.deep.equal([123.123, 345.234]);
    expect(() => param.get({
      queryStringParameters: {
        list: 'invalid'
      }
    })).to.throw('Invalid Value for query-Parameter "list" provided.');
  });

  it('Testing NumberList Parameter (json)', () => {
    const param = api.NumberList('list', 'json');
    expect(param.get({
      body: {
        list: [123.123, 345.234]
      }
    })).to.deep.equal([123.123, 345.234]);
    expect(() => param.get({
      body: {
        list: ['123', 213]
      }
    })).to.throw('Invalid Value for json-Parameter "list" provided.');
  });

  it('Testing GeoPoint Parameter (query)', () => {
    const param = api.GeoPoint('geoPoint');
    expect(param.get({
      queryStringParameters: {
        geoPoint: '[-119.491,49.892]'
      }
    })).to.deep.equal([-119.491, 49.892]);
    ['[-181,0]', '[181,0]', '[0,-91]', '[0,91]', '[0,0,0]'].forEach((geoPoint) => {
      expect(() => param.get({
        queryStringParameters: { geoPoint }
      }), `GeoPoint: ${geoPoint}`).to.throw('Invalid Value for query-Parameter "geoPoint" provided.');
    });
  });

  it('Testing GeoPoint Parameter (json)', () => {
    const param = api.GeoPoint('geoPoint', 'json');
    expect(param.get({
      body: {
        geoPoint: [-119.491, 49.892]
      }
    })).to.deep.equal([-119.491, 49.892]);
    [[-181, 0], [181, 0], [0, -91], [0, 91], [0, 0, 0], '0,0'].forEach((geoPoint) => {
      expect(() => param.get({
        body: { geoPoint }
      }), `GeoPoint: ${geoPoint}`).to.throw('Invalid Value for json-Parameter "geoPoint" provided.');
    });
  });

  it('Testing GeoRect Parameter (query)', () => {
    const param = api.GeoRect('geoRect');
    expect(param.get({
      queryStringParameters: {
        geoRect: '[-119.491,49.892,-121.491,49.101]'
      }
    })).to.deep.equal([-119.491, 49.892, -121.491, 49.101]);
    [
      '[181,0,0,0]', '[0,91,0,0]', '[0,0,181,0]', '[0,0,0,91]',
      '[-181,0,0,0]', '[0,-91,0,0]', '[0,0,-181,0]', '[0,0,0,-91]',
      '[-1', '[0]'
    ].forEach((geoRect) => {
      expect(() => param.get({
        queryStringParameters: { geoRect }
      }), `GeoRect: ${geoRect}`).to.throw('Invalid Value for query-Parameter "geoRect" provided.');
    });
  });

  it('Testing GeoRect Parameter (json)', () => {
    const param = api.GeoRect('geoRect', 'json');
    expect(param.get({
      body: {
        geoRect: [-119.491, 49.892, -121.491, 49.101]
      }
    })).to.deep.equal([-119.491, 49.892, -121.491, 49.101]);
    [
      [181, 0, 0, 0], [0, 91, 0, 0], [0, 0, 181, 0], [0, 0, 0, 91],
      [-181, 0, 0, 0], [0, -91, 0, 0], [0, 0, -181, 0], [0, 0, 0, -91],
      [0]
    ].forEach((geoRect) => {
      expect(() => param.get({
        body: { geoRect }
      }), `GeoRect: ${geoRect}`).to.throw('Invalid Value for json-Parameter "geoRect" provided.');
    });
  });

  it('Testing GeoShape Parameter (query)', () => {
    const param = api.GeoShape('geoShape');
    expect(param.get({
      queryStringParameters: {
        geoShape: '[[0,0],[0,1],[1,1],[1,0],[0,0]]'
      }
    })).to.deep.equal([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]);
    [
      'invalid', // parse error
      '[[0,0],[0,1],[1,1],[1,0]]', // open polygon
      '[[0,0],[0,1],[1,1],[1,1],[1,0],[0,0]]', // degenerate polygon
      '[[0,0],[0,1],[300,1],[1,0],[0,0]]', // invalid point
      '[[0,0],[0,1],[1,300],[1,0],[0,0]]' // invalid point
    ].forEach((geoShape) => {
      expect(() => param.get({
        queryStringParameters: { geoShape }
      })).to.throw('Invalid Value for query-Parameter "geoShape" provided.');
    });
  });

  it('Testing GeoShape Parameter (json)', () => {
    const param = api.GeoShape('geoShape', {}, 'json');
    expect(param.get({
      body: {
        geoShape: [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]
      }
    })).to.deep.equal([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]);
    [
      [[0, 0], [0, 1], [1, 1], [1, 0]], // open polygon
      [[0, 0], [0, 1], [1, 1], [1, 1], [1, 0], [0, 0]], // degenerate polygon
      [[0, 0], [0, 1], [300, 1], [1, 0], [0, 0]], // invalid point
      [[0, 0], [0, 1], [1, 300], [1, 0], [0, 0]] // invalid point
    ].forEach((geoShape) => {
      expect(() => param.get({
        body: { geoShape }
      })).to.throw('Invalid Value for json-Parameter "geoShape" provided.');
    });
  });

  it('Testing GeoShape Parameter with options (json)', () => {
    const param = api.GeoShape('geoShape', { maxPoints: 6, clockwise: true }, 'json');
    [
      [[0, 0], [0, 1], [1, 1], [1.1, 1.1], [1.2, 1.2], [1.3, 1.3], [1, 0], [0, 0]], // too large
      [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]] // not clockwise
    ].forEach((geoShape) => {
      expect(() => param.get({
        body: { geoShape }
      })).to.throw('Invalid Value for json-Parameter "geoShape" provided.');
    });
    const param2 = api.GeoShape('geoShape', { clockwise: false }, 'json');
    [
      [[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]] // not counter-clockwise
    ].forEach((geoShape) => {
      expect(() => param2.get({
        body: { geoShape }
      })).to.throw('Invalid Value for json-Parameter "geoShape" provided.');
    });
  });

  it('Testing Number Parameter (query)', () => {
    const param = api.Number('number');
    expect(param.get({ queryStringParameters: { number: '-12.34' } })).to.equal(-12.34);
    expect(() => param.get({
      queryStringParameters: { number: 'invalid' }
    })).to.throw('Invalid Value for query-Parameter "number" provided.');
  });

  it('Testing Number Parameter with options (query)', () => {
    const param = api.Number('number', { min: 0, max: 10 });
    expect(param.get({ queryStringParameters: { number: '1.234' } })).to.equal(1.234);
    ['-11', '-1', '11'].forEach((number) => {
      expect(() => param.get({
        queryStringParameters: { number }
      })).to.throw('Invalid Value for query-Parameter "number" provided.');
    });
  });

  it('Testing Number Parameter (json)', () => {
    const param = api.Number('number', {}, 'json');
    expect(param.get({
      body: { number: 12.34 }
    })).to.equal(12.34);
    ['12.34', 'string'].forEach((number) => {
      expect(() => param.get({ body: { number } })).to.throw('Invalid Value for json-Parameter "number" provided.');
    });
  });

  it('Testing Number Parameter with options (json)', () => {
    const param = api.Number('number', { min: 0, max: 10 }, 'json');
    expect(param.get({
      body: { number: 1.234 }
    })).to.equal(1.234);
    [-11, -1, 11].forEach((number) => {
      expect(() => param.get({ body: { number } })).to.throw('Invalid Value for json-Parameter "number" provided.');
    });
  });

  it('Testing Fields Parameter (query)', () => {
    const param = api.FieldsParam('param', { paths: ['id', 'user.id', 'user.name'] });
    expect(param.get({
      queryStringParameters: {
        param: 'id,user.id,user.name'
      }
    })).to.deep.equal('id,user.id,user.name');
    expect(() => param.get({
      queryStringParameters: {
        param: 'invalid'
      }
    })).to.throw('Invalid Value for query-Parameter "param" provided.');
  });

  it('Testing Fields Parameter (json)', () => {
    const param = api.FieldsParam('param', { paths: () => 'id,user(id,name)' }, 'json');
    expect(param.get({
      body: {
        param: 'id,user.id,user.name'
      }
    })).to.deep.equal('id,user.id,user.name');
    expect(() => param.get({
      body: {
        param: 'invalid'
      }
    })).to.throw('Invalid Value for json-Parameter "param" provided.');
  });
});
