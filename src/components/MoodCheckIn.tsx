import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Frown, Meh, Heart, Zap } from "lucide-react";
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
  { level: 1 as MoodLevel, icon: Frown, label: "Terrible", color: "bg-mood-terrible" },
  { level: 2 as MoodLevel, icon: Frown, label: "Poor", color: "bg-mood-poor" },
  { level: 3 as MoodLevel, icon: Meh, label: "Okay", color: "bg-mood-okay" },
  { level: 4 as MoodLevel, icon: Smile, label: "Good", color: "bg-mood-good" },
  { level: 5 as MoodLevel, icon: Heart, label: "Excellent", color: "bg-mood-excellent" },
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
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-card to-wellness-calm border-0 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Zap className="h-6 w-6 text-primary" />
          Daily Check-In
        </CardTitle>
        <CardDescription>
          How are you feeling today? Your mental health matters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3 text-center">Select your mood</h3>
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Button
                  key={option.level}
                  variant={selectedMood === option.level ? "default" : "outline"}
                  size="sm"
                  className={`h-16 flex-col gap-1 ${
                    selectedMood === option.level ? option.color : "hover:bg-accent"
                  } transition-all duration-200`}
                  onClick={() => setSelectedMood(option.level)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Notes (optional)</h3>
          <Textarea
            placeholder="Share what's on your mind..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Submit Check-In
        </Button>
      </CardContent>
    </Card>
  );
}