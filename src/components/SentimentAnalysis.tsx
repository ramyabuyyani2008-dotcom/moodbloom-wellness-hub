import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface MoodEntry {
  mood: number;
  timestamp: Date;
  notes?: string;
}

interface SentimentAnalysisProps {
  moodData: MoodEntry[];
}

interface SentimentInsight {
  type: 'positive' | 'neutral' | 'negative' | 'warning';
  title: string;
  description: string;
  confidence: number;
}

export default function SentimentAnalysis({ moodData }: SentimentAnalysisProps) {
  const analyzeSentiment = (): SentimentInsight[] => {
    if (moodData.length === 0) {
      return [{
        type: 'neutral',
        title: 'No Data Yet',
        description: 'Start tracking your mood to see insights here.',
        confidence: 0
      }];
    }

    const insights: SentimentInsight[] = [];
    
    // Calculate recent trend (last 7 days)
    const recentEntries = moodData.slice(-7);
    const recentAverage = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    
    // Calculate overall trend
    const overallAverage = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
    
    // Consistency analysis
    const moodVariance = moodData.reduce((sum, entry) => 
      sum + Math.pow(entry.mood - overallAverage, 2), 0) / moodData.length;
    const consistency = Math.max(0, 100 - (moodVariance * 25));

    // Recent trend insight
    if (recentAverage > overallAverage + 0.5) {
      insights.push({
        type: 'positive',
        title: 'Improving Trend',
        description: 'Your mood has been trending upward over the past week.',
        confidence: Math.min(95, (recentAverage - overallAverage) * 30 + 70)
      });
    } else if (recentAverage < overallAverage - 0.5) {
      insights.push({
        type: 'warning',
        title: 'Declining Trend',
        description: 'Your mood has been lower lately. Consider reaching out for support.',
        confidence: Math.min(95, (overallAverage - recentAverage) * 30 + 70)
      });
    }

    // Consistency insight
    if (consistency > 70) {
      insights.push({
        type: 'positive',
        title: 'Stable Patterns',
        description: 'Your mood has been relatively consistent, which is a good sign.',
        confidence: consistency
      });
    } else if (consistency < 30) {
      insights.push({
        type: 'warning',
        title: 'High Variability',
        description: 'Your mood varies significantly. Consider tracking triggers.',
        confidence: 100 - consistency
      });
    }

    // Overall wellness insight
    if (overallAverage >= 4) {
      insights.push({
        type: 'positive',
        title: 'Strong Wellbeing',
        description: 'You\'re maintaining good mental health overall.',
        confidence: overallAverage * 20
      });
    } else if (overallAverage <= 2.5) {
      insights.push({
        type: 'negative',
        title: 'Concerning Pattern',
        description: 'Your overall mood levels suggest you might benefit from professional support.',
        confidence: (3 - overallAverage) * 40 + 60
      });
    }

    // Note analysis (simple keyword detection)
    const notesWithText = moodData.filter(entry => entry.notes && entry.notes.trim().length > 0);
    if (notesWithText.length > 0) {
      const allNotes = notesWithText.map(entry => entry.notes?.toLowerCase() || '').join(' ');
      
      const positiveWords = ['happy', 'good', 'great', 'excited', 'grateful', 'thankful', 'awesome', 'amazing', 'wonderful', 'fantastic'];
      const negativeWords = ['sad', 'tired', 'stressed', 'anxious', 'worried', 'frustrated', 'angry', 'depressed', 'overwhelmed', 'exhausted'];
      
      const positiveCount = positiveWords.filter(word => allNotes.includes(word)).length;
      const negativeCount = negativeWords.filter(word => allNotes.includes(word)).length;
      
      if (positiveCount > negativeCount * 2) {
        insights.push({
          type: 'positive',
          title: 'Positive Language',
          description: 'Your notes frequently contain positive expressions.',
          confidence: Math.min(90, (positiveCount / notesWithText.length) * 100)
        });
      } else if (negativeCount > positiveCount * 2) {
        insights.push({
          type: 'warning',
          title: 'Negative Patterns',
          description: 'Your notes often mention stress or negative feelings.',
          confidence: Math.min(90, (negativeCount / notesWithText.length) * 100)
        });
      }
    }

    return insights.slice(0, 3);
  };

  const insights = analyzeSentiment();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'negative': return AlertCircle;
      case 'warning': return AlertCircle;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-mood-good';
      case 'negative': return 'text-mood-terrible';
      case 'warning': return 'text-mood-poor';
      default: return 'text-muted-foreground';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-wellness-focus border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <CardDescription>
          Sentiment analysis based on your mood patterns and notes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-background/50 border border-border/50"
              >
                <div className={`p-2 rounded-lg bg-wellness-calm/30`}>
                  <IconComponent className={`h-5 w-5 ${getInsightColor(insight.type)}`} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{insight.title}</h3>
                    <Badge variant={getBadgeVariant(insight.type)}>
                      {Math.round(insight.confidence)}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Confidence Level</span>
                      <span>{Math.round(insight.confidence)}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {insights.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>More insights will appear as you track your mood regularly.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}