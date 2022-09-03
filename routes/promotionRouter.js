const express = require('express');
const Promotion = require('../models/promotions');

const promotionRouter = express.Router();

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotion =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.post((req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete((req, res, next) => {
    Promotion.deleteMany()
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err))
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promotion.findbyId(req.params.promotionId)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotion/${req.params.partnerId}`)
})
.put((req, res, next) => {
    Promotion.findbyIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, {new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
   Promotion.findbyIdAndDelete(req.params.promotionId)
   .then(promotion => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promotion);
   })
   .catch(err => next(err));
})

module.exports = promotionRouter;