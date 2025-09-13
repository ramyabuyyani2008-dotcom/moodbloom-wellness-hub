import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MoodCheckIn from "./MoodCheckIn";
import MoodChart from "./MoodChart";
import WellnessRecommendations from "./WellnessRecommendations";
import SentimentAnalysis from "./SentimentAnalysis";
import { Heart, Calendar, TrendingUp, Brain, Plus } from "lucide-react";

interface MoodEntry {
  mood: number;
  notes: string;
  timestamp: Date;
}

export default function Dashboard() {
  const [moodData, setMoodData] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('mood-data');
    if (saved) {
      return JSON.parse(saved).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    return [];
  });
  
  const [showCheckIn, setShowCheckIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('mood-data', JSON.stringify(moodData));
  }, [moodData]);

  const handleMoodSubmit = (entry: MoodEntry) => {
    setMoodData(prev => [...prev, entry]);
    setShowCheckIn(false);
  };

  const getTodaysEntry = () => {
    const today = new Date().toDateString();
    return moodData.find(entry => entry.timestamp.toDateString() === today);
  };

  const getStreakCount = () => {
    let streak = 0;
    const sortedEntries = [...moodData].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].timestamp);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (entryDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const todaysEntry = getTodaysEntry();
  const streakCount = getStreakCount();
  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1)
    : '0';

  const getMoodLabel = (mood: number) => {
    const labels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
    return labels[mood] || 'Unknown';
  };

  if (showCheckIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wellness-calm/20 to-wellness-focus/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => setShowCheckIn(false)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <MoodCheckIn onMoodSubmit={handleMoodSubmit} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wellness-calm/20 to-wellness-focus/10">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Mental Wellness Hub
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your personal space for mood tracking, wellness insights, and mental health support
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-card to-wellness-calm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Mood</p>
                  <p className="text-2xl font-bold">
                    {todaysEntry ? getMoodLabel(todaysEntry.mood) : 'Not checked'}
                  </p>
                </div>
                <Heart className={`h-8 w-8 ${todaysEntry ? 'text-primary' : 'text-muted-foreground/30'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-wellness-energy border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Check-in Streak</p>
                  <p className="text-2xl font-bold">{streakCount} days</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-wellness-balance border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                  <p className="text-2xl font-bold">{averageMood}/5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Check-in Button */}
        {!todaysEntry && (
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Ready for your daily check-in?</h3>
                  <p className="text-muted-foreground">Take a moment to reflect on how you're feeling today.</p>
                </div>
                <Button 
                  onClick={() => setShowCheckIn(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Check In Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="wellness" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wellness
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MoodChart moodData={moodData} />
              <WellnessRecommendations 
                moodData={moodData} 
                currentMood={todaysEntry?.mood} 
              />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <MoodChart moodData={moodData} />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <WellnessRecommendations 
              moodData={moodData} 
              currentMood={todaysEntry?.mood} 
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SentimentAnalysis moodData={moodData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}