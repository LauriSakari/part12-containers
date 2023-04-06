import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import CreateNewBlog from './CreateNewBlog'
import { render, fireEvent } from '@testing-library/react'

describe('<CreateNewBlog />', () => {

  test('calls the given callbackfunction with correct information when submitted', () => {

    const handleCreateNew = jest.fn()

    const component = render(
      <CreateNewBlog handleCreateNew={handleCreateNew}/>
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('input[name="Author"]')
    const urlInput = component.container.querySelector('input[name="Url"]')
    const submitButton = component.container.querySelector('button[type="submit"]')

    fireEvent.change(titleInput, {
      target: { value: 'testing title input' }
    })
    fireEvent.change(authorInput, {
      target: { value: 'testing author input' }
    })
    fireEvent.change(urlInput, {
      target: { value: 'testing url input' }
    })
    fireEvent.click(submitButton)

    expect(handleCreateNew.mock.calls).toHaveLength(1)

    expect(handleCreateNew.mock.calls[0][0].title).toBe('testing title input')
    expect(handleCreateNew.mock.calls[0][0].author).toBe('testing author input')
    expect(handleCreateNew.mock.calls[0][0].url).toBe('testing url input')
  })
})