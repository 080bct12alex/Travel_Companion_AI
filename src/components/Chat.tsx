import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  itinerary: string;
}

export function Chat({ itinerary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = async (userInput: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Please set your Gemini API key in the settings");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful travel assistant. The user has the following itinerary:

${itinerary}

Their question is: ${userInput}

Please provide a helpful, concise response focusing on the specific information they're asking about.
If they ask about activities, destinations, or timing, reference specific details from their itinerary.
Keep responses friendly but focused on the actual itinerary details.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border rounded-lg shadow-lg bg-black">
      <div className="p-4 border-b flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-travel-primary" />
        <h3 className="text-lg font-semibold text-travel-primary">
          Travel Companion AI Chat
        </h3>
      </div>
      <ScrollArea className="h-[300px] p-4">
  <div className="space-y-4">
    {messages.map((message, index) => {
      const isUser = message.role === "user";

      return (
        <div
          key={index}
          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`
              max-w-[80%]
              rounded-xl
              px-4 py-2
              text-sm
              whitespace-pre-wrap
              break-words
              ${
                isUser
                  ? "bg-travel-primary text-blue-900"
                  : "bg-blue-900 text-white"
              }
            `}
          >
            {message.content}
          </div>
        </div>
      );
    })}
  </div>
</ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question ..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
