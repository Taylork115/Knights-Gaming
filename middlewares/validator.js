const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
 body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64}).trim().escape()];

 exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
 body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64}).trim().escape()];

 exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=> {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
 }


 exports.validateevent = [
    body('title', 'Title cannot be empty').notEmpty().trim().escape(),
    body('category', 'Category cannot be empty').notEmpty().trim().escape(),
    body('content', 'Content must be at least 10 characters').isLength({ min: 10 }).trim().escape(),
    body('location', 'Location cannot be empty').notEmpty().trim().escape(),
    body('start', 'Start Date/Time cannot be empty').notEmpty().trim().escape(),
    body('end', 'End Date/Time cannot be empty').notEmpty().trim().escape(),
    body('image', 'Image cannot be empty').notEmpty().trim().escape(),
  ];
  

exports.validateRSVP = [
  body('status')
    .notEmpty().withMessage('RSVP status cannot be empty')
    .isIn(['YES', 'NO', 'MAYBE']).withMessage('Invalid RSVP status')
    .trim()
    .escape(),
];

