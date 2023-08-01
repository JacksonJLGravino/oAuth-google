const express = require('express')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const path = require('path')

const app = express()

app.set('view engine', 'ejs')

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: ''
    }, 
    function(accessToken, refreshToken, profile, cb){
        cb(null, profile)
    }
))

passport.serializeUser(function(user, cb){
    cb(null, user)
})

passport.deserializeUser(function(obj, cb){
    cb(null, obj)
})

app.use(express.static(path. join(__dirname, 'public')))

app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'login.ejs'))
})

app.get('/dashboard', (req, res) => {
    if(req.isAuthenticated()){
        res.render(path.join(__dirname, 'dashboard.ejs'), 
        {user: req.user})
    } else {
        res.redirect('/login')
    }
})

app.get('/auth/google', passport.authenticate('google', {scope: ["profile", "email"] }))

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), async (req, res) => {
    res.redirect('/dashboard')
})

app.get('/logout', (req, res) => {
    req.logout(function (err) {
        if(err){
            console.log(err)
        } else {
            res.redirect('/login')
        }
    })
})

app.listen(3000, () => {
    console.log('iniciali')
})