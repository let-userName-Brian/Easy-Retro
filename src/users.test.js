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

  it('responds to /users with json', done => {
    request(server)
      .get('/users')
      .expect(200, done)
  });

});
