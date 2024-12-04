'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plane, Calendar, Clock, ArrowLeft, Loader2 } from 'lucide-react'
import { FlightData } from '@/app/types/Flight'


export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const [flight, setFlight] = useState<FlightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bookingInProgress, setBookingInProgress] = useState(false)

  useEffect(() => {
    const fetchFlight = async () => {
      if (!params || !params.id) {
        setError('No flight ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:3000/api/get-flight?flightId=${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch flight details')
        }
        const data = await response.json()
        setFlight(data)
        setLoading(false)
      } catch (err) {
        setError('An error occurred while fetching the flight details. Please try again later.')
        setLoading(false)
      }
    }

    fetchFlight()
  }, [params])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!flight) {
      setError('No flight selected')
      return
    }
    setBookingInProgress(true)
    try {
      const response = await fetch('http://localhost:3000/api/insert-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          flight_id: flight.id,
        }),
      })
      if (!response.ok) {
        throw new Error('Booking failed')
      }
      const data = await response.json()
      router.push(`/confirmation?bookingId=${data.id}`)
    } catch (err) {
      setError('An error occurred while booking the flight. Please try again.')
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error || 'Flight not found'}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Book Your Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{flight.departure} to {flight.destination}</h3>
                <p className="text-sm text-gray-500">${flight.price}</p>
              </div>
              <Plane className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm">{new Date(flight.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm">{new Date(flight.date).toLocaleTimeString()}</p>
            </div>
          </div>
          <form onSubmit={handleBooking} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={bookingInProgress}>
              {bookingInProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                'Book Flight'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => router.push('/')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
