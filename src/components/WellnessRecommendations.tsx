import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Zap, Users, Calendar, ExternalLink } from "lucide-react";

interface MoodEntry {
  mood: number;
  timestamp: Date;
  notes?: string;
}

interface WellnessRecommendationsProps {
  moodData: MoodEntry[];
  currentMood?: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'mindfulness' | 'exercise' | 'social' | 'sleep' | 'nutrition';
  priority: 'high' | 'medium' | 'low';
  icon: any;
  action?: string;
  duration?: string;
}

export default function WellnessRecommendations({ moodData, currentMood }: WellnessRecommendationsProps) {
  const getRecommendations = (): Recommendation[] => {
    const averageMood = moodData.length > 0 
      ? moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length 
      : 3;

    const recentMood = currentMood || (moodData.length > 0 ? moodData[moodData.length - 1].mood : 3);

    const baseRecommendations: Recommendation[] = [
      {
        id: '1',
        title: '5-Minute Breathing Exercise',
        description: 'Simple breathing technique to reduce stress and anxiety',
        category: 'mindfulness',
        priority: 'high',
        icon: Brain,
        action: 'Start Session',
        duration: '5 min'
      },
      {
        id: '2',
        title: 'Daily Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for today',
        category: 'mindfulness',
        priority: 'medium',
        icon: Heart,
        action: 'Begin Writing',
        duration: '3 min'
      },
      {
        id: '3',
        title: '10-Minute Walk',
        description: 'Get some fresh air and light exercise',
        category: 'exercise',
        priority: 'medium',
        icon: Zap,
        action: 'Track Walk',
        duration: '10 min'
      },
      {
        id: '4',
        title: 'Connect with a Friend',
        description: 'Reach out to someone you care about',
        category: 'social',
        priority: 'low',
        icon: Users,
        action: 'Send Message',
        duration: '15 min'
      }
    ];

    // Adjust recommendations based on mood
    if (recentMood <= 2) {
      baseRecommendations.unshift({
        id: 'crisis',
        title: 'Immediate Support',
        description: 'Consider speaking with a mental health professional',
        category: 'mindfulness',
        priority: 'high',
        icon: Heart,
        action: 'Find Help'
      });
    } else if (recentMood === 3 && averageMood < 3) {
      baseRecommendations.unshift({
        id: 'boost',
        title: 'Mood Booster Activities',
        description: 'Try activities that typically make you feel better',
        category: 'exercise',
        priority: 'high',
        icon: Zap,
        action: 'Explore Ideas',
        duration: '20 min'
      });
    }

    return baseRecommendations.slice(0, 4);
  };

  const recommendations = getRecommendations();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mindfulness': return 'bg-wellness-calm';
      case 'exercise': return 'bg-wellness-energy';
      case 'social': return 'bg-wellness-balance';
      case 'sleep': return 'bg-wellness-focus';
      case 'nutrition': return 'bg-mood-good';
      default: return 'bg-secondary';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-wellness-calm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Activities tailored to your current mood and patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const IconComponent = rec.icon;
            return (
              <div
                key={rec.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:shadow-md transition-all duration-200"
              >
                <div className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}>
                  <IconComponent className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{rec.title}</h3>
                    <div className="flex items-center gap-2">
                      {rec.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {rec.duration}
                        </Badge>
                      )}
                      <Badge variant={getPriorityVariant(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                  {rec.action && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2 hover:bg-primary hover:text-primary-foreground"
                    >
                      {rec.action}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}