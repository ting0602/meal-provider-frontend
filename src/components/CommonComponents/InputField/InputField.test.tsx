// src/components/CommonComponents/InputField.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import InputField from 'components/CommonComponents/InputField'

// A dummy icon component for testing
const DummyIcon = (props: any) => <svg data-testid="dummy-icon" {...props} />

describe('<InputField />', () => {
  const placeholder = 'Enter name'
  const initialValue = 'Alice'
  const newValue = 'Bob'

  it('renders an input with correct placeholder, type and value', () => {
    const onChange = vi.fn()
    render(
      <InputField
        placeholder={placeholder}
        value={initialValue}
        onChange={onChange}
      />
    )

    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', placeholder)
    expect(input.type).toBe('text')
    expect(input.value).toBe(initialValue)
  })

  it('accepts a custom type prop', () => {
    const onChange = vi.fn()
    render(
      <InputField
        type="password"
        placeholder={placeholder}
        value=""
        onChange={onChange}
      />
    )
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement
    expect(input.type).toBe('password')
  })

  it('renders an icon when provided', () => {
    const onChange = vi.fn()
    render(
      <InputField
        Icon={DummyIcon}
        placeholder={placeholder}
        value=""
        onChange={onChange}
      />
    )
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument()
  })

  it('does not render any icon when no Icon prop', () => {
    const onChange = vi.fn()
    render(
      <InputField
        placeholder={placeholder}
        value=""
        onChange={onChange}
      />
    )
    expect(screen.queryByTestId('dummy-icon')).toBeNull()
  })

  it('calls onChange when user types', () => {
    const onChange = vi.fn()
    render(
      <InputField
        placeholder={placeholder}
        value={initialValue}
        onChange={onChange}
      />
    )

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement
    fireEvent.change(input, { target: { value: newValue } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})