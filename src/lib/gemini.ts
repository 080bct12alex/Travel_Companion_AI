import { GoogleGenerativeAI } from "@google/generative-ai";

// Environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export type TravelPreferences = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
  includeTransportation?: boolean;
};

export type Airport = {
  name: string;
  id: string;
  time: string;
};

export type Flight = {
  departure_airport: Airport;
  arrival_airport: Airport;
  duration: number;
  airplane: string;
  airline: string;
  airline_logo: string;
  travel_class: string;
  flight_number: string;
  legroom: string;
  extensions: string[];
  overnight?: boolean;
};

export type BestFlight = {
  flights: Flight[];
  layovers?: {
    duration: number;
    name: string;
    id: string;
  }[];
  total_duration: number;
  carbon_emissions: {
    this_flight: number;
    typical_for_this_route: number;
    difference_percent: number;
  };
  price: number;
  type: string;
  airline_logo: string;
  booking_token: string;
};

/**
 * Fetch flights from your hosted backend
 */
async function fetchFlights(source: string, destination: string, date: string) {
  const backendUrl = `https://travel-companion-ai-api.onrender.com/api/flights?source=${source}&destination=${destination}&date=${date}`;

  try {
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("Error fetching flights from backend:", error);
    return [];
  }
}

/**
 * Generate travel itinerary using Gemini + flight info
 */
export async function generateTravelPlan(preferences: TravelPreferences) {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key missing");

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `Act as a travel planning expert.

Create a detailed travel itinerary based on the following preferences:

- **Departure City:** ${preferences.source}  
- **Destination City:** ${preferences.destination}  
- **Travel Dates:** ${preferences.startDate} to ${preferences.endDate}  
- **Budget:** ${preferences.budget}  
- **Number of Travelers:** ${preferences.travelers}  
- **Interests:** ${preferences.interests}  
${preferences.includeTransportation ? "- Include transportation (flight) options." : ""}

---

## 🗓️ Daily Itinerary with Timings

Provide a clear day-by-day schedule including specific activities and approximate times.

---

## 💰 Estimated Costs

Break down the expected costs for flights, accommodation, food, activities, transportation, and any other major expenses.

---

## 🏨 Recommended Accommodations

Suggest budget-friendly lodging options such as hostels, Airbnbs, or affordable hotels, including location tips.

---

## 📍 Must-Visit Places

List key attractions and experiences tailored to the traveler’s interests and budget.

---

## ✈️ Travel Tips

Include practical advice on local transport, safety, language, cultural customs, and money-saving tips.

${preferences.includeTransportation ? "## ✈️ Suggested Flight Options\n\nInclude flight options with prices and durations based on the user's departure city." : ""}
`;



  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let plan = response.text();

    // Append flight options if transportation is included
    if (preferences.includeTransportation) {
      const flights = await fetchFlights(
        preferences.source,
        preferences.destination,
        preferences.startDate
      );

      if (flights.length > 0) {
        plan += `\n\n## Available Flights\n`;
        flights.forEach((flight: BestFlight, index: number) => {
          plan += `\n### Option ${index + 1}\n`;
          plan += `- Airline: ${flight.flights[0]?.airline}\n`;
          plan += `- Flight Number: ${flight.flights[0]?.flight_number}\n`;
          plan += `- Price: $${flight.price}\n`;
          plan += `- Duration: ${flight.total_duration} minutes\n`;
          plan += `- Booking Token: ${flight.booking_token}\n`;
        });
      } else {
        plan += "\n\nNo flights found.";
      }
    }

    return plan;
  } catch (error) {
    console.error("Failed to generate travel plan:", error);
    throw new Error("Unable to generate travel plan.");
  }
}
