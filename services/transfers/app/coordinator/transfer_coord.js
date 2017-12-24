module.exports = {
    // get player by id
    getPlayer : function(id, callback){
        const host      = 'http://127.0.0.1:3001'
        const url       = host+'/players/' + id;
        const options   = createOptions(url, 'GET');
        createAndSendGetHttpRequest(url, options,null,function(err, status, response){
            if(err)       
                callback(err, status, response);
            else {
                if (response){
                    const object = JSON.parse(response);
                    callback(err, status, object);
                } else {
                    callback(err, status, null);
                }
            }
        });
    },
    // get scout by id
    getScout : function(id, callback){
        const host      = 'http://127.0.0.1:3002';
        const url       = host + '/scouts/'+id;
        const options   = createOptions(url, 'GET');
        createAndSendGetHttpRequest(url, options,null, function(err, status, response){
            if(err)       
                callback(err, status, response);
            else {
                if (status == 200){
                    if (response){
                        const object = JSON.parse(response);
                        callback(err, status, object);
                    } else {
                        callback(err, status, null);
                    }
                } else {
                    callback(response, status, null);
                }
            }
        });
    }
}
function createAndSendHttpPutWithFormRequest(uri, options , data, callback){
    const request = require('request');
    request.put(options.url,options, function(errors, response, body){
        if (errors){
            callback(err, null, null);
        } else {
            callback(null, response, body);
        }
    }).form(data);
}

function createAndSendGetHttpRequest(uri, options, data, callback){
    const request = require('request');
    request.get(uri, options, function(errors, response, body){
        if(errors) {
            callback(errors, null, null);
        } else {
            callback(null, response.statusCode, body);
        }
    });
}

function createOptions(uri, method){
    let item = {
        method  : method,
        uri     : uri,
    };
    return item;
}