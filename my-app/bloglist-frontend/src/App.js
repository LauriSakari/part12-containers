import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateNewBlog from './components/CreateNewBlog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  //const [username, setUsername] = useState('')
  //const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addNewBlogFormRef = useRef()

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    if (errorMessage === null && successMessage) {
      return (
        <div className="success">
          {message}
        </div>
      )
    }
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const handleLogin = async ({ username, password }) => {
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(
      'loggedBlogAppUser'
    )
    setUser(null)
  }

  const handleAddLike = async (likedBlog) => {
    try {
      const response = await blogService.addLike(likedBlog)
      const updatedBlogIndex = blogs.findIndex(blog => blog.id === response.id)
      blogs[updatedBlogIndex].likes = response.likes
    }
    catch(exeption){
      setErrorMessage(`something went wrong while adding your like to server: ${exeption} `)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreateNew = async (blogObject) => {
    console.log('handlecreatenew ', blogObject)

    try {
      const response = await blogService.addNew(
        blogObject
      )
      console.log('handle create ', response)
      const newBlog = {
        id: response.id,
        title: response.title,
        author: response.author,
        url: response.url,
        likes: response.likes,
        user: response.user
      }
      console.log(newBlog)
      setBlogs(blogs.concat(newBlog))
      addNewBlogFormRef.current.toggleVisibility()
      setSuccessMessage(`a new blog ${response.title} by ${response.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch(exeption) {
      setErrorMessage(`something went wrong ${exeption}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemoveBlog = async (blogId) => {
    console.log('App ', blogId)
    try{
      const response = await blogService.removeBlog(blogId)
      console.log('App ', response)
      setBlogs(blogs.filter(blog => blog.id !== blogId))
      setSuccessMessage('blog was succesfully removed')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    catch(exeption){
      setErrorMessage(`something went wrong while removing the blog ${exeption}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>Login</h2>
      <Notification message={errorMessage}/>

      <LoginForm handleLogin={handleLogin}/>
    </>
  )

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessage} />
      <Notification message={errorMessage} />
      <p> {user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {addNewBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}
          handleAddLike={handleAddLike}
          handleRemoveBlog={handleRemoveBlog}/>
      )}
    </div>
  )

  const addNewBlogForm = () => {
    return (
      <div>
        <Togglable id='createNewButton' buttonLabel='create new blog' ref={addNewBlogFormRef}>
          <CreateNewBlog
            handleCreateNew={handleCreateNew}
          />
        </Togglable>
      </div>
    )}

  return (
    <>
      {user === null ?
        loginForm() :
        blogList()
      }
    </>
  )
}

export default App