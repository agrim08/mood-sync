import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Smile, BarChart2, ChevronLeft, ChevronRight, Calendar, Trash2 } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const moodColors = {
  Happy: "#fde047",
  Sad: "#60a5fa",
  Angry: "#f87171",
  Anxious: "#fb923c",
  Calm: "#4ade80",
};

const moodEmojis = {
  Happy: "😊",
  Sad: "😢",
  Angry: "😡",
  Anxious: "😰",
  Calm: "😌",
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((store: any) => store.user);
  const navigate = useNavigate();

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  useEffect(() => {
    fetchMoodData();
  }, [currentDate]);

  const fetchMoodData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/mood/get_all_mood`, { withCredentials: true });
      setMoodEntries(res.data.moods);
    } catch {
      toast.error("Failed to load mood entries");
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSubmit = async (
    date: Date,
    moodId: string | undefined,
    moodVal: string,
    journal: string
  ) => {
    if (!moodVal) {
      toast.error("Please select a mood");
      return;
    }
    try {
      if (moodId) {
        await axios.put(
          `${BASE_URL}/mood/edit_mood/${moodId}`,
          { mood: moodVal, journal },
          { withCredentials: true }
        );
        toast.success("Mood updated successfully");
      } else {
        await axios.post(
          `${BASE_URL}/mood/add_mood`,
          { mood: moodVal, journal, date, user: user?._id },
          { withCredentials: true }
        );
        toast.success("Mood logged successfully");
      }
      await fetchMoodData();
    } catch {
      toast.error("Failed to save mood entry");
    }
  };

  const handleDeleteMood = async (moodId: string) => {
    try {
      await axios.delete(`${BASE_URL}/mood/delete_mood/${moodId}`, { withCredentials: true });
      toast.success("Mood entry deleted");
      await fetchMoodData();
    } catch {
      toast.error("Failed to delete mood entry");
    }
  };

  const CalendarDay = ({ date }: { date: Date }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [localMood, setLocalMood] = useState("");
    const [localJournal, setLocalJournal] = useState("");

    const entry = moodEntries.find(
      (e: { date: string; mood: keyof typeof moodColors; _id: string; journal?: string }) =>
        isSameDay(new Date(e.date), date)
    );

    const isCurrentMonth = isSameMonth(date, currentDate);
    const isToday = isSameDay(date, new Date());
    const canModify = Boolean(entry) || isToday;

    useEffect(() => {
      if (isPopoverOpen) {
        setLocalMood(entry ? entry.mood : "");
        setLocalJournal(entry ? entry.journal || "" : "");
      }
    }, [isPopoverOpen, entry]);

    const getMoodStyle = () => {
      if (!entry) return {};
      const baseColor = moodColors[entry.mood as keyof typeof moodColors];
      return {
        backgroundColor: `${baseColor}25`,
        borderLeft: `4px solid ${baseColor}`,
        boxShadow: isToday ? `0 0 0 2px ${baseColor}` : 'none'
      };
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <motion.div
            whileHover={canModify ? { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } : {}}
            onClick={() => canModify && setIsPopoverOpen(true)}
            className={`relative aspect-square p-1 sm:p-2 text-sm border rounded-lg flex flex-col justify-between transition-all
              ${!isCurrentMonth ? "bg-gray-100 opacity-40" : ""}
              ${isToday ? "ring-2 ring-indigo-500 ring-opacity-60" : "border-gray-200"}
              ${!canModify ? "cursor-not-allowed" : "cursor-pointer"}`}
            style={getMoodStyle()}
          >
            {entry && (
              <Trash2
                className="absolute bottom-1 left-1 h-4 w-4 text-red-500 hover:text-red-600 opacity-80 hover:opacity-100 z-10"
                onClick={e => { e.stopPropagation(); handleDeleteMood(entry._id); }}
              />
            )}

            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold ${isToday ? "text-indigo-600" : "text-gray-700"}`}>{format(date, "d")}</span>
              {entry && (
                <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-lg sm:text-xl">
                  {moodEmojis[entry.mood as keyof typeof moodEmojis]}
                </motion.span>
              )}
            </div>
            {!entry && isCurrentMonth && (
              <div className={`w-full flex items-center justify-center ${isToday ? "opacity-0 hover:opacity-70 transition-opacity" : "opacity-50"}`}>
                <span className={`text-xs ${isToday ? "text-indigo-500" : "text-gray-400"} font-medium`}>Add</span>
              </div>
            )}
            {entry?.journal && (
              <p className="text-xs text-gray-600 mt-1 truncate line-clamp-1 sm:line-clamp-2 italic">"{entry.journal}"</p>
            )}
          </motion.div>
        </PopoverTrigger>

        <PopoverContent className="w-full max-w-xs sm:max-w-md p-0 overflow-hidden border border-indigo-100 shadow-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white">
            <h4 className="font-semibold text-base sm:text-lg">{format(date, "EEEE, MMMM d, yyyy")}</h4>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">How are you feeling today?</label>
              <Select value={localMood} onValueChange={setLocalMood}>
                <SelectTrigger className="w-full border-indigo-200 focus:ring-indigo-500">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <SelectItem key={mood} value={mood}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl" style={{ textShadow: `0 0 2px ${moodColors[mood as keyof typeof moodColors]}40` }}>{emoji}</span>
                        <span>{mood}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Journal entry (optional)</span>
                <span className="text-xs text-gray-400">{localJournal.length}/140</span>
              </label>
              <Input className="border-indigo-200 focus:ring-indigo-500" placeholder="How was your day?" value={localJournal} onChange={e => setLocalJournal(e.target.value)} maxLength={140} />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" onClick={() => { handleMoodSubmit(date, entry?._id, localMood, localJournal); setIsPopoverOpen(false); }}>
                <Smile className="mr-2 h-4 w-4" /> {entry ? "Update Entry" : "Save Mood"}
              </Button>
            </motion.div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-4 sm:py-6 px-3 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mood Sync Journal
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Track your emotional journey through time</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-xl mb-6 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
              
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 px-2">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 sm:p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.button>
            </div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-none text-sm py-2"
                onClick={() => navigate("/stats")}
              >
                <BarChart2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> View Stats
              </Button>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40 sm:h-60">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center text-xs sm:text-sm font-medium text-indigo-600 pb-1 border-b border-indigo-100"
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">              
                {daysInMonth.map((date) => (
                  <CalendarDay key={date.toISOString()} date={date} />
                ))}
              </div>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center text-gray-800">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-500" /> Mood Legend
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {Object.entries(moodEmojis).map(([mood, emoji]) => (
              <div 
                key={mood} 
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: `${moodColors[mood as keyof typeof moodColors]}20` }}
              >
                <span className="text-lg sm:text-xl">{emoji}</span>
                <span className="text-xs sm:text-sm font-medium">{mood}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}