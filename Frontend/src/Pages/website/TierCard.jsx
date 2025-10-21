// src/Components/TierCard.jsx
import React, { useState } from "react"

export default function TierCard({ tier, displayPrice, billing, minutes }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handler to start Stripe Checkout
  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      // POST to your backend to create a Checkout Session
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          billing: billing,
          minutes: minutes,
        }),
      })

      if (!resp.ok) {
        const err = await resp.text()
        throw new Error(err || 'Failed to create session')
      }

      const { url } = await resp.json()
      // redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error(err)
      setError(err.message || 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{tier.name}</h3>
          {tier.id === 'enterprise' && <div className="text-xs bg-slate-100 px-2 py-1 rounded">Popular</div>}
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            <div className="text-3xl font-bold">${displayPrice}</div>
            <div className="text-sm text-slate-500">/mo</div>
            <div className="ml-auto text-xs text-slate-400">{billing === 'yearly' ? 'billed yearly' : 'billed monthly'}</div>
          </div>

          <div className="mt-3 text-sm text-slate-600">
            <div>{tier.minutesIncluded.toLocaleString()} mins included</div>
          </div>
        </div>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="text-slate-600">• Core AI features</li>
          <li className="text-slate-600">• API & Integrations</li>
          <li className="text-slate-600">• 24/7 support (Pro+)</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button onClick={handleCheckout} className="px-4 py-2 bg-indigo-600 text-white rounded-lg" disabled={loading}>
          {loading ? 'Redirecting…' : `Start ${tier.name}`}
        </button>
        {error && <div className="text-xs text-red-600">{error}</div>}
        <a href="#contact" className="text-sm text-indigo-600 underline">Contact Sales</a>
      </div>
    </div>
  )
}
