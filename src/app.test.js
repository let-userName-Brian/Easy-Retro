const request = require('supertest');
const { expect } = require('@jest/globals');
const { default: knex } = require('knex');


describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./app');
  });
  afterEach(function () {
    server.close();
  });

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

  // test /users
  it('responds to /users', function testUsers(done) {
    request(server)
      .get('/users')
      .expect(200, done)
  });
  
});
