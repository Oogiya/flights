"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { LogOut, List, User, Car, Plane, Calendar, Search } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useEffect } from "react"
import { FlightData } from "./types/Flight";

interface Flight {
    id: number,
    from: string,
    to: string,
    date: string,
    departure: string,
    arrival: string,
    price: number
}

const flightsMock: Flight[] = [
    { id: 1, from: "new york", to: "london", date: "2023-07-20", departure: "08:00", arrival: "20:00", price: 450 },
    { id: 2, from: "place1", to: "place10", date: "2023-05-10", departure: "12:00", arrival: "22:00", price: 220 },
    { id: 3, from: "place2", to: "place11", date: "2023-02-24", departure: "08:00", arrival: "12:30", price: 200 },
    { id: 4, from: "place3", to: "place12", date: "2023-01-22", departure: "18:00", arrival: "14:20", price: 1250 },
]


function FlightSearch({ flights, searchFrom, setSearchFrom, fromSuggestions, setFromSuggestions, 
                      searchTo, setSearchTo, toSuggestions, setToSuggestions, 
                      useDate, setUseDate,
                      startDate, setStartDate, endDate, setEndDate,
                      searchResults, setSearchResults,
                      onSubmit  }: {

    flights: FlightData[]

    searchFrom: string
    setSearchFrom: (setSearchForm: string) => void 
    fromSuggestions: string[]
    setFromSuggestions: (setFromSuggestions: string[]) => void

    searchTo: string
    setSearchTo: (setSearchForm: string) => void 
    toSuggestions: string[]
    setToSuggestions: (setFromSuggestions: string[]) => void

    useDate: boolean
    setUseDate: (setUseDate: boolean) => void

    startDate: string
    setStartDate: (setStartDate: string) => void

    endDate: string
    setEndDate: (setEndDate: string) => void

    searchResults: FlightData[]
    setSearchResults: (setSearchResults: FlightData[]) => void

    onSubmit: FormEventHandler
}) {
    const [showFromDropdown, setShowFromDropdown] = React.useState(false);
    const [showToDropdown, setShowToDropdown] = React.useState(false);



    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        let fliteredFlights = flights.filter(flight => 
            flight.departure.toLowerCase().includes(searchFrom.toLowerCase()) &&
            flight.destination.toLowerCase().includes(searchTo.toLowerCase())
        )

        if (useDate && startDate && endDate) {
            fliteredFlights = fliteredFlights.filter(flight =>
                flight.date >= startDate && flight.date <= endDate
            )
        }

        fliteredFlights.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setSearchResults(fliteredFlights);
    }

    return (
        <Card className="mb-12 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20">
            <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px] relative">
                            <Label htmlFor="searchFrom" className="text-white mb-2 block">From</Label>
                            <Input 
                                id="searchFrom"
                                value={searchFrom}
                                onChange={(e) => {
                                    setSearchFrom(e.target.value)
                                    setShowFromDropdown(true)
                                }}
                                onFocus={() => setShowFromDropdown(true)}
                                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                                placeholder="Departure City"
                                autoComplete="off"
                                className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 border-white border-opacity-20"
                            />
                            {showFromDropdown && searchFrom && fromSuggestions.length > 0 && (
                                <ul className="absolute z-50 w-full bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20
                                                rounded-md mt-1 max-h-60 overflow-auto">
                                    {fromSuggestions.map((city, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-purple-600"
                                            onClick={() => {
                                                setSearchFrom(city)
                                                setFromSuggestions([])
                                                setShowFromDropdown(false)
                                            }}
                                            
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex-1 min-w-[200px] relative">
                            <Label htmlFor="searchTo" className="text-white mb-2 block">To</Label>
                            <Input 
                                id="searchTo"
                                value={searchTo}
                                onChange={(e) => {
                                    setSearchTo(e.target.value)
                                    setShowToDropdown(true)
                                }}
                                onFocus={() => setShowToDropdown(true)}
                                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                                placeholder="Destination City"
                                autoComplete="off"
                                className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-50 border-white border-opacity-20"
                            />
                            {showToDropdown && searchTo && toSuggestions.length > 0 && (
                                <ul className="absolute z-50 w-full bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20
                                                rounded-md mt-1 max-h-60 overflow-auto">
                                    {toSuggestions.map((city, index) => (
                                        <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-purple-600"
                                            onClick={() => {
                                                setSearchTo(city)
                                                setToSuggestions([])
                                                setShowToDropdown(false)
                                            }}
                                        >
                                            {city}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="useData" 
                            checked={useDate} 
                            onCheckedChange={(checked) => setUseDate(checked as boolean)}
                        />
                        <Label htmlFor="useDate" className="text-white">
                            Search by date range
                        </Label>
                    </div>

                    {useDate && (

                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Label htmlFor="startDate" className="text-white mb-2 block">Start Date</Label>
                            <Input 
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Label htmlFor="endDate" className="text-white mb-2 block">End Date</Label>
                            <Input 
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    )}
                    <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-opacity-90">
                        <Search className="w-4 h-4 mr-2" />
                        Search Flights
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function GetAllFlights({ listOfFlights, router }: {
    listOfFlights: FlightData[]
    router: AppRouterInstance
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listOfFlights.map((flight) => (
                <div key={flight.id}>
                    <Card className="h-full flex flex-col bg-white bg-opacity-10 border border-white
                                    border-opacity-20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="flex-grow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{flight.departure} to {flight.destination}</h3>
                                    <p className="text-pink-200 font-bold">${flight.price}</p>
                                </div>
                                <Plane className="w-6 h-6 text-pink-200"/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-pink-200 mr-2" />
                                    <p className="text-sm text-white">{flight.date}</p>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-5 h-5 text-pink-200 mr-2" />
                                    <p className="text-sm text-white">{flight.departure} - TIME</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                            <div className="w-full flex space-x-2">
                                <Button className="flex-1 bg-white bg-opacity-20 text-white over:bg-opacity-30"
                                    onClick={() => router.push(`/flight/${flight.id}`)}>
                                    View Details
                                </Button>
                                <Button className="flex-1 bg-white text-purple-600 hover:bg-opacity-90"
                                    onClick={() => router.push(`/booking/${flight.id}`)}>
                                    Book Now
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default function Home() {
    const router = useRouter();

    const [flights, setFlights] = React.useState<FlightData[]>([]);

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const [fromSuggestions, setFromSuggestions] = React.useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = React.useState<string[]>([]);

    const [searchFrom, setSearchFrom] = React.useState('');
    const [searchTo, setSearchTo] = React.useState('');

    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');

    const [useDate, setUseDate] = React.useState(false);

    const [searchResults, setSearchResults] = React.useState<FlightData[]>([]);

    const [allCities, setAllCities] = React.useState<string[]>([]);
    
    const fetchAllCities = async () => {
        try {
            const response = await fetch("/api/get-all-cities");
            const cities = await response.json();
            setAllCities(cities);
        } catch (err) {
            console.error("Error fetching all cities.", err);
        }
    } 

    async function setAllFlights() {
        const response = await fetch("/api/get-all-flights");
        try {
            if (response.ok) {
                const data: FlightData[] = await response.json();
                setFlights(data);
                console.log(data);
            } else {
                console.error("Failed to fetch all flights");
            }
        } catch (err) {
            console.error("Error fetching all flights", err);
        }
    } 

    useEffect(() => {
        setAllFlights();
        fetchAllCities();
        setSearchResults(flights);

    }, []);

    useEffect(() => {
        if (searchFrom.trim() !== '') {
            const filteredCities = allCities.filter(city =>
                city.toLowerCase().includes(searchFrom.toLowerCase())
            )
            setFromSuggestions(filteredCities)
        } else {
            setFromSuggestions([])
        }
    }, [searchFrom, allCities]);

    useEffect(() => {
        if (searchTo.trim() !== '') {
            const filteredCities = allCities.filter(city =>
                city.toLowerCase().includes(searchTo.toLowerCase())
            )
            setToSuggestions(filteredCities)
        } else {
            setToSuggestions([])
        }
    }, [searchTo, allCities]);


    const handleLogin = () => {
        setIsLoggedIn(true);
    }

    const handleLogout = () => {
        setIsLoggedIn(false);
    }

    const onSubmit = () => {}

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink to-red-500">
            <header className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">Vim Flights</h1>
                    <div className="space-x-4">
                        {isLoggedIn ? (
                            <>
                            <Button variant="outline" onClick={() => router.push("/booked-flights")} 
                                className="bg-white bg-opacity-20 text-white border-white border-opacity-50 hover:bg-opacity-30">
                                <List className="w-4 h-4 mr-2" />
                                My Flights
                            </Button>
                            <Button variant="outline" onClick={handleLogout} 
                                className="bg-white bg-opacity-20 text-white border-white border-opacity-50 hover:bg-opacity-30">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={handleLogin} 
                            className="bg-white text-purple-600 over:bg-opacity-90">
                                <User className="w-4 h-4 mr-2" />
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <h2 className="text-4xl font-bold mb-12 text-center text-white">Discover Your Next Adventure</h2>

                <FlightSearch 
                    flights={flights}
                    searchFrom={searchFrom}
                    setSearchFrom={setSearchFrom}
                    fromSuggestions={fromSuggestions}
                    setFromSuggestions={setFromSuggestions}
                    searchTo={searchTo}
                    setSearchTo={setSearchTo}
                    toSuggestions={toSuggestions}
                    setToSuggestions={setToSuggestions}
                    useDate={useDate}
                    setUseDate={setUseDate}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    onSubmit={onSubmit} />
                <GetAllFlights listOfFlights={searchResults} router={router} />
            </main>
        </div>
    )
}
