var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'transferservice'
    },
    port: process.env.PORT || 3003,
    db: 'mongodb://admin:admin@rsoicluster-shard-00-00-voyya.mongodb.net:27017,rsoicluster-shard-00-01-voyya.mongodb.net:27017,rsoicluster-shard-00-02-voyya.mongodb.net:27017/test?ssl=true&replicaSet=RsoiCluster-shard-0&authSource=admin'
  }
};

module.exports = config[env];