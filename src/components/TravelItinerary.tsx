import ReactMarkdown from "react-markdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Chat } from "./Chat";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  // Split the itinerary into main content and flights section
  const [mainContent, flightsSection] = itinerary.split("## Available Flights");

  // Parse flight data from markdown if available
  const flightData = flightsSection?.match(/Option \d+[\s\S]*?(?=Option|\Z)/g) || [];

  return (
    <div className="mt-8 space-y-8">
      <div className="p-6 bg-black rounded-lg shadow-lg animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4 text-travel-primary">
          Your Travel Itinerary
        </h2>
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <ReactMarkdown>{mainContent}</ReactMarkdown>
        </div>

        {flightsSection && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4 text-travel-primary">
              Available Flights
            </h3>
            <div className="block md:hidden"> {/* Mobile view */}
              {flightData && flightData.length > 0 ? (
                <div className="space-y-4">
                  {flightData.map((flight, index) => {
                    const price = flight.match(/Price: \$(\d+)/)?.[1];
                    const duration = flight.match(/Duration: (\d+)/)?.[1];
                    const airline = flight.match(/Airline: ([^\n]+)/)?.[1];
                    const flightNumber = flight.match(/Flight Number: ([^\n]+)/)?.[1];
                    const bookingToken = flight.match(/Booking Token: ([^\n]+)/)?.[1];

                    return (
                      <div key={index} className="p-4 border rounded-lg bg-black/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Option {index + 1}</span>
                          <span className="font-bold text-travel-primary">${price}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {duration} mins
                          </div>
                          <div>
                            <span className="text-muted-foreground">Airline:</span> {airline}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Flight:</span> {flightNumber}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full text-travel-primary hover:text-travel-primary/80"
                          onClick={() => {
                            window.open(
                              `https://www.google.com/flights/booking?token=${bookingToken}`,
                              "_blank"
                            );
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No flight information available for this route. Please try again with different dates or destinations.</p>
              )}
            </div>
            <div className="hidden md:block"> {/* Desktop view - original table */}
              {flightData && flightData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Option</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Airline</TableHead>
                      <TableHead>Flight Number</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flightData.map((flight, index) => {
                      const price = flight.match(/Price: \$(\d+)/)?.[1];
                      const duration = flight.match(/Duration: (\d+)/)?.[1];
                      const airline = flight.match(/Airline: ([^\n]+)/)?.[1];
                      const flightNumber = flight.match(/Flight Number: ([^\n]+)/)?.[1];
                      const bookingToken = flight.match(/Booking Token: ([^\n]+)/)?.[1];

                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>${price}</TableCell>
                          <TableCell>{duration} mins</TableCell>
                          <TableCell>{airline}</TableCell>
                          <TableCell>{flightNumber}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              className="text-travel-primary hover:text-travel-primary/80"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/flights/booking?token=${bookingToken}`,
                                  "_blank"
                                );
                              }}
                            >
                              Book Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No flight information available for this route. Please try again with different dates or destinations.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Chat itinerary={itinerary} />
    </div>
  );
}
