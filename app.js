const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Blog = require('./models/blog');
const app = express();


// connect to mongoDB
const dbURI = 'mongodb+srv://netninja:test1234@nodecluster.mjkee.mongodb.net/node-tuts?retryWrites=true&w=majority';
// mongoose.connect(dbURI);
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => app.listen(3000, () => console.log('Server listening on port 3000!')))
.catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'myviews');

// middleware & static files
app.use(bodyParser.urlencoded({extended:false}));

app.use('/public' ,express.static('public'));

app.use((req, res, next) => {
    console.log('LOG MIDDLEWARE');
    console.log('new request made: ');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
});

// redirects
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', {title: 'Blogs', blogs: result})
    })
    .catch( err => console.log(err));
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch( (err) => console.log(err));
});

app.get('/blogs/create', (req, res) => {
    res.render('create',{ title: 'Create a new blog'});
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        res.render('details', {blog: result, title: 'Blog details'});
    })
    .catch( (err) => console.log(err));
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/blogs'});
    })
    .catch(err => console.log(err));
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'});
});

app.use((req, res) => {
    res.status(404).render('404',{ title: '404'});
});