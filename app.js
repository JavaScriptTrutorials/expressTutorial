const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog')
const app = express();

// connect to mongoDB
const dbURI = 'mongodb+srv://netninja:test1234@nodecluster.mjkee.mongodb.net/node-tuts?retryWrites=true&w=majority';
// mongoose.connect(dbURI);
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => app.listen(3000))
.catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');
//app.set('views', 'myviews');

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


app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'New blog',
        snippet: 'About my new blog',
        body: 'Lorem ipsum'
    });

    blog.save()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
    .then(response => {
        res.send(response);
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/single-blog', (req, res) => {
    Blog.findById('5f36965eef5daf58bed7fb48')
    .then( (result) => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/', (req, res) => {
    const blogs = [
        {title: 'title 1', snippet: 'Lorem ipsum dolor, sit amet consectuter.'},
        {title: 'title 2', snippet: 'Lorem ipsum dolor, sit amet consectuter.'},
        {title: 'title 3', snippet: 'Lorem ipsum dolor, sit amet consectuter.'}
    ];
    res.render('index',{ title: 'Home', blogs});
});

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
    .then((result) => {
        res.render('index', {title: 'Blogs', blogs: result})
    })
    .catch( err => console.log(err));
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