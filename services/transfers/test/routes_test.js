var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../server.js'),
    should      = chai.should();

chai.use(chaiHttp);

describe('Test routes transfers service', function(){
    describe('Get transfers', function(){
        it('Good request /transfers/', function(done){
            chai.request(server)
            .get('/transfers/?page=0&count=1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });
    describe('Get transfers', function(){
        it('Bad request /transfers/?count=1', function(done){
            chai.request(server)
            .get('/transfers/?count=1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers', function(){
        it('Bad request /catalog/?page=0', function(done){
            chai.request(server)
            .get('/transfers/?page=0')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers', function(){
        it('Bad request with page bad parameter', function(done){
            chai.request(server)
            .get('/transfers/?page=olol&count=1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers', function(){
        it('Bad request with count bad parameter', function(done){
            chai.request(server)
            .get('/transfers/?page=0&count=alal')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers', function(){
        it('Bad request with negative page value', function(done){
            chai.request(server)
            .get('/transfers/?page=-1&count=1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers', function(){
        it('Bad request with negative count value', function(done){
            chai.request(server)
            .get('/transfers/?page=1&count=-1')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfer with id', function(){
        it('Good request', function(done){
            chai.request(server)
            .get('/transfers/1a428f6b77b2df230c2c3afa')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
        });
    });

    describe('Get transfer with id', function(){
        it('Bad request without id', function(done){
            chai.request(server)
            .get('/transfers/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });

    describe('Get transfers with id', function(){
        it('Bad request with undefined id', function(done){
            chai.request(server)
            .get('/transfers/undefined')
            .end(function(err, res) {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.status.should.eql('Error');
                done();
            });
        });
    });
});