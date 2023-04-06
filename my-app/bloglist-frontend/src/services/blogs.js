import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const addNew = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('blogservice ', newObject)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


const addLike = async likedObject => {
  const url = baseUrl.concat('/',likedObject.blogId)
  const config = {
    headers: { Authorization: token }
  }
  const blogInfo = {
    user: likedObject.user.id,
    likes: likedObject.likes,
    author: likedObject.author,
    title: likedObject.title,
    url: likedObject.url
  }
  const response = await axios.put(url, blogInfo, config)
  return response.data
}

const removeBlog = async blogId => {
  const url = baseUrl.concat('/', blogId)
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(url, config)
  console.log('blogcontroller response.data ', response)
  return response
}

const exports = { getAll, addNew, setToken, addLike, removeBlog }

export default exports