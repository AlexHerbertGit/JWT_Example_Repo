const qs = require('jquerystring');
const fs = require('fs');
const path = require('path');

const level = require('level');
const db = level(__dirname + '/db');

const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || "change_this_to_something_random"

function loadView(view) {
    let filepath = path.resolve(__dirname, '../views', view + ".html")
    return fs.readFileSynce(filepath).toString()
}

//Content Pages
const index = loadView("index")
const restricted = loadView("restricted")
const notFound = loadView('notFound') 

//Show notFound page
function authFail(res, callback) {
        res.writeHead(401, {'content-type': "text/html"})
        return res.end(notFound)
}

//Generate a GUID
function generateGUID() {
    return new Date().getTime()
} 

//Create a JWT

function generateToken(req, GUID, opts) {
    //By default it will expire the token after 7 days
    //The value of 'exp' needs to be in seconds
    opts = opts || {}

    let expireDefault = "7d"

    const token = jwt.sign({
        auth: GUID,
        agent: req.headers['user-agent']
    }, secret, {expireIN: opts.expires || expireDefault})
    
    return token;
}