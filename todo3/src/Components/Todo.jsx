import React from 'react'
import './Todo.css'
import { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import {IoMdDoneAll } from "react-icons/io";
import {FiEdit } from "react-icons/fi";
import {MdDelete } from "react-icons/md";

const Todo = () => {

  const [todo,setTodo] = useState("");
  const [todos,setTodos] = useState(()=>{
    const savedTodos = localStorage.getItem('todos');
    return savedTodos?JSON.parse(savedTodos):[]
  });

  const [editId,setEditId] = useState(0);
  const handleSubmit = (e)=>{
    e.preventDefault();  
  }

  const addTodo = () => {
    if(todo !== ''){
        const isDuplicate = todos.some((todo_obj) => todo_obj.todo_data === todo);
        if(isDuplicate){
          alert('This todo already exists!');
          return;
        }
        else{
          setTodos([...todos,{todo_data:todo, id:Date.now(), status:false}]);
          setTodo("");
          console.log(todos);
        }
        
    }
    if(editId){

        const editObj = todos.find((todo_obj)=> todo_obj.id === editId);
        const updateObj = todos.map((todo_obj)=> todo_obj.id === editObj.id
        ?(todo_obj = {id:todo_obj.id, todo_data:todo}) : (todo_obj = {id:todo_obj.id, todo_data:todo_obj.todo_data}));
        setTodos(updateObj);
        setEditId(0);
        setTodo("");
    }
    
    
  }

  const deleteTodo = (id) =>{
    const newTodos = todos.filter((data) => id !== data.id);
    setTodos(newTodos);

  }

  const completeTodo = (id)=>{
    let complete = todos.map((obj)=>{
        if(id === obj.id){
            return ({...obj, status:!obj.status});
        }
        return obj;
    })
    setTodos(complete);
  }

  const editTodo = (id) =>{
    const editObj = todos.find((obj) => id === obj.id);
    setTodo(editObj.todo_data);
    setEditId(editObj.id)
  }

  const inputRef = useRef(null);

  useEffect(()=>{
    inputRef.current.focus();
    localStorage.setItem('todos',JSON.stringify(todos))
  },[todos]);


  return (
    <div className='container'>
        <h2>TODO APP</h2>
        <form className='form-group' onSubmit={handleSubmit}>
            <input ref={inputRef} value={todo} type="text" placeholder='Enter your tasks?' onChange={(event)=>setTodo(event.target.value)}/>
            <button onClick={addTodo}>{editId? 'EDIT':'ADD'}</button>
        </form>
       <div className='list'>
            <ul>
               {todos.map((task,index) =>
                    <li className='list-items' key={index}> 
                    <div className='list-items-list' id={task.status?'list-item':''}>{task.todo_data}</div>
                        <span>
                            <IoMdDoneAll id='complete' title='Complete' onClick={()=>completeTodo(task.id)}/>
                            <FiEdit id='edit' title='Edit' onClick={()=>editTodo(task.id)}/>
                            <MdDelete id='delete' title='Delete' onClick={()=>deleteTodo(task.id)}/>
                        </span>
                    </li>
                )}
            </ul>
       </div>
    </div>
  )
}

export default Todo