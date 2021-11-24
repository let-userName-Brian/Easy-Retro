const request = require('supertest');
const { knex } = require('./knexConnector')
var { server } = require('./app');

describe('loading express', function () {

  afterEach(function (done) {
    server.close();
    done()
  });

  afterAll(() => {
    knex.destroy();
  })

  it('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
