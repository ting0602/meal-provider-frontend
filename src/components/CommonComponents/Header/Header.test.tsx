// src/components/CommonComponents/Header.test.tsx
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Header from 'components/CommonComponents/Header'

describe('<Header /> component', () => {
  const factories = ['台積電1廠', '台積電2廠', '台積電3廠', '台積電4廠', '台積電5廠']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders default factory when no defaultFactoryIndex provided', () => {
    render(<Header />)
    expect(screen.getByText(factories[0])).toBeInTheDocument()
  })

  it('renders the factory at defaultFactoryIndex', () => {
    render(<Header defaultFactoryIndex={2} />)
    expect(screen.getByText(factories[2])).toBeInTheDocument()
  })

  it('toggles the collapse list when header button is clicked', async () => {
    render(<Header />)
    const toggleButton = screen.getByRole('button', { name: factories[0] })

    // initially collapsed
    expect(screen.queryByRole('button', { name: factories[1] })).toBeNull()

    // open
    fireEvent.click(toggleButton)
    expect(screen.getByRole('button', { name: factories[1] })).toBeInTheDocument()

    // close and wait for unmount
    fireEvent.click(toggleButton)
    await waitForElementToBeRemoved(() => screen.queryByRole('button', { name: factories[1] }))
  })

  it('calls onSelectFactory with correct arguments and updates selectedFactory', async () => {
    const onSelect = vi.fn()
    render(<Header onSelectFactory={onSelect} />)
    const toggleButton = screen.getByRole('button', { name: factories[0] })

    // open list
    fireEvent.click(toggleButton)
    // select the 4th factory (index 3)
    const fourthButton = screen.getByRole('button', { name: factories[3] })
    fireEvent.click(fourthButton)

    expect(onSelect).toHaveBeenCalledWith(factories[3], 3)
    expect(screen.getByText(factories[3])).toBeInTheDocument()

    // after selection, collapse unmounts items
    await waitForElementToBeRemoved(() => screen.queryByRole('button', { name: factories[1] }))
  })
})
