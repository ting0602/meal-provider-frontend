// src/components/CommonComponents/ShopInfoCard/ShopInfoCard.test.tsx
/* eslint-disable testing-library/no-node-access */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard'
import NoImg from 'assets/default-image.png'

describe('<ShopInfoCard />', () => {
  const baseProps = {
    name: 'Test Shop',
    rating: 4.2,
  }

  it('renders with meal styling when type=0', () => {
    render(<ShopInfoCard type={0} {...baseProps} image="img.png" />)

    // pick the img by its alt text
    const img = screen.getByRole('img', { name: /Test Shop/i })
    // its nearest ancestor .shop-card should have the correct class
    const card = img.closest('.shop-card')
    expect(card).toHaveClass('type-meal')

    // and the wrapping .image-container likewise
    const container = img.closest('.image-container')
    expect(container).toHaveClass('type-meal')
  })

  it('renders with dessert styling when type!=0', () => {
    render(<ShopInfoCard type={1} {...baseProps} image="img.png" />)

    const img = screen.getByRole('img', { name: /Test Shop/i })
    const card = img.closest('.shop-card')
    expect(card).toHaveClass('type-dessert')

    const container = img.closest('.image-container')
    expect(container).toHaveClass('type-dessert')
  })

  it('displays the provided image and alt text', () => {
    render(<ShopInfoCard type={0} {...baseProps} image="img.png" />)
    const img = screen.getByAltText('Test Shop') as HTMLImageElement
    expect(img.src).toContain('img.png')
  })

  it('falls back to default image on error', () => {
    render(<ShopInfoCard type={0} {...baseProps} image="broken.png" />)
    const img = screen.getByAltText('Test Shop') as HTMLImageElement
    fireEvent.error(img)
    expect(img.src).toContain(NoImg)
  })

  it('renders shop name and formatted rating', () => {
    render(<ShopInfoCard type={0} {...baseProps} image="img.png" />)
    expect(screen.getByText('Test Shop')).toBeInTheDocument()
    expect(screen.getByText('4.2')).toBeInTheDocument()
  })
})
