import { React, useState }from 'react'
import PropTypes from 'prop-types'

const CreateNewBlog = ({
  handleCreateNew,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = (event) => setTitle(event.target.value)
  const handleAuthorChange= (event) => setAuthor(event.target.value)
  const handleUrlChange = (event) => setUrl(event.target.value)

  const addNewBlog = (event) => {
    event.preventDefault()

    handleCreateNew({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div>
      <h2> create new </h2>
      <form >
        <div>
    title:
          <input
            id='title'
            type='title'
            value={title}
            name='Title'
            onChange={handleTitleChange}
          />
        </div>
        <div>
    author:
          <input
            id='author'
            type='author'
            value={author}
            name='Author'
            onChange={handleAuthorChange}
          />
        </div>
        <div>
    url:
          <input
            id='url'
            type='url'
            value={url}
            name='Url'
            onChange={handleUrlChange}
          />
        </div>
        <button id='submitButton' type="submit" onClick={addNewBlog} >create</button>
      </form>
    </div>
  )}

CreateNewBlog.propTypes = {
  handleCreateNew: PropTypes.func.isRequired
}


export default CreateNewBlog