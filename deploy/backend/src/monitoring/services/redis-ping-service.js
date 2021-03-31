var Redis = require('ioredis');
var fs = require('fs');
require('dotenv').config()
const Logger = require('../../logger/centinela-logger')
const logger = new Logger(__filename, '')

module.exports = class RedisPingService {
  constructor() {}

  async isAlive() {
    try {
      return this.ping();
    } catch (err) {
      logger.error(err);
      return "Redis is dead"
    }

  }
  ping = function (e) {
    var client = this.buildClient()
    var result = client.ping()
      .then(function (e) {
        logger.info('Redis ccnnected!');
        return "pong"
      }).catch((e) => {
        logger.error("Error: " + e);
        return "Cannot connect to redis";
      })
      .finally(() => {
        client.quit();
      });
    return result
  }

  buildClient = function (e) {
    try {
      var client = new Redis({
        host: process.env.REDIS_HOST
        , port: process.env.REDIS_PORT
        , password: process.env.REDIS_PASSWORD
      });
      return client
    } catch (err) {
      logger.error(err)
      throw Error('Could not connected to redis')
    }
  }

}
