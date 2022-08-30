const express = require('express');
const partnersRouter = express.Router();

partnersRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the partnerss to you');
})
.post((req, res) => {
    res.end(`Will add the partners: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partnerss');
})
.delete((req, res) => {
    res.end('Deleting all partnerss');
});

partnersRouter.route('/:partnersId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the partners: ${req.params.partnersId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported')
})
.put((req, res) => {
    res.end(`Will update the partners: ${req.body.name} with description ${req.body.description}`)
})
.delete((req, res) => {
    res.end('Deleting partners!')
})

module.exports = partnersRouter;