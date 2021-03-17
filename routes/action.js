const express = require('express');
const botController = require('../controllers/action')

const actionRouter = express.Router();

actionRouter.post('/start', botController.start)
actionRouter.post('/restart', botController.restart)
actionRouter.post('/stop', botController.stop)
actionRouter.post('/changeName', botController.changeName)
// actionRouter.post('/changeAvatar', botController.changeAvatar)

module.exports = actionRouter;