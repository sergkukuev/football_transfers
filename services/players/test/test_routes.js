var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../server.js'),
    should      = chai.should();

chai.use(chaiHttp);

describe('Test routes players service', function(){
    describe('Get players', function(){
        it('Good request /players/', function(done){
            chai.request(server)
            .get('/players/?page=0&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });
    describe('Get players', function(){
        it('Bad request /players/?count=5', function(done){
            chai.request(server)
            .get('/players/?count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players', function(){
        it('Bad request /catalog/?page=0', function(done){
            chai.request(server)
            .get('/players/?page=0')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players', function(){
        it('Bad request with page bad parameter', function(done){
            chai.request(server)
            .get('/players/?page=olol&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players', function(){
        it('Bad request with count bad parameter', function(done){
            chai.request(server)
            .get('/players/?page=0&count=alal')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players', function(){
        it('Bad request with negative page value', function(done){
            chai.request(server)
            .get('/players/?page=-1&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players', function(){
        it('Bad request with negative count value', function(done){
            chai.request(server)
            .get('/players/?page=1&count=-5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get player with id', function(){
        it('Good request', function(done){
            chai.request(server)
            .get('/players/5a428f6b77b2df230c2c3afa')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get player with id', function(){
        it('Bad request without id', function(done){
            chai.request(server)
            .get('/players/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get players with id', function(){
        it('Bad request with undefined id', function(done){
            chai.request(server)
            .get('/players/undefined')
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.status.should.eql('Error');
                done();
            });
        });
    });

    describe('Get players with name', function(){
        it('Good request with name', function(done){
            chai.request(server)
            .get('/players/byname/Player5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get players with name', function(){
        it('Bad request without name', function(done){
            chai.request(server)
            .get('/players/byname/')
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get players with name', function(){
        it('Bad request with undefined name', function(done){
            chai.request(server)
            .get('/players/byname/undefined')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});