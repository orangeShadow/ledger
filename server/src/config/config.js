module.exports = {
  port: 8081,
  mongodb: {
    // Если у вас есть пользователь и пароль, замените на:
    // source: 'mongodb://username:password@localhost:27017/ledger',
    source: 'mongodb://root:example@127.0.0.1:27017/ledger?ssl=false&authSource=admin',
    params: {
      // Добавляем параметры для новых версий MongoDB
      retryWrites: true,
      w: 'majority'
    }
  }
}