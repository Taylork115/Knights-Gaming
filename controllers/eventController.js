const model = require('../models/event');
const RSVPModel = require('../models/rsvp');


exports.index = (req, res, next)=>{
    model.find()
    .then(events=>res.render('./event/index', {events}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./event/new');
};

exports.create = (req, res, next)=>{
    let event = new model(req.body);//create a new event document
    event.host = req.session.user;
    event.save()//insert the document to the database
    .then(event=> {
        req.flash('success', 'event has been created successfully');
        res.redirect('/events');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);
        return res.redirect('back');
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id).populate('host', 'firstName lastName').populate('rsvps')
    .then(event=>{
        if(event) {     
            return res.render('./event/show', {event});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
        return res.render('./event/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event=>{
        return res.redirect('/events/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.delete = async (req, res, next) => {
    try {
        const eventId = req.params.id;

        // Delete associated RSVPs
        await RSVPModel.deleteMany({ event: eventId });

        // Delete the event
        await model.findByIdAndDelete(eventId, { useFindAndModify: false });

        res.redirect('/events');
    } catch (error) {
        next(error);
    }
};

exports.rsvp = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.user;
        const status = req.body.status;

        // Check if the user is the host
        const event = await model.findById(eventId);
        if (event.host.equals(userId)) {
            return res.status(401).render('error', { error: { message: 'You cannot RSVP to your own event', status: 401 } });
        }

        if (status === 'NO') {
            // Find and remove the existing RSVP document for the user and event
            const existingRSVP = await RSVPModel.findOneAndRemove({ user: userId, event: eventId });

            // Update the event's RSVPs array
            if (existingRSVP) {
                const index = event.rsvps.findIndex(rsvp => rsvp.equals(existingRSVP._id));
                if (index !== -1) {
                    event.rsvps.splice(index, 1);
                }
                // Save the event after updating the rsvps array
                await event.save();
            }
        } else {
            // Use findOneAndUpdate to update or create an RSVP entry for the user and event
            const existingRSVP = await RSVPModel.findOneAndUpdate(
                { user: userId, event: eventId },
                { status },
                { upsert: true, new: true }
            );

            // Update the event's RSVPs array
            const index = event.rsvps.findIndex(rsvp => rsvp.equals(existingRSVP._id));
            if (index === -1) {
                event.rsvps.push(existingRSVP);
            } else {
                // If the RSVP already exists in the array, update the status
                event.rsvps[index].status = status;
            }

            // Save the event after updating the rsvps array
            await event.save();
        }

        // Redirect back to the event page
        res.redirect(`/events/${eventId}`);
    } catch (error) {
        next(error);
    }
};






