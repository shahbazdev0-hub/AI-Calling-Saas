// src/Components/PricingFull.jsx
import React, { useState, useMemo } from "react"
import TierCard from "./TierCard"
import { motion } from "framer-motion"

const BASE_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 29,
    minutesIncluded: 50,
    priceIdMonthly: 'price_stub_starter_monthly', // replace on server
    priceIdYearly: 'price_stub_starter_yearly',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 149,
    minutesIncluded: 2000,
    priceIdMonthly: 'price_stub_pro_monthly',
    priceIdYearly: 'price_stub_pro_yearly',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 1250,
    minutesIncluded: 6000,
    priceIdMonthly: 'price_stub_enterprise_monthly',
    priceIdYearly: 'price_stub_enterprise_yearly',
  },
]

// Overage rate for front-end simulation only
const OVERTIME_RATE_PER_MIN = 0.08

export default function PricingFull() {
  const [billing, setBilling] = useState('monthly') // 'monthly' | 'yearly'
  const [minutes, setMinutes] = useState(1000)

  const computePrice = (tier) => {
    const extraMinutes = Math.max(0, minutes - tier.minutesIncluded)
    const overage = extraMinutes * OVERTIME_RATE_PER_MIN
    let price = tier.monthlyPrice + overage
    if (billing === 'yearly') {
      price = price * 12 * 0.8 // apply 20% yearly discount (example)
      price = price / 12 // show per-month equivalent
    }
    return Math.round(price)
  }

  return (
    <section aria-labelledby="pricing-heading" className="w-full">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 id="pricing-heading" className="text-2xl font-semibold">
              Pricing That Scales With You
            </h2>
            <p className="text-sm text-slate-600 mt-1">Choose monthly or yearly billing (frontend demo).</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Monthly</div>
            <div className="bg-slate-100 p-1 rounded-full flex items-center">
              <button
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
                className={`px-3 py-1 rounded-full ${billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}
              >
                Monthly
              </button>
              <button
                aria-pressed={billing === 'yearly'}
                onClick={() => setBilling('yearly')}
                className={`px-3 py-1 rounded-full ${billing === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}
              >
                Yearly (save 20%)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="minutes" className="text-sm font-medium text-slate-700">Estimated monthly minutes</label>
          <div className="mt-3 flex items-center gap-4">
            <input
              id="minutes"
              type="range"
              min={0}
              max={10000}
              step={50}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full"
            />
            <div className="whitespace-nowrap text-sm font-semibold">{minutes >= 1000 ? `${Math.round(minutes/100)/10}k` : `${minutes}`} mins</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {BASE_TIERS.map((tier) => (
            <motion.div key={tier.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <TierCard
                tier={tier}
                displayPrice={computePrice(tier)}
                billing={billing}
                minutes={minutes}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Frontend simulation only. Overage rate: ${OVERTIME_RATE_PER_MIN.toFixed(2)}/min. Real billing & price validation occurs on your server.
        </div>
      </div>
    </section>
  )
}
