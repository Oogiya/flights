import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    }
  },
}))

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
) as jest.Mock

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByText('Vim Flights')).toBeInTheDocument()
    expect(screen.getByText('Discover Your Next Adventure')).toBeInTheDocument()
  })

  it('renders the search form', () => {
    render(<Home />)
    expect(screen.getByLabelText('From')).toBeInTheDocument()
    expect(screen.getByLabelText('To')).toBeInTheDocument()
    expect(screen.getByText('Search by date range')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument()
  })

  it('allows user to input search criteria', async () => {
    await act(async () => {
      render(<Home />)
    })

    const fromInput = screen.getByLabelText('From')
    const toInput = screen.getByLabelText('To')
    const dateRangeCheckbox = screen.getByRole('checkbox', { name: '' })
    const dateRangeLabel = screen.getByText('Search by date range')

    await act(async () => {
      await userEvent.type(fromInput, 'New York')
      await userEvent.type(toInput, 'London')
      await userEvent.click(dateRangeCheckbox)
    })

    expect(fromInput).toHaveValue('New York')
    expect(toInput).toHaveValue('London')
    expect(dateRangeCheckbox).toHaveAttribute('aria-checked', 'true')

    // Wait for date inputs to appear
    await waitFor(() => {
      const startDateInput = screen.getByLabelText('Start Date')
      const endDateInput = screen.getByLabelText('End Date')
      expect(startDateInput).toBeInTheDocument()
      expect(endDateInput).toBeInTheDocument()
    })

    const startDateInput = screen.getByLabelText('Start Date')
    const endDateInput = screen.getByLabelText('End Date')

    await act(async () => {
      await userEvent.type(startDateInput, '2024-12-05')
      await userEvent.type(endDateInput, '2024-12-10')
    })

    expect(startDateInput).toHaveValue('2024-12-05')
    expect(endDateInput).toHaveValue('2024-12-10')
  })

  it('performs search when form is submitted', async () => {
    await act(async () => {
      render(<Home />)
    })

    const fromInput = screen.getByLabelText('From')
    const toInput = screen.getByLabelText('To')
    const searchButton = screen.getByRole('button', { name: /search flights/i })

    await act(async () => {
      await userEvent.type(fromInput, 'New York')
      await userEvent.type(toInput, 'London')
      await userEvent.click(searchButton)
    })

    expect(global.fetch).toHaveBeenCalled()
  })

  it('displays flight results after search', async () => {
    const mockFlights = [
      { id: 1, departure: 'New York', destination: 'London', date: '2024-12-05', price: 500 },
      { id: 2, departure: 'London', destination: 'Paris', date: '2024-12-06', price: 200 },
    ]

    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/get-all-flights') {
        return Promise.resolve({
          json: () => Promise.resolve(mockFlights),
          ok: true,
        })
      }
      return Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      })
    })

    

    await act(async () => {
      render(<Home />)
    })

    // Simulate search to trigger flight results
    const searchButton = screen.getByRole('button', { name: /search flights/i })
    await userEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('New York to London')).toBeInTheDocument()
      expect(screen.getByText('London to Paris')).toBeInTheDocument()
    })
  })

  it('fetches cities for autocomplete', async () => {
    const mockCities = ['New York', 'London', 'Paris']
    ;(global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/api/get-all-cities') {
        return Promise.resolve({
          json: () => Promise.resolve(mockCities),
          ok: true,
        })
      }
      return Promise.resolve({
        json: () => Promise.resolve([]),
        ok: true,
      })
    })

    await act(async () => {
      render(<Home />)
    })

    const fromInput = screen.getByLabelText('From')
    await act(async () => {
      await userEvent.type(fromInput, 'New')
    })

    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument()
    })
  })

})
