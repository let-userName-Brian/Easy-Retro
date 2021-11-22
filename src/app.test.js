const request = require('supertest');
const { knex } = require('./knexConnector')

describe('loading express', function () {
  var { app } = require('./app');

  afterEach(function (done) {
    app.close();
    done()
  });

  afterAll(() => {
    knex.destroy();
  })

  it('responds to /', function testSlash(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('404 everything else', function testPath(done) {
    request(app)
      .get('/foo/bar')
      .expect(404, done);
  });
});
