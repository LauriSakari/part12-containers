import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders content', () => {
  const todo = {
    text: 'Write code', 
    done: true
  }

  render(<Todo todo={todo} />)

  const element = screen.getByText('Write code')
  expect(element).toBeDefined()
})