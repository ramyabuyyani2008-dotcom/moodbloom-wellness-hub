import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MoodEntry {
  mood: number;
  timestamp: Date;
  notes?: string;
}

interface MoodChartProps {
  moodData: MoodEntry[];
}

export default function MoodChart({ moodData }: MoodChartProps) {
  // Get last 30 days of data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date;
  });

  const chartData = last30Days.map(date => {
    const dayEntry = moodData.find(entry => 
      entry.timestamp.toDateString() === date.toDateString()
    );
    return dayEntry ? dayEntry.mood : null;
  });

  const labels = last30Days.map(date => 
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Mood Level',
        data: chartData,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(var(--primary))',
        pointBorderColor: 'hsl(var(--background))',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const moodLabels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
            return `Mood: ${moodLabels[context.parsed.y] || 'No data'}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          maxTicksLimit: 8,
        },
      },
      y: {
        min: 1,
        max: 5,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          stepSize: 1,
          callback: function(value: any) {
            const moodLabels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
            return moodLabels[value] || '';
          }
        },
      },
    },
  };

  const averageMood = moodData.length > 0 
    ? (moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length).toFixed(1)
    : 0;

  const trend = moodData.length > 1 
    ? moodData[moodData.length - 1].mood - moodData[0].mood 
    : 0;

  return (
    <Card className="bg-gradient-to-br from-card to-wellness-calm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Mood Trends
        </CardTitle>
        <CardDescription>
          Your mood patterns over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-wellness-calm/50">
            <div className="text-2xl font-bold text-primary">{averageMood}</div>
            <div className="text-sm text-muted-foreground">Average Mood</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-wellness-calm/50">
            <div className={`text-2xl font-bold ${trend >= 0 ? 'text-mood-good' : 'text-mood-poor'}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Trend</div>
          </div>
        </div>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}