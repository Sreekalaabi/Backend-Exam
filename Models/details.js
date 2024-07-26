const { Schema } = require('mongoose')
const { model } = require('mongoose')
const demo = new Schema({
    studentId: { type: Number, required: true },
    studentName: { type: String, required: true },
    entrolledCourse: { type: String, required: true },
    date: { type: String, required: true },
    grade: { type: String, required: true }
   
})

const details  = model('details', demo) 
module.exports = details    