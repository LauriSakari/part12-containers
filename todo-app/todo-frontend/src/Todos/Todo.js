const Todo = ({ todo, doneInfo, notDoneInfo }) => {
    console.log(todo.text)



    return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
    </>
   )
}

export default Todo