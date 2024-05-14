const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

///////////////////////////
// Data initialization
///////////////////////////


let taskIdCounter = 0;


let columnsData = require("./data/columns.json")
let tagsData = require("./data/tags.json")


// Calculate taskIdCounter
columnsData.forEach(column => {
    column.tasks.forEach(task => {
        const taskIdNumber = parseInt(task.id.slice(1)); 
        if (taskIdNumber >= taskIdCounter) {
            taskIdCounter = taskIdNumber + 1;
        }
    });
});

//TODO: implement (see 6.1.1)

///////////////////////////
// Server setup

const app = express();
const PORT =  3000;
app.use(bodyParser.json());

///////////////////////////

//TODO: implement (see 6.1.2)

///////////////////////////
// CRUD operations
///////////////////////////

app.get('/api/counter', (req, res) => {
    res.status(200).json({ taskIdCounter });
});
// Get all tags
app.get('/api/tags', (req, res) => {
    res.status(200).json(tagsData);
});

// Get all columns
app.get('/api/columns', (req, res) => {
    res.status(200).json(columnsData);
});

app.post('/api/tasks', (req, res) => {
    const { column, title, text, taskTags } = req.body;
    
    const columnId = parseInt(column);

    const targetColumn = columnsData.find(col => col.id === columnId);
    
    
    if (!targetColumn) {
        return res.status(404).json({ error: 'Column not found' });
    }

    const newTaskId = 't' + taskIdCounter++;
    
    const newTask = {
        id: newTaskId,
        title,
        text,
        tags: taskTags
    };

    targetColumn.tasks.push(newTask);

    res.status(201).json({ id: newTaskId });
});


app.put('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, text, taskTags } = req.body;

   
    let updated = false;

    
    columnsData.forEach(column => {
        const taskToUpdate = column.tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            taskToUpdate.title = title;
            taskToUpdate.text = text;
            taskToUpdate.tags = taskTags;
            updated = true;
        }
    });

    if (updated) {
        res.status(200).send('Task updated successfully');
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = req.params.id;

   
    let removed = false;
    columnsData.forEach(column => {
        const index = column.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            column.tasks.splice(index, 1);
            removed = true;
        }
    });

    if (removed) {
        res.status(200).send('Task deleted successfully');
    } else {
        res.status(404).send('Task not found');
    }
});


app.put('/api/move-task/:id', (req, res) => {
    const taskId = req.params.id;
    const { newColumnId } = req.body;


    let moved = false;
    let taskToMove;
    let sourceColumnIndex;
    let targetColumnIndex;
    columnsData.forEach((column, index) => {
        const taskIndex = column.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            taskToMove = column.tasks[taskIndex];
            column.tasks.splice(taskIndex, 1);
            sourceColumnIndex = index;
            moved = true;
        }
    });

    if (moved) {
        const targetColumn = columnsData.find(column => column.id === newColumnId);
        if (targetColumn) {
            targetColumn.tasks.push(taskToMove);
            targetColumnIndex = columnsData.indexOf(targetColumn);
        } else {
           
            columnsData[sourceColumnIndex].tasks.push(taskToMove);
            res.status(404).send('Target column not found');
            return;
        }
        res.status(200).send('Task moved successfully');
    } else {
        res.status(404).send('Task not found');
    }
});

//TODO: implement (see 6.1.3 - 6.1.9)

///////////////////////////
// Start the server
///////////////////////////

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(tagsData)
});

//TODO: implement (see 6.1.2)
