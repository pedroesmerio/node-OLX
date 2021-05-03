const mongoose = require('mongoose');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const State = require('../models/State');

module.exports = {
  signin: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }

    const data = matchedData(req);

    //Verifica se E-mail é valido
    const user = await User.findOne({
      email: data.email,
    });
    if (!user) {
      res.json({ error: 'E-mail e/ou senha errados!' });
      return;
    }

    //Verifica se a senha é valida
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match) {
      res.json({ error: 'E-mail e/ou senha errados!' });
      return;
    }

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    user.token = token;
    await user.save();

    res.json({ token, email: data.email });
  },

  signup: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.mapped() });
      return;
    }

    const data = matchedData(req);

    //Verifica se E-mail já existe
    const user = await User.findOne({
      email: data.email,
    });
    if (user) {
      res.json({
        error: { email: { msg: 'E-mail já existe!' } },
      });
      return;
    }
    //Verifica se Estado já existe
    if (mongoose.Types.ObjectId.isValid(data.state)) {
      const stateItem = await State.findById(data.state);
      if (!stateItem) {
        res.json({
          error: { state: { msg: 'Estado já existe!' } },
        });
        return;
      }
    } else {
      res.json({
        error: { state: { msg: 'Código de estado inválido' } },
      });
      return;
    }

    //Cria usuário no banco de dados
    const passwordHash = await bcrypt.hash(data.password, 10);

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    const newUser = new User({
      name: data.name,
      email: data.email,
      passwordHash,
      token,
      state: data.state,
    });

    await newUser.save();

    res.json({ token });
  },
};
