const model = require('../models/user');
const event = require('../models/event');
const RSVPModel = require('../models/rsvp');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
   let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
   let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Email address not found');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = async (req, res, next) => {
    try {
        const userId = req.session.user;

        // Fetch user-created events
        const events = await event.find({ host: userId });

        // Fetch user's RSVPs with "NO" status
        const userNoRsvps = await RSVPModel.find({ user: userId, status: 'NO' }).populate('event');

        // Fetch user's RSVPs with "YES" and "MAYBE" status
        const userRsvps = await RSVPModel.find({ user: userId, status: { $in: ['YES', 'MAYBE'] } }).populate('event');

        // Render the profile view with the fetched data
        res.render('./user/profile', { user: req.session.user, events, userRsvps, userNoRsvps });
    } catch (err) {
        next(err);
    }
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



