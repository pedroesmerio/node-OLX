const express = require('express');
const router = express.Router();

//IMPORT MIDDLEWARES
const Auth = require('./middlewares/Auth');

//IMPORT CONTROLLERS
const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const AdsController = require('./controllers/AdsController');

router.get('/ping', (req, res) => {
  res.json({ pong: true });
});

router.get('/states', Auth.private, UserController.getStates);

router.get('/user/signin', AuthController.signin);
router.get('/user/signup', AuthController.signup);

router.get('/user/me', Auth.private, UserController.info);
router.put('/user/me', Auth.private, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post('/ad/add', Auth.private, AdsController.addAction);
router.get('/ad/list', AdsController.getList);
router.get('/ad/item', AdsController.getItem);
router.post('/ad/:id', Auth.private, AdsController.editAction);

module.exports = router;
