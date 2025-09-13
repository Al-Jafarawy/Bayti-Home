export default function SpinnerOverlay() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-teal-50 text-gray-700 z-50">
      {/* Spinner Circle */}
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-6 shadow-lg"></div>

      {/* Animated Text */}
      <p className="text-lg font-semibold text-teal-600 mb-4">
        Loading your dream home...
      </p>

      {/* Sliding Pulsing Dots */}
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-teal-400 rounded-full animate-slidePulse"></span>
        <span className="w-3 h-3 bg-teal-500 rounded-full animate-slidePulse delay-150"></span>
        <span className="w-3 h-3 bg-teal-600 rounded-full animate-slidePulse delay-300"></span>
      </div>
    </div>
  );
}
