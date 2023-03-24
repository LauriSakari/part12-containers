const express = require('express');
const { Todo } = require('../mongo')
const { setAsync, getAsync } = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const todosPostedSoFar = await getAsync('added_todos')
  const todosPosted = Number(todosPostedSoFar) + 1
  await setAsync('added_todos', todosPosted )
  console.log(todosPosted)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo)
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const filter = {_id: req.todo._id}
  console.log(filter)
  const body = req.body
  const updateTodo = {
    $set: {
       text: body.text,
       done: body.done
    },
 }
  const savedTodo = await Todo.updateOne(filter, updateTodo);
  console.log(savedTodo)

  res.send(savedTodo); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
