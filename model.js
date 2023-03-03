// include library 
import fetch from 'node-fetch'
import mongoose from 'mongoose'
const fetch = require('node-fetch')
const mongoose = require('mongoose')
//connect mongodb
mongoose.connect("mongodb://myAdmin:myAdmin@localhost:27017");
// create schema 
const todoSchema = new mongoose.Schema({
	user_id: {
		type: Number,
		require: true
	},
	id: {
		type: Number,
		require: true
	},
	title: {
		type: String,
		require: true
	},
	completed: {
		type: Boolean,
		require: true
	},
})
// create Schema to todos table
const TodoList = mongoose.model('Todos', todoSchema)
// create function getTodoList with get data from fakedata to todosTable
const getTodoList = async() => {
	// fetch fake data
	const myTodo = await fetch('https://jsonplaceholder.typicode.com/todos')
	// compare data to json
	const responseTodo = await myTodo.json()

	for (let i = 0; i < responseTodo.length; i++) {
		// loop data from fake data to todos table
		const todo = new TodoList({
			user_id: responseTodo[i]['userId'],
			id: responseTodo[i]['id'],
			title: responseTodo[i]['title'],
			completed: responseTodo[i]['completed'],
		});
		//save data to mongo
		todo.save();
		
	}
}

// apply function 
getTodoList()

