import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type MoodLevel = 1 | 2 | 3 | 4 | 5;

interface MoodEntry {
  mood: MoodLevel;
  notes: string;
  timestamp: Date;
}

interface MoodCheckInProps {
  onMoodSubmit: (entry: MoodEntry) => void;
}

const moodOptions = [
  { level: 1 as MoodLevel, emoji: "😢", label: "Terrible", color: "bg-red-500 hover:bg-red-600 text-white" },
  { level: 2 as MoodLevel, emoji: "😞", label: "Poor", color: "bg-orange-500 hover:bg-orange-600 text-white" },
  { level: 3 as MoodLevel, emoji: "😐", label: "Okay", color: "bg-yellow-500 hover:bg-yellow-600 text-white" },
  { level: 4 as MoodLevel, emoji: "😊", label: "Good", color: "bg-green-500 hover:bg-green-600 text-white" },
  { level: 5 as MoodLevel, emoji: "😄", label: "Excellent", color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
];

export default function MoodCheckIn({ onMoodSubmit }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today to continue.",
        variant: "destructive",
      });
      return;
    }

    const entry: MoodEntry = {
      mood: selectedMood,
      notes,
      timestamp: new Date(),
    };

    onMoodSubmit(entry);
    
    toast({
      title: "Mood recorded!",
      description: "Thank you for checking in. Keep taking care of yourself.",
    });

    // Reset form
    setSelectedMood(null);
    setNotes("");
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl text-white">
          <Zap className="h-6 w-6 text-white" />
          Daily Check-In
        </CardTitle>
        <CardDescription className="text-white/80">
          How are you feeling today? Your mental health matters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3 text-center text-white">Select your mood</h3>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => {
              return (
                <Button
                  key={option.level}
                  variant="outline"
                  size="sm"
                  className={`h-16 flex-col gap-1 border-2 transition-all duration-200 ${
                    selectedMood === option.level 
                      ? option.color + " border-white/50 scale-110" 
                      : "bg-white/10 hover:bg-white/20 border-white/30 text-white hover:scale-105"
                  }`}
                  onClick={() => setSelectedMood(option.level)}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-xs">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2 text-white">Notes (optional)</h3>
          <Textarea
            placeholder="Share what's on your mind..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-none bg-white/10 border-white/30 text-white placeholder:text-white/60"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
          size="lg"
        >
          Submit Check-In
        </Button>
      </CardContent>
    </Card>
  );
}