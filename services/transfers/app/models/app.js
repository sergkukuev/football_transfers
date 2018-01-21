const   mongoose    = require('mongoose'),
        log         = require('./../../config/log');

const Schema  = mongoose.Schema;

const AppSchema = new Schema({
    name: {
        type: String, 
        unique: true,
        required: true
    },
    appId: {
        type: String, 
        required: true
    },
    appSecret: {
        type: String,
        required: true
    }
});

mongoose.model('App', AppSchema);

var model = mongoose.model('App');

function initialize(){
    return model.findOne({name : 'aggregation'}, function(err, app){
        if (err)
            log.error('Problem with data base');
        if (!app){
            let agg = new model({
                name        : 'aggregation',
                appId       : 'aggr_id',
                appSecret   : 'aggr_secret'
            });
            return agg.save(function(err, agg){
                if (err)
                    log.error('Can\'t saved aggregation');
                else {
                    let msg =  'Successfully create aggregation client record {' + agg.name + '}'; 
                    log.info(msg);
                }
                return;
            });
        }
        return;
    });
}

initialize();
module.exports.model = model;