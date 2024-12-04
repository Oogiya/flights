import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Home from './page'

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
        }
    },
}))


global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
) as jest.Mock

describe("Home components", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders the main heading", () => {
        render(<Home />)
        expect(screen.getByText("Giga Flights")).toBeInTheDocument()
        expect(screen.getByText("Discover Your Next Adventure")).toBeInTheDocument()
    })

    it("renders the main heading", () => {
        render(<Home />)
        expect(screen.getByLabelText("From")).toBeInTheDocument()
        expect(screen.getByLabelText("To")).toBeInTheDocument()
        expect(screen.getByLabelText("Search by date")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /search flights/i })).toBeInTheDocument()
    })

    it("allows user to input search criteria", async () => {
        render(<Home />)

        const fromInput = screen.getByLabelText("From")
        const toInput = screen.getByLabelText("To")
        const dateCheckBox = screen.getByLabelText("Search by date")

        fireEvent.change(fromInput, { target: { value: "new york" } })
        fireEvent.change(toInput, { target: { value: "london" } })
        fireEvent.click(dateCheckBox)

        expect(fromInput).toHaveValue("new york")
        expect(toInput).toHaveValue("london")
        expect(dateCheckBox).toBeChecked()

        const dateInput = await screen.findByLabelText("Date")
        expect(dateInput).toBeInTheDocument()

        fireEvent.change(dateInput, { target: { value: "2024-12-05" } })
        expect(dateInput).toHaveValue("2024-12-05")
    })

    it("performs search when form is submitted", async () => {
        render(<Home />)

        const fromInput = screen.getByLabelText("From")
        const toInput = screen.getByLabelText("To")
        const searchButton = screen.getByRole("button", { name: /search flights/i })

        fireEvent.change(fromInput, { target: { value: "new york" } })
        fireEvent.change(toInput, { target: { value: "london" } })

        await act(async () => {
            fireEvent.click(searchButton)
        })

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("api"))
    })

    it("displays flight results after search", async () => {
        const mockFlights = [
            { id: 1, departure: "New York", destination: "London", date: "2024-12-05T10:00:00Z", price: 500 },
            { id: 2, departure: "London", destination: "Paris", date: "2024-12-06T10:00:00Z", price: 200 },
        ]

        ;(global.fetch as jest.Mock).mockImplementationOnce(() => 
            Promise.resolve({
                json: () => Promise.resolve(mockFlights),
            })
       )

        render(<Home />)

        const searchButton = screen.getByRole("button", { name: /search flights/i })

        await act(async () => {
            fireEvent.click(searchButton)
        })

        await waitFor(() => {
            expect(screen.getByText("New York to London")).toBeInTheDocument()
            expect(screen.getByText("London to Paris")).toBeInTheDocument()
        })
    })


    it("toggles login state when login/logout button is clicked", () => {
        render(<Home />)

        const loginButton = screen.getByRole("button", { name: /login/i })
        fireEvent.click(loginButton)

        expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
        expect(screen.getByRole("button", { name: /my flights/i })).toBeInTheDocument()

        const logoutButton = screen.getByRole("button", { name: /logout/i })
        fireEvent.click(logoutButton)

        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
    })
})
