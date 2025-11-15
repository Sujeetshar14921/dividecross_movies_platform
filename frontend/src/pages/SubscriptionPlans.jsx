import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import API from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await API.get("/api/payments/plans");
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const getPlanColor = (name) => {
    const colors = {
      "Basic": "blue",
      "Premium": "red",
      "Ultra": "purple"
    };
    return colors[name] || "gray";
  };

  const handleSubscribe = (plan) => {
    if (plan.price === 0) {
      return;
    }
    // Use MongoDB _id instead of plan.id
    navigate(`/checkout/subscription/${plan._id}`, { state: { plan } });
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: {
        bg: "from-gray-800 to-gray-900",
        border: "border-gray-700",
        button: "bg-gray-700 hover:bg-gray-600",
        badge: "bg-gray-700"
      },
      blue: {
        bg: "from-blue-900 to-blue-950",
        border: "border-blue-700",
        button: "bg-blue-600 hover:bg-blue-700",
        badge: "bg-blue-600"
      },
      red: {
        bg: "from-red-900 to-pink-950",
        border: "border-red-500",
        button: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700",
        badge: "bg-gradient-to-r from-red-600 to-pink-600"
      },
      purple: {
        bg: "from-purple-900 to-indigo-950",
        border: "border-purple-700",
        button: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
        badge: "bg-gradient-to-r from-purple-600 to-indigo-600"
      }
    };
    return colors[color];
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-6 sm:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-base sm:text-xl text-gray-400">
            Unlimited movies, flexible plans. Cancel anytime.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {plans.map((plan, index) => {
            const color = getPlanColor(plan.name);
            const colors = getColorClasses(color);
            const isPopular = plan.name === "Premium";
            
            return (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.bg} border-2 ${colors.border} p-4 sm:p-6 ${
                  isPopular ? 'sm:scale-105 shadow-2xl shadow-red-500/20' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className={`absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-1 ${colors.badge} rounded-full text-xs sm:text-sm font-bold`}>
                    ⭐ Most Popular
                  </div>
                )}

                {/* Plan Name */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black">₹{plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-sm sm:text-base text-gray-400">/{plan.duration} days</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={plan.price === 0}
                  className={`w-full py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all ${colors.button} ${
                    plan.price === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                  }`}
                >
                  {plan.price === 0 ? 'Current Plan' : 'Subscribe Now'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Pay Per View Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-2 border-orange-600/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Pay Per View
          </h3>
          <p className="text-sm sm:text-base text-gray-300 mb-4 max-w-2xl mx-auto">
            Don't want a subscription? Rent individual movies for just <span className="text-xl sm:text-2xl font-bold text-orange-400">₹49</span> each.
            Watch anytime within 48 hours of purchase.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all hover:scale-105"
          >
            Browse Movies
          </button>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-sm sm:text-base text-gray-400 mb-4">
            Cancel anytime, no questions asked.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Secure payment powered by Razorpay 🔒
          </p>
        </motion.div>
      </div>
    </div>
  );
}
