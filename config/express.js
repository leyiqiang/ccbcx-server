'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');

const winston = require('winston');
const config = require('./');
const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'development';



module.exports = function (app, passport) {

    // Compression middleware (should be placed before express.static)
    app.use(compression({
        threshold: 512,
    }));

    // Configure corse
    app.use(cors());

    // Static files middleware
    app.use(express.static(config.root + '/public'));

    // Use winston on production
    let log = 'dev';
    if (env !== 'development') {
        log = {
            stream: {
                write: message => winston.info(message),
            },
        };
    }

    // Don't log during tests
    // Logging middleware
    if (env !== 'test') {
        app.use(morgan('combined', log));
    }

    // bodyParser should be above methodOverride
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    // CookieParser should be above session
    app.use(cookieParser());
    app.use(cookieSession({ secret: 'secret' }));
    app.use(session({
      resave: false,
        saveUninitialized: true,
        secret: pkg.name,
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());


  if (env === 'development') {
        app.locals.pretty = true;
    }
};
