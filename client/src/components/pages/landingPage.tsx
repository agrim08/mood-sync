
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Smile, BarChart2, Lock, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-white to-blue-100/80 -z-10" />
        <div className="container mx-auto px-4 md:px-6 relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">
                Track · Visualize · Understand
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-amber-500 via-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Sync with your <br className="hidden sm:block" />
              emotional journey
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto md:mx-0"
            >
              Empower your emotional well-being through intuitive tracking, beautiful visualization, and meaningful insights for a healthier mind.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start"
            >
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 border-0 text-white px-6" asChild>
                <Link to="/login">
                  Get Started
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300" asChild>
                <Link to="#features">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="flex-1 mt-8 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-yellow-200 via-purple-200 to-blue-200 p-4 shadow-xl">
                <div className="bg-white/90 backdrop-blur-sm h-full w-full rounded-xl flex flex-col p-4 overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-800">Your Mood Journal</span>
                    <span className="text-sm text-gray-500">April 2025</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                      <div key={i} className="text-gray-500">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const colorMap = [
                        "bg-amber-100", "bg-amber-200", "bg-blue-100", 
                        "bg-purple-100", "bg-red-100", "bg-green-100", 
                        "bg-amber-200", "bg-blue-100", "bg-purple-100"
                      ];
                      const color = i % 10 === 0 ? "bg-white" : colorMap[i % colorMap.length];
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-full flex items-center justify-center text-xs ${color} ${i % 10 === 0 ? '' : 'shadow-sm'}`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 size-24 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 blur-xl opacity-60 -z-10"></div>
              <div className="absolute -top-6 -left-6 size-24 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 blur-xl opacity-60 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
            >
              Your emotional well-being matters
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed text-gray-700"
            >
              In today's fast-paced world, it's easy to lose track of how we really feel. MoodSync allows you to 
              log your emotional state through an intuitive, color-coded calendar interface. By visualizing emotional
              patterns over time, you gain valuable insights into your mental well-being and discover what truly
              influences your happiness and peace of mind.
            </motion.p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="size-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-500 mb-5">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Daily</h3>
              <p className="text-gray-600">Record your emotions and thoughts each day with a simple, quick interface designed for consistency.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="size-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-500 mb-5">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visualize Trends</h3>
              <p className="text-gray-600">See your emotional journey unfold through beautiful, color-coded visualizations that reveal patterns over time.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="size-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-5">
                <Smile size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gain Insights</h3>
              <p className="text-gray-600">Understand what influences your mood and develop strategies to improve your overall emotional well-being.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Thoughtfully crafted features
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              MoodSync combines intuitive design with powerful functionality to help you track, understand, and improve your emotional well-being.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative group"
            >
              <div className="absolute -right-10 -top-10 size-24 rounded-full bg-amber-100 group-hover:bg-amber-200 transition-colors"></div>
              <div className="relative">
                <h3 className="text-xl font-semibold mb-3">Interactive Calendar UI</h3>
                <p className="text-gray-600 mb-6">
                  Visualize your moods with a dynamic, color-coded calendar. Click on any day to see detailed journal entries and mood trends.
                </p>
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-7 gap-1 max-w-xs w-full">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const colors = [
                        "bg-amber-200", "bg-green-100", "bg-purple-100", 
                        "bg-blue-100", "bg-red-100", "bg-amber-100"
                      ];
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-md ${colors[i % colors.length]} flex items-center justify-center text-xs shadow-sm`}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative group"
            >
              <div className="absolute -right-10 -top-10 size-24 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors"></div>
              <div className="relative">
                <h3 className="text-xl font-semibold mb-3">Daily Mood Logging</h3>
                <p className="text-gray-600 mb-6">
                  Easily select your mood from a range of emojis or tags such as Happy, Sad, Angry, Anxious, and Calm. Add a short journal note to reflect on your day.
                </p>
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center gap-3 max-w-xs w-full">
                    <div className="size-10 rounded-full bg-amber-200 flex items-center justify-center text-lg">😊</div>
                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">😌</div>
                    <div className="size-10 rounded-full bg-red-100 flex items-center justify-center text-lg">😠</div>
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">😰</div>
                    <div className="size-10 rounded-full bg-green-100 flex items-center justify-center text-lg">😌</div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative group"
            >
              <div className="absolute -right-10 -top-10 size-24 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors"></div>
              <div className="relative">
                <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
                <p className="text-gray-600 mb-6">
                  Your data is safe. Experience a secure platform with JWT based authentication to protect your personal journal entries and emotional data.
                </p>
                <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Lock size={20} className="text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">Encrypted & Secure</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/90 via-purple-500/90 to-blue-600/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,theme(colors.white/20),transparent_50%)]"></div>
            
            <div className="relative py-16 px-4 sm:px-16 text-center">
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-bold text-white mb-6"
              >
                Start your emotional wellness journey today
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-white/90 mb-8 max-w-xl mx-auto"
              >
                Join thousands of users who have transformed their relationship with their emotions through consistent tracking and mindful reflection.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 px-8" asChild>
                  <Link to="/login">
                    Get Started — It's Free
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-lg font-semibold bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 md:mb-0">
              MoodSync
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MoodSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
