import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {

  let component
  const mockHandler = jest.fn()

  beforeEach(() => {

    const user = {
      username: 'leit',
      name: 'Lauri',
      id: '61671e8c5401674532d4307b'
    }
    window.localStorage.setItem(
      'loggedBlogAppUser', JSON.stringify(user)
    )

    const blog = {
      author: 'bloggaaja',
      id: '616c12010445da3e1f01a058',
      likes: 60,
      title: 'blogin testausta',
      url: 'http://www.blogtest.html',
      user: { username: 'leit', name: 'Lauri', id: '61671e8c5401674532d4307b' }
    }

    component = render(
      <Blog blog={blog}
        handleAddLike={mockHandler}
      />
    )
  })

  test('renders blog title and author but not url or likes', () => {

    const div = component.container.querySelector('.togglableInfo')

    expect(component.container).toHaveTextContent(
      'blogin testausta' && 'bloggaaja'
    )

    expect(div).toHaveStyle('display: none')
  })

  test('renders url and likes when button has been ckicked', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableInfo')
    expect(div).not.toHaveStyle('display: none')
  })

  test('eventhandler is called twice when button is clicked twice', () => {

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  }
  )
})

