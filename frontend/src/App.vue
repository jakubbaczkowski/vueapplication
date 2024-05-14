<script setup>
import { ref, onMounted } from 'vue'
import Board from './components/Board.vue'
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'

const tags = ref([])
const columns = ref([])
const modalRef = ref(null)

const title = 'My Kanban Board'

/**
 * Calls the showModal() function in Modal.vue, assuming the component is registered and referenced.
 * DO NOT MODIFY.
 */
function showModal(task = null, columnId = null) {
    if (modalRef.value) {
        modalRef.value.showModal(task, columnId)
    }
}

/**
 * Calls showModal() in editing mode.
 * DO NOT MODIFY.
 * @param taskId
 */
function triggerEdit(taskId) {
    for (let column of columns.value) {
        const index = column.tasks.findIndex(t => t.id === taskId)
        if (index > -1) {
            const task = column.tasks[index]
            showModal(task)
            return
        }
    }
}

////////////////////////////////////////////////////////////////
// API calls below, only modify the content of the functions, not their signature! //
////////////////////////////////////////////////////////////////

async function loadTags() {
  //TODO: implement (see 6.2 / 6.1.4)
  try {
    const response = await fetch('http://localhost:3000/api/tags');
    if (response.body) {
      const parsedData = await response.json();
      tags.value = parsedData;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function loadColumns() {
  //TODO: implement (see 6.2 / 6.1.5)
  try {
    const response = await fetch('http://localhost:3000/api/columns');
    const data = await response.json();
    columns.value = data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function createTask(columnId, taskTitle, taskText, taskTags) {
    try {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                column: columnId,
                title: taskTitle,
                text: taskText,
                taskTags: taskTags
            })
        });
        
        if (response.ok) {
            const responseData = await response.json();
            console.log(response)
            loadColumns();
        }
    } catch (error) {
        console.error('Error creating task:', error);
        throw error; 
    }
}
async function editTask(taskId, taskTitle, taskText, taskTags) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: taskTitle,
                text: taskText,
                taskTags: taskTags
            })
        });
        

        if (response.ok) {
            loadColumns();
            return true; 
        } 
    } catch (error) {
        console.error('Error editing task:', error);
        throw error;  
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadColumns();
            return true;
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error; 
    }
}
async function moveTask(taskId, newColumnId) {
    try {
        const response = await fetch(`http://localhost:3000/api/move-task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newColumnId: newColumnId
            })
        });
        
        if (response.ok) {
            loadColumns();
            return true; 
        } 
    } catch (error) {
        console.error('Error moving task:', error);
        throw error; 
    }
}
onMounted(() => {
    // DO NOT MODIFY
    loadTags()
    loadColumns()
})
</script>

<template>
    <!-- DO NOT MODIFY -->
    <Header :title="title" @show-modal="showModal" />
    <Board :columns="columns" @move-task="moveTask" @trigger-edit="triggerEdit" @delete-task="deleteTask"/>
    <Modal :tags="tags" :columns="columns" ref="modalRef" @create-task="createTask" @edit-task="editTask"/>
</template>