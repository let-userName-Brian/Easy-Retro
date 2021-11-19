const request = require('supertest');
const { knex } = require('./knexConnector')

describe('loading express', function () {
  var { server } = require('./server');

  afterEach(function (done) {
    server.close();
    done()
  });

  afterAll(() => {
    knex.destroy();
  })

  it('responds to /users with json', function testUsers(done) {
    request(server)
      .get('/users')
      .expect(200, done)
  });

});
