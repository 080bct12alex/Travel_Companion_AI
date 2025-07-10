import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function SettingsDialog() {
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem("GEMINI_API_KEY") || "");
  const [serpApiKey, setSerpApiKey] = useState(localStorage.getItem("SERPAPI_KEY") || "");
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem("GEMINI_API_KEY", geminiKey);
    localStorage.setItem("SERPAPI_KEY", serpApiKey);
    toast({
      title: "Settings saved",
      description: "Your API keys have been saved successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
     
    </Dialog>
  );
}