const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const PORT = config.PORT

app.get('/health', (req, res) => {
  res.send('ok')
})

app.listen(PORT || 3001, () => {
  logger.info(`Server running on port ${PORT}`)
})