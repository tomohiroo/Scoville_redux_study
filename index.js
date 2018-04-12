import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

let nextTodoId = 1
const addTodo = (text) => {
  return{
    id: nextTodoId++,
    type: 'ADD_TODO',
    text
  }
}
const toggleTodo = (id) => {
  return{
    type: 'TOGGLE_TODO',
    id
  }
}
const setVisibilityFilter = (filter) => {
  return{
    type: 'VISIBILITY_FILTER',
    filter
  }
}
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
  switch (action.type) {
    case 'VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
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
const mapDispatchToAddTodoProps = (dispatch) => {
  return{
    onClick:(text) => {
      dispatch(addTodo(text))
    }
  }
}

AddTodo = connect(
  null,
  mapDispatchToAddTodoProps
)(AddTodo)

const Todo = ({id, onClick, text, completed}) => (
  <li onClick={() => onClick(id)}>
    <p style={{textDecoration: completed ? 'line-through' : 'none'}}>
      {text}
    </p>
  </li>
)
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map((todo) =>
      <Todo key={todo.id} {...todo} onClick={onTodoClick} />
    )}
  </ul>
)
const getVisibleTodos = (todos, visibilityFilter) => {
  switch (visibilityFilter) {
    case 'ACTIVE':
      return todos.filter(t => {
        return !t.completed
      })
    case 'COMPLETED':
    return todos.filter(t => {
      return t.completed
    })
    default:
      return todos
  }
}
const mapStateToTodoListProps = (state) => {
    return{
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}
const mapDispatchToTodoListProps = (dispatch, ownProps) => {
  return{
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList)

const Link = ({children, onLinkClick}) => (
  <a href='#' onClick={onLinkClick}>
    {children}
  </a>
)
const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return{
    onLinkClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  null,
  mapDispatchToLinkProps
)(Link)
const Footer = () => (
  <div>
    <FilterLink filter='SHOW_ALL'>
      SHOW_ALL
    </FilterLink>
    {"  "}
    <FilterLink filter='ACTIVE'>
      ACTIVE
    </FilterLink>
    {"  "}
    <FilterLink filter='COMPLETED'>
      COMPLETED
    </FilterLink>
  </div>
)

const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
)
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
)
