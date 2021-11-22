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

  it('responds to /retros', done => {
    request(app)
      .get('/retros')
      .expect(200, done);
  });

  it('responds to /retros/:retro_id', done => {
    let retro_id = "e0fef645-088d-4f13-b53a-ccb95f4f2131"
    request(app)
      .get(`/retros/${retro_id}`)
      .expect(200, done);
  });
});
