import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleAddLike, handleRemoveBlog }) => {

  const [visible, setVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (likedBlog) => {
    const newLikes = likedBlog.likes + 1

    handleAddLike({
      blogId: likedBlog.id,
      user: likedBlog.user,
      likes: newLikes,
      author: likedBlog.author,
      title: likedBlog.title,
      url: likedBlog.url
    })
    setBlogLikes(newLikes)
  }

  const removeBlog = (blogId) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {

      handleRemoveBlog(blogId)
    }
  }
  const showRemoveButton = (username) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    const user = JSON.parse(loggedUserJSON)
    if (username === user.username) {
      return(
        <div>
          <button id='removeButton' onClick={ () => removeBlog(blog.id)}>remove</button>
        </div>
      )
    }
  }

  return(
    <div className='blogStyle'>
      <div id={'basicInfo'} style={hideWhenVisible}>
        {blog.title} {blog.author} <button id='showAdditionalInfoButton' onClick={toggleVisibility}> view </button>
      </div>
      <div id='additionalInfo' className='togglableInfo' style={showWhenVisible} >
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button> {<br/>}
        {blog.url} {<br/>}
      likes: {blogLikes} <button id='likeButton' onClick={ () => addLike(blog)}>like</button>{<br/>}
        {blog.user.name} <br/>
        {showRemoveButton(blog.user.username)}
      </div>
    </div>)
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired
}

export default Blog