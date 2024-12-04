'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plane, Calendar, Clock, ArrowLeft, X } from 'lucide-react'
import { motion } from "framer-motion"

interface Booking {
  id: number
  status: string
  departure: string
  destination: string
  date: string
  price: number
}

export default function BookedFlights() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // In a real application, you would get the user ID from authentication
        const userId = 1 // Placeholder user ID
        const response = await fetch(`http://localhost:3000/api/get-user-bookings?userId=${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch bookings')
        }
        const data = await response.json()
        setBookings(data)
        setLoading(false)
      } catch (err) {
        setError('An error occurred while fetching your bookings. Please try again later.')
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`http:/backend-dev:3001/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
      })
      if (!response.ok) {
        throw new Error('Failed to cancel booking')
      }
      // Update the local state to reflect the cancellation
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ))
    } catch (err) {
      setError('An error occurred while cancelling the booking. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Your Booked Flights</h1>
          <Button variant="outline" onClick={() => router.push('/')} className="bg-white bg-opacity-20 text-white border-white border-opacity-50 hover:bg-opacity-30">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-white">Loading your bookings...</div>
        ) : error ? (
          <div className="text-center text-white bg-red-500 bg-opacity-50 p-4 rounded-md">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-white">You have no booked flights.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="flex-grow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{booking.departure} to {booking.destination}</h3>
                        <p className="text-pink-200 font-bold">${booking.price}</p>
                      </div>
                      <Plane className="h-6 w-6 text-pink-200" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-pink-200 mr-2" />
                        <p className="text-sm text-white">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-pink-200 mr-2" />
                        <p className="text-sm text-white">
                          {new Date(booking.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                        } text-white`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div className="w-full flex space-x-2">
                      <Button
                        className="flex-1 bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                        onClick={() => router.push(`/flight/${booking.id}`)}
                      >
                        View Details
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button
                          className="flex-1 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
