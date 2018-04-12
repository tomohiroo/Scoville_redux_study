import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

const todo = (action, todo) => {
  switch (action.type) {
    case 'ADD_TODO':
      return{
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if(action.id == todo.id){
        return{
          ...todo,
          completed: !todo.completed
        }
      }else{
        return todo
      }
    default:
    return todo
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return[
        ...state,
        todo(action, undefined)
      ]
    case 'TOGGLE_TODO':
      return(state.map((t) => (
          todo(action, t)
        ))
      )
    default:
      return state
  }
}
const visibilityFilter = (state = 'SHOW_ALL', action) => {
  return state
}
const todoApp = combineReducers({todos, visibilityFilter})



let AddTodo = ({onClick}) => {
  let input
  return(
    <div>
      <input ref={(node) => {
        input = node
      }} />
      <button
        onClick={() => {
          onClick(input.value)
          input.value = ''
        }}
      >
        Add Todo!
      </button>
    </div>
  )
}
let nextTodoId = 1
const mapDispatchToAddTodoProps = (dispatch) => {
  return{
    onClick: (text) => {
      dispatch({
        id: nextTodoId++,
        type: 'ADD_TODO',
        text
      })
    }
  }
}

AddTodo = connect(
  null,
  mapDispatchToAddTodoProps
)(AddTodo)

const Todo = ({onClick, text, completed}) => (
  <li onClick={onClick}>
    <p style={{textDecoration: completed ? 'line-through' : 'none'}}>
      {text}
    </p>
  </li>
)
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map((todo) =>
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    )}
  </ul>
)
const mapStateToTodoListProps = (state) => {
    return{
      todos: state.todos
    }
}
const mapDispatchToTodoListProps = (dispatch, ownProps) => {
  return{
    onTodoClick: (id) => {
      dispatch({
        type: 'TOGGLE_TODO',
        id
      })
    }
  }
}
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
  </div>
)
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
