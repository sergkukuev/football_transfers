process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../server.js'),
    should      = chai.should();

chai.use(chaiHttp);

describe('Test routes scouts service', function(){
    describe('Get scouts', function(){
        it('Good request /scouts/', function(done){
            chai.request(server)
            .get('/scouts/?page=0&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });
    describe('Get scouts', function(){
        it('Bad request /scouts/?count=5', function(done){
            chai.request(server)
            .get('/scouts/?count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get scouts', function(){
        it('Bad request /scouts/?page=0', function(done){
            chai.request(server)
            .get('/scouts/?page=0')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                //res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get scouts', function(){
        it('Bad request with page bad parameter', function(done){
            chai.request(server)
            .get('/scouts/?page=olol&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(5);
                done();
            });
        });
    });

    describe('Get scouts', function(){
        it('Bad request with count bad parameter', function(done){
            chai.request(server)
            .get('/scouts/?page=0&count=alal')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('Get scouts', function(){
        it('Bad request with negative page value', function(done){
            chai.request(server)
            .get('/scouts/?page=-1&count=5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('Get scouts', function(){
        it('Bad request with negative count value', function(done){
            chai.request(server)
            .get('/scouts/?page=1&count=-5')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('Get scout with id', function(){
        it('Good request', function(done){
            chai.request(server)
            .get('/scouts/5a428f6b77b2df230c2c3afa')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get scout with id', function(){
        it('Bad request without id', function(done){
            chai.request(server)
            .get('/scouts/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    describe('Get scouts with id', function(){
        it('Bad request with undefined id', function(done){
            chai.request(server)
            .get('/scouts/undefined')
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.status.should.eql('Error');
                done();
            });
        });
    });

    describe('Get scouts with name', function(){
        it('Good request with name', function(done){
            chai.request(server)
            .get('/scouts/byname/Scout0')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get scouts with name', function(){
        it('Bad request without name', function(done){
            chai.request(server)
            .get('/scouts/byname/')
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get scouts with name', function(){
        it('Bad request with undefined name', function(done){
            chai.request(server)
            .get('/scouts/byname/undefined')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });
});