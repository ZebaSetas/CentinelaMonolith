'use strict'
const path = require('path')
const {
  createLogger
  , format
  , transports
} = require('winston')
const chalk = require('chalk')
var dateFormat = require('dateformat')
const fileUtils = require('./utils/file-utils.js')
var appRoot = require('app-root-path')
const Enum = require('enum')

module.exports = class Logger {
  constructor(globalFilename) {
    var filenamePath = fileUtils.getFolderAndFilename(globalFilename)
    var customLevels = {
      levels: {
        fatal: 0
        , error: 1
        , warn: 2
        , info: 3
        , debug: 4
      }
    }

    var fileLogger = new Enum(['info', 'debug', 'warn', 'error', 'fatal'])
    var isLocalAmbient = process.env.ENVIROMENT === 'local'
    if (isLocalAmbient) {
      var filename = path.join(process.env.LOCAL_FOLDER_LOG, process.env.LOCAL_FILE_LOG_NAME)
      fileLogger = createLogger({
        level: process.env.LOG_LEVEL
        , levels: customLevels.levels
        , format: format.combine(
          format.simple(), format.timestamp(), format.printf(info =>
            `[${dateFormat(info.timestamp,'yyyy-mm-dd HH:MM:ss')}][${info.level}][${filenamePath}]${info.message}`
          ))
        , transports: [
          new transports.File({
            filename
            , format: format.combine()
          , })
        ]
        , exceptionHandlers: [
          new transports.File({
            filename: process.env.LOCAL_FOLDER_LOG + process.env.LOCAL_FILE_LOG_NAME
          }), new transports.File({
            filename: process.env.LOCAL_FOLDER_LOG + process.env.LOCAL_FILE_LOG_EXCEPTION_NAME
          })
        ]
      })
    }

    var consoleLogger = createLogger({
      level: process.env.LOG_LEVEL
      , levels: customLevels.levels
      , format: format.combine(
        format.simple(), format.timestamp(), format.printf(info =>
          `[${dateFormat(info.timestamp,'yyyy-mm-dd HH:MM:ss')}][${info.level}][${filenamePath}]${info.message}`
        ))
      , transports: [
        new transports.Console()
      ]
    })

    var log = (message, chalkColor, fileLogger, consoleLogger, initTime
      , endTime, guid) => {
      var separator = ' >>> '
      var messageToLog = ''
      if (isNaN(initTime)) {
        messageToLog = buildMessageWithoutTime(initTime, messageToLog
          , separator, message)
      } else {
        if (isNaN(endTime)) {
          messageToLog = buildMessageWithInitTime(initTime, endTime
            , messageToLog, separator, message)
        } else {
          messageToLog = buildMessageWithBothTime(endTime, initTime, guid
            , messageToLog, separator, message)
        }

      }
      if (isLocalAmbient) fileLogger(chalkColor(messageToLog))
      consoleLogger(chalkColor(messageToLog))
    }

    this.info = (message, initTime, endTime, guid) =>
      log(message, chalk.green, fileLogger.info, consoleLogger.info
        , initTime, endTime, guid)

    this.debug = (message, initTime, endTime, guid) =>
      log(message, chalk.blue, fileLogger.debug, consoleLogger.debug
        , initTime, endTime, guid)

    this.warn = (message, initTime, endTime, guid) =>
      log(message, chalk.yellow, fileLogger.warn, consoleLogger.warn
        , initTime, endTime, guid)

    this.error = (message, initTime, endTime, guid) =>
      log(message, chalk.red, fileLogger.error, consoleLogger.error
        , initTime, endTime, guid)

    this.fatal = (message, initTime, endTime, guid) =>
      log(message, chalk.bgRed, fileLogger.fatal, consoleLogger.fatal
        , initTime, endTime, guid)
  }

}

function buildMessageWithBothTime(endTime, initTime, guid, messageToLog
  , separator, message) {
  var diference = endTime - initTime
  if (typeof guid !== 'undefined' && guid !== null) {
    var _guid = guid
    messageToLog =
      `[${diference}ms][Guid:${_guid}]${separator}${message}`
  } else
    messageToLog = `[${diference}ms]${separator}${message}`
  return messageToLog
}

function buildMessageWithInitTime(initTime, endTime, messageToLog, separator
  , message) {
  var _endTime = new Date().getTime()
  var diference = _endTime - initTime
  if (typeof endTime !== 'undefined' && endTime !== null) {
    var _guid = endTime
    messageToLog =
      `[${diference}ms][Guid:${_guid}]${separator}${message}`
  } else {
    messageToLog =
      `[${diference}ms]${separator}${message}`
  }
  return messageToLog
}

function buildMessageWithoutTime(initTime, messageToLog, separator, message) {
  if (typeof initTime !== 'undefined' && initTime !== null) {
    var _guid = initTime
    messageToLog = `[Guid:${_guid}]${separator}${message}`
  } else
    messageToLog = separator + message
  return messageToLog
}
