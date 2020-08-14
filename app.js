const express = require('express');
const app = express();

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'myviews');

app.listen(3000, () => {
    console.log("resver running on port 3000");
});

// middleware & static files
app.use('/public' ,express.static('public'));

app.use((req, res, next) => {
    console.log('LOG MIDDLEWARE');
    console.log('new request made: ');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
});

app.get('/', (req, res) => {
    const blogs = [
        {title: 'title 1', snippet: 'Lorem ipsum dolor, sit amet consectuter.'},
        {title: 'title 2', snippet: 'Lorem ipsum dolor, sit amet consectuter.'},
        {title: 'title 3', snippet: 'Lorem ipsum dolor, sit amet consectuter.'}
    ];
    res.render('index',{ title: 'Home', blogs});
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

app.get('/blogs/create', (req, res) => {
    res.render('create',{ title: 'Create a new blog'});
});

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

app.use((req, res) => {
    res.status(404).render('404',{ title: '404'});
});