const express = require('express');
const Partner = require('../models/partners');
const authenticate = require('../authenticate');

const partnersRouter = express.Router();

partnersRouter.route('/')
.get((req, res, next) => {
    Partner.find()
    .then(partners =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err))
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete( authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany()
    .then(partners => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err))
});

partnersRouter.route('/:partnersId')
.get((req, res, next) => {
    Partner.findbyId(req.params.partnersId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err));
})
.post( authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`)
})
.put(authenticate.verifyUser,(req, res, next) => {
    Partner.findbyIdAndUpdate(req.params.partnersId, {
        $set: req.body
    }, {new: true })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
   Partner.findbyIdAndDelete(req.params.partnersId)
   .then(partner => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(partner);
   })
   .catch(err => next(err));
})

module.exports = partnersRouter;