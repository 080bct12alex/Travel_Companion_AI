import { useState } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelItinerary } from "@/components/TravelItinerary";
import { generateTravelPlan, TravelPreferences } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { SettingsDialog } from "@/components/SettingsDialog";

const Index = () => {
  const [itinerary, setItinerary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (preferences: TravelPreferences) => {
    setIsLoading(true);
    try {
      const plan = await generateTravelPlan(preferences);
      setItinerary(plan);
      toast({
        title: "Success!",
        description: "Your travel plan has been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-secondary/10 to-travel-accent/10">
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-travel-primary">
              Travel Companion AI
            </h1>
            <SettingsDialog />
          </div>
          <p className="text-center text-gray-300 mb-8">
            Let Travel Companion AI help you plan your perfect trip
          </p>
          <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          <TravelItinerary itinerary={itinerary} />
        </div>
      </div>
    </div>
  );
};

export default Index;
