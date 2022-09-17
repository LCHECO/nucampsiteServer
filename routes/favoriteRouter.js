const express = require("express");
const authenticate = require("../authenticate");
const Favortie = require("../models/favorites");
const cors = require("./cors");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, async (req, res, next) => {
    try {
      const fav = await Favortie.find({ user: req.user._id })
        .populate("user")
        .populate("campsites");
      if (fav)
        res.status(200).setHeader("Content-Type", "application/json").json(fav);
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favortie.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((favoriteCampsite) => {
            if (!favorite.campsites.includes(favoriteCampsite._id)) {
              favorite.campsites.push(favoriteCampsite._id);
            }
          });

          favorite
            .save()
            .then((favorite) => {
              res.status(200).setHeader("Content-Type").json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favortie.create({ user: req.user._id })
            .then((favorite) => {
              req.body.forEach((favoriteCampsite) => {
                if (!favorite.campsites.includes(favoriteCampsite._id)) {
                  favorite.campsites.push(favoriteCampsite._id);
                }
              });

              favorite
                .save()
                .then((favorite) => {
                  res.status(200).setHeader("Content-Type").json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          res
            .status(200)
            .setHeader("Content-Type", "application/json")
            .json(favorite);
        } else {
          res
            .setHeader("Content-Type", "text/plain")
            .end("You do not have any favorites to delete");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);

            favorite
              .save()
              .then((favorite) => {
                res
                  .status(200)
                  .setHeader("Content-Type", "application/json")
                  .json(favorite);
              })
              .catch((err) => next(err));
          } else {
            res
              .status(200)
              .setHeader("Content-Type", "text/plain")
              .end("Campsite already exists");
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res
                .status(200)
                .setHeader("Content-Type", "application/json")
                .json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /favorites/${req.params.campsiteId}`
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId);
          if (index >= 0) {
            favorite.campsites.splice(index, 1);
          }

          favorite
            .save()
            .then((favorite) => {
              console.log("Favorite Campsite Deleted!", favorite);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
