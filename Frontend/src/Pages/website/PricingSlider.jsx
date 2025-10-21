import { motion } from "framer-motion"

export default function PricingSlider({ minutes, setMinutes }) {
  const maxMinutes = 10000
  const step = 100

  const percent = (minutes / maxMinutes) * 100

  return (
    <div className="mb-16 relative max-w-2xl mx-auto w-full">
      Labels above track
      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>0</span>
        <span>500</span>
        <span>2000</span>
        <span>6000</span>
        <span>10000</span>
      </div>

      <div className="relative w-full">
        {/* Bubble above thumb */}
        <motion.div
          key={minutes}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: -30 }}
          transition={{ duration: 0.3 }}
          className="absolute -top-8 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded transform -translate-x-1/2"
          style={{
            left: `${percent}%`,
          }}
        >
          {minutes.toLocaleString()} mins
        </motion.div>

        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 h-2 w-full bg-gray-200 rounded-full" />

        {/* Filled track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-600 rounded-full"
          style={{ width: `${percent}%` }}
        />

        {/* Slider input */}
        <input
          type="range"
          min={0}
          max={maxMinutes}
          step={step}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="w-full appearance-none bg-transparent relative z-10 cursor-pointer"
        />

        {/* Custom thumb styles */}
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            height: 22px;
            width: 22px;
            border-radius: 9999px;
            background: #2563eb; /* Tailwind blue-600 */
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
            margin-top: -10px; /* align thumb with track */
          }
          input[type="range"]::-moz-range-thumb {
            height: 22px;
            width: 22px;
            border-radius: 9999px;
            background: #2563eb;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    </div>
  )
}
