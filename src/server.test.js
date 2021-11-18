const request = require('supertest');
const { expect } = require('@jest/globals');

describe('loading express', function () {
  var { server, knex } = require('./server');
  beforeEach(function () {
  })

  afterEach(function (done) {
    server.close();
    done()
  });

  afterAll(() => {
    console.log('destroying the db connection, dawg.')
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

  it('responds to /users with json', function testUsers(done) {
    request(server)
      .get('/users')
      .expect(200, done)
  });

});
