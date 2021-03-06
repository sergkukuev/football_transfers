var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'transferservice'
    },
    tokenLife: 400,
    port: process.env.PORT || 3003,
    db: 'mongodb://admin:admin@Cluster0-shard-00-00-voyya.mongodb.net:27017,Cluster0-shard-00-01-voyya.mongodb.net:27017,Cluster0-shard-00-02-voyya.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin'
  }
};

module.exports = config[env];