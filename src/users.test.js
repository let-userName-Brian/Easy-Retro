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

  it('responds to /users with json', function testUsers(done) {
    request(app)
      .get('/users')
      .expect(200, done)
  });

});
