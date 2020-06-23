const express = require('express');
const Joi = require('joi');//input validation.
const app = express();
app.use(express.json());

//.use hardcoded list as of now.
var courses = [
    { id: 1, name: 'Course 1' },
    { id: 2, name: 'Course 2' },
    { id: 3, name: 'Course 3' }
];

//GET for / end point

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

//GET for courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//POST to courses
app.post('/api/courses', (req, res) => {
    //interested only in error property here - not the value property
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

//GET for course Id
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course)
        res.status(404).send("Course Id Not Found");
    res.send(course);
});

//PUT Request for course Id
//Look up for the id - If not exists - throw 404
//Validate input - If invalid - throw 400
//Else update
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Course Id Not Found");
        return;
    }
    //interested only in error property here - not the value property
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    course.name = req.body.name;
    res.send(course);
});

//DELETE for id
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send("Course Id Not Found");
        return;
    }
    //find the index and remobve from the array usng splice
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));