const express = require('express');
const controller = require('../controllers/eventController');
const {isLoggedIn, ishost} = require('../middlewares/auth');
const{validateId, validateevent, validateResult, validateRSVP} = require('../middlewares/validator');

const router = express.Router();

//GET /events: send all events to the user
router.get('/', controller.index);

//GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

//POST /events: create a new event
router.post('/', isLoggedIn, validateevent, validateResult, controller.create);

//GET /events/:id: send details of event identified by id
router.get('/:id', validateId, controller.show);

//GET /events/:id/edit: send html form for editing an exising event
router.get('/:id/edit', validateId, isLoggedIn, ishost, controller.edit);

//PUT /events/:id: update the event identified by id
router.put('/:id', validateId, isLoggedIn, ishost, validateevent, validateResult, controller.update);

//DELETE /events/:id, delete the event identified by id
router.delete('/:id', validateId, isLoggedIn, ishost, controller.delete);

router.post('/:id/rsvp', isLoggedIn, validateId, validateRSVP, controller.rsvp), (req, res) => {
    req.flash('success', 'RSVP successful');
    res.redirect('/events'); // Redirect to events page or wherever you want
};

module.exports = router;