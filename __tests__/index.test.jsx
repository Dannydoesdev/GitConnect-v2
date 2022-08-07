import { render, screen } from '@testing-library/react'
import Index from '../pages/index'
import '@testing-library/jest-dom'

describe('Index', () => {
  it('renders a heading', () => {
    render(<Index />)

    const heading = screen.getByRole('heading', {
      name: 'GitConnect;'
    })

    expect(heading).toBeInTheDocument()
  })
})