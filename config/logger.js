  /* 在util目录下创建 logger.js 代码如下 作简单的logger封装 */
  const log4js = require('log4js');
  const path = require('path')
  // 定义log config
  log4js.configure({
    appenders: { 
      // 定义两个输出源
      info: { 
        type: 'file', 
        filename: path.resolve('log/info.log'),
        maxLogSize: 1024*50,//一个文件的大小，超出后会自动新生成一个文件
        backups: 10,// 备份的文件数量
      },
      error: { 
        type: 'file', 
        filename: path.resolve('log/error.log') ,
        maxLogSize: 1024*50, // 一个文件的大小，超出后会自动新生成一个文件
        backups: 10, // 备份的文件数量
      }
    },
    categories: { 
      // 为info/warn/debug 类型log调用info输出源   error/fatal 调用error输出源
      // 不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
      default: { appenders: ['info'], level: 'info' },
      logInfo: { appenders: ['info'], level: 'info' },
      logWarn: { appenders: ['info'], level: 'warn' },
      logDebug: { appenders: ['info'], level: 'debug' },
      logError: { appenders: ['error'], level: 'error' },
      logFatal: { appenders: ['error'], level: 'fatal' },
    }
  });
  // 导出5种类型的 logger
  module.exports = {
    debug: (...params) => log4js.getLogger('logDebug').debug(...params),
    info: (...params) => log4js.getLogger('logInfo').info(...params),
    warn: (...params) => log4js.getLogger('logWarn').warn(...params),
    error: (...params) => log4js.getLogger('logError').error(...params),
    fatal: (...params) => log4js.getLogger('logFatal').fatal(...params),
  }