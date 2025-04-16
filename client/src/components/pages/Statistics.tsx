
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  Legend,
  
} from 'recharts';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calendar, BarChart2, PieChart as PieChartIcon, Info } from 'lucide-react';
import { BASE_URL } from '@/lib/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MoodSummary {
  _id: {
    year: number;
    month?: number;
    week?: number;
  };
  moods: {
    mood: string;
    count: number;
  }[];
}

interface DailyMood {
  date: string;
  mood: string;
  journal?: string;
}

interface MoodStats {
  totalEntries: number;
  mostFrequentMood: string;
  mostFrequentCount: number;
  percentages: Record<string, number>;
}

interface ChartDataItem {
  period: string;
  periodLabel: string;
  raw: MoodSummary;
  [key: string]: any;
}

interface PieDataItem {
  mood: string;
  value: number;
  count: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface MoodColor {
  color: string;
  emoji: string;
  gradient?: string;
}

const moodColors: Record<string, MoodColor> = {
  Happy: { 
    color: '#FFD700', 
    emoji: '😀',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffeb99 100%)'
  },
  Sad: { 
    color: '#1E90FF', 
    emoji: '😢',
    gradient: 'linear-gradient(135deg, #1E90FF 0%, #6ab7ff 100%)'
  },
  Angry: { 
    color: '#FF4500', 
    emoji: '😠',
    gradient: 'linear-gradient(135deg, #FF4500 0%, #ff7b4d 100%)'
  },
  Anxious: { 
    color: '#FF8C00', 
    emoji: '😰',
    gradient: 'linear-gradient(135deg, #FF8C00 0%, #ffb74d 100%)'
  },
  Calm: { 
    color: '#32CD32', 
    emoji: '😌',
    gradient: 'linear-gradient(135deg, #32CD32 0%, #7adb7a 100%)'
  },
};

const getDateOfISOWeek = (week: number, year: number): string => {
  const simple = new Date(year, 0, 4);
  const dayOfWeek = simple.getDay() || 7;
  const diff = (week - 1) * 7 - (dayOfWeek - 1);
  const monday = new Date(year, 0, 4 + diff);
  return monday.toISOString().split('T')[0];
};

// const dateFormatter = (date: string): string => {
//   return new Date(date).toLocaleDateString('en-US', { 
//     month: 'short', 
//     day: 'numeric',
//     year: 'numeric'
//   });
// };

export const Statistics: React.FC = () => {
  const [monthlySummary, setMonthlySummary] = useState<MoodSummary[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<MoodSummary[]>([]);
  const [dailyMoods, setDailyMoods] = useState<DailyMood[]>([]);
  const [view, setView] = useState<'monthly' | 'weekly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const endpoint =
          view === 'monthly' ? `${BASE_URL}/mood/summary` : `${BASE_URL}/mood/summary/weekly`;
        const { data } = await axios.get(endpoint, { withCredentials: true });
        
        if (view === 'monthly') {
          setMonthlySummary(data.summary);
        } else {
          setWeeklySummary(data.weeklySummary);
        }

        setDailyMoods([]);
        setSelectedPeriod(null);
      } catch (error) {
        console.error('Error fetching summary data:', error);
        toast.error('Failed to load mood summary data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [view]);


  console.log(loading,selectedPeriod )

  const chartData: ChartDataItem[] = useMemo(() => {
    const dataSource = view === 'monthly' ? monthlySummary : weeklySummary;
    return dataSource.map((item) => {
      const label =
        view === 'monthly'
          ? `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
          : `W${item._id.week}, ${item._id.year}`;
      const moodCounts: Record<string, number> = {};
      
      item.moods.forEach((entry) => {
        moodCounts[entry.mood] = entry.count;
      });
      
      return {
        period: label,
        periodLabel: view === 'monthly'
          ? new Date(item._id.year, (item._id.month || 1) - 1).toLocaleString('default', { month: 'short', year: 'numeric' })
          : `Week ${item._id.week}, ${item._id.year}`,
        raw: item,
        ...moodCounts,
      };
    });
  }, [view, monthlySummary, weeklySummary]);

  useEffect(() => {
    if (chartData.length > 0) {
      const overallCounts = chartData.reduce((acc, cur) => {
        Object.keys(moodColors).forEach((mood) => {
          acc[mood] = (acc[mood] || 0) + (cur[mood] || 0);
        });
        return acc;
      }, {} as Record<string, number>);

      const totalEntries = Object.values(overallCounts).reduce((sum, count) => sum + count, 0);
      
      const mostFrequentMood = Object.entries(overallCounts)
        .sort((a, b) => b[1] - a[1])[0];
      
      const percentages: Record<string, number> = {};
      Object.entries(overallCounts).forEach(([mood, count]) => {
        percentages[mood] = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
      });

      setStats({
        totalEntries,
        mostFrequentMood: mostFrequentMood ? mostFrequentMood[0] : 'None',
        mostFrequentCount: mostFrequentMood ? mostFrequentMood[1] : 0,
        percentages,
      });
    }
  }, [chartData]);

  const pieData: PieDataItem[] = useMemo(() => 
    stats ? Object.entries(stats.percentages).map(([mood, percentage]) => ({
      mood,
      value: percentage,
      count: Math.round((percentage * stats.totalEntries) / 100)
    })) : []
  , [stats]);

  const handleChartClick = async (item: MoodSummary) => {
    let dateStr = '';
    let displayPeriod = '';
    
    if (view === 'monthly' && item._id.month) {
      dateStr = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-01`;
      displayPeriod = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    } else if (view === 'weekly' && item._id.week) {
      dateStr = getDateOfISOWeek(item._id.week, item._id.year);
      displayPeriod = `Week ${item._id.week}, ${item._id.year}`;
    }
    
    setLoading(true);
    
    try {
      const { data } = await axios.get(`${BASE_URL}/mood/get_mood/${dateStr}`, { withCredentials: true });
      setDailyMoods(data.moods);
      setSelectedPeriod(displayPeriod);
    } catch (error) {
      console.error('Error fetching daily moods:', error);
      toast.error('Failed to load daily mood details');
    } finally {
      setLoading(false);
    }
  };

  const handlePieClick = async (entry: any) => {
    if (!entry || !entry.mood) return;
    
    const today = new Date().toISOString().split('T')[0];
    setLoading(true);
    
    try {
      const { data } = await axios.get(`${BASE_URL}/mood/get_mood/${today}`, { withCredentials: true });
      const filteredMoods = data.moods.filter((item: DailyMood) => item.mood === entry.mood);
      setDailyMoods(filteredMoods);
      setSelectedPeriod(`${entry.mood} entries`);
    } catch (error) {
      console.error('Error fetching daily moods:', error);
      toast.error('Failed to load mood details');
    } finally {
      setLoading(false);
    }
  };

  const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-white p-4 border rounded-md shadow-lg">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-sm text-gray-600">{entry.dataKey}</span>
              </div>
              <span className="font-medium text-gray-800">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CustomPieTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0];
    return (
      <div className="bg-white p-4 border rounded-md shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{moodColors[data.name].emoji}</span>
          <span className="font-semibold text-gray-700">{data.name}</span>
        </div>
        <div className="mt-2">
          <p className="text-sm">Count: <span className="font-medium">{data.value}</span></p>
          <p className="text-sm">Percentage: <span className="font-medium">
            {((data.value / pieData.reduce((sum, entry) => sum + entry.count, 0)) * 100).toFixed(1)}%
          </span></p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center">
            <Link to="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                <span>Dashboard</span>
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl md:text-3xl font-bold text-gray-800">Mood Insights</h1>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              variant={view === 'monthly' ? 'default' : 'outline'}
              className={view === 'monthly' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              onClick={() => {
                setDailyMoods([]);
                setView('monthly');
              }}
            >
              <Calendar size={16} className="mr-2" />
              Monthly
            </Button>
            <Button
              variant={view === 'weekly' ? 'default' : 'outline'}
              className={view === 'weekly' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              onClick={() => {
                setDailyMoods([]);
                setView('weekly');
              }}
            >
              <Calendar size={16} className="mr-2" />
              Weekly
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-md bg-white/95 backdrop-blur overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BarChart2 size={20} />
                    {view.charAt(0).toUpperCase() + view.slice(1)} Mood Distribution
                  </CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 bg-white/20 border-white/40 hover:bg-white/30 text-white">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Bar Chart Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          This chart shows your mood distribution by {view} period. 
                          Click on any bar to see detailed daily entries for that period.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <CardDescription className="text-blue-100">
                  Click on any bar to see detailed daily entries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    onClick={(e: any) => {
                      if (e?.activePayload?.[0]?.payload?.raw) {
                        handleChartClick(e.activePayload[0].payload.raw);
                      }
                    }}
                  >
                    <XAxis 
                      dataKey="period" 
                      stroke="#64748b"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend 
                      formatter={(value) => (
                        <span className="flex items-center gap-1">
                          <span>{moodColors[value].emoji}</span>
                          <span>{value}</span>
                        </span>
                      )}
                    />
                    {Object.keys(moodColors).map((mood) => (
                      <Bar 
                        key={mood} 
                        dataKey={mood} 
                        fill={moodColors[mood].color} 
                        animationDuration={800}
                        barSize={30}
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList 
                          dataKey={mood} 
                          position="top" 
                          fill="#333" 
                          formatter={(value: number) => value || ''}
                        />
                      </Bar>
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-md bg-white/95 backdrop-blur overflow-hidden h-full">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <PieChartIcon size={20} />
                    Overall Mood Distribution
                  </CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 bg-white/20 border-white/40 hover:bg-white/30 text-white">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Pie Chart Guide</h4>
                        <p className="text-sm text-muted-foreground">
                          This chart shows your overall mood distribution across all entries. 
                          Click on any segment to filter entries with that specific mood.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <CardDescription className="text-blue-100">
                  Click on any segment to filter by mood
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="count"
                      nameKey="mood"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      animationDuration={800}
                      onClick={handlePieClick}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={moodColors[entry.mood].color} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                      <LabelList 
                        dataKey="mood" 
                        position="outside" 
                        formatter={(mood: string) => moodColors[mood]?.emoji || ''}
                        style={{ fontSize: 24 }}
                      />
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                        formatter={(entry) => {
                          if (!entry || !entry.payload || !entry.payload.mood) {
                            return <span>Unknown</span>;
                          }
                          
                          const { mood, count } = entry.payload;
                          return (
                            <span className="flex items-center gap-2">
                              <span>{moodColors[mood]?.emoji || '❓'}</span>
                              <span className="text-sm">{mood} ({count} entries)</span>
                            </span>
                          );
                        }}
                      />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {dailyMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-md bg-white/95 backdrop-blur mb-6">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="text-xl font-bold">
                    Daily Entries
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-white/20 border-white/40 hover:bg-white/30 text-white"
                    onClick={() => setDailyMoods([])}
                  >
                    Clear Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {dailyMoods.map((entry, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 sm:p-6 hover:bg-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ background: moodColors[entry.mood]?.gradient || '#f3f4f6' }}
                          >
                            {moodColors[entry.mood]?.emoji || '❓'}
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">{entry.mood}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        {entry.journal && (
                          <div className="bg-gray-100 rounded-lg p-3 w-full sm:w-auto flex-1">
                            <p className="text-gray-700 italic">{entry.journal}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
