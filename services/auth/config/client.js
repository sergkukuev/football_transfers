const   client  = require('./../app/models/client').ClientModel, 
        log     = require('./log');

client.remove(function(err){
    if (err)
        return log.Error('Can\'t remove client');
    let aggregator = new client({
        name        : 'aggregation',
        appId       : 'aggr_id',
        appSecret   : 'aggr_secret'
    });
    aggregator.save(function(err, res){
        if (err)
            return log.error('Can\'t create aggregation-client');
        return log.info('Successfully create aggregation client record {' + res.name + '}');
    });
});