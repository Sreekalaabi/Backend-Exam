const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./Models/details'); 
const path = require('path');

dotenv.config();

const uri = process.env.mongodb_uri 


mongoose.connect(uri);

const database = mongoose.connection;
database.on('error', (error) => {
    console.log('Database connection error:', error);
});
database.once('connected', () => {
    console.log('Database Connected');
});

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Create a new student
app.post('/students', async (req, res) => {
    try {
        console.log('Request body for POST /students:', req.body);
        const student = new Student(req.body);
        const result = await student.save();
        res.status(201).json(result);
    } catch (error) {
        console.log('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        console.log('Request body for PUT /students/:id:', req.body);
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updatedStudent);
    } catch (error) {
        console.log('Error updating student:', error);
        res.status(400).json({ message: 'Error updating student' });
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        console.log('Request params for GET /students/:id:', req.params);
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.log('Error fetching student:', error);
        res.status(500).json({ message: 'Error fetching student' });
    }
});

//Get students by grade
app.get('/students/grade/:grade', async (req, res) => {
    try {
        console.log('Request params for GET /students/grade/:grade:', req.params);
        const students = await Student.find({ grade: req.params.grade });
        res.json(students);
    } catch (error) {
        console.log('Error fetching students by grade:', error);
        res.status(500).json({ message: 'Error fetching students by grade' });
    }
});


// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        console.log('Request params for DELETE /students/:id:', req.params);
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.log('Error deleting student:', error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});

module.exports = app;
