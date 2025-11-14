import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { type, id } = useParams(); // type: 'subscription' or 'movie', id: plan/movie id
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    // Get details from location state or fetch
    if (location.state) {
      setItemDetails(location.state.plan || location.state.movie);
    }
  }, [location.state]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        console.log("✅ Razorpay already loaded");
        resolve(true);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        console.log("✅ Razorpay script already exists");
        existingScript.onload = () => resolve(true);
        return;
      }

      console.log("📥 Loading Razorpay script...");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      console.log("💳 Starting payment process...");
      console.log("   Type:", type);
      console.log("   ID:", id);
      console.log("   Item Details:", itemDetails);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to continue with payment");
        toast.error("Please login to continue");
        navigate('/login');
        setLoading(false);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay payment gateway. Please check your internet connection and try again.");
        toast.error("Failed to load payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Verify Razorpay is available
      if (!window.Razorpay) {
        alert("Payment gateway not initialized. Please refresh the page and try again.");
        toast.error("Payment gateway not initialized. Please refresh the page.");
        setLoading(false);
        return;
      }

      let orderData;
      
      if (type === 'subscription') {
        // Create subscription order
        console.log("🛒 Creating subscription order with planId:", id);
        const response = await API.post("/api/payments/subscription/create-order", {
          planId: id
        });
        console.log("✅ Order created:", response.data);
        orderData = response.data;
      } else if (type === 'movie') {
        // Create movie purchase order
        console.log("🎬 Creating movie purchase order with movieId:", id);
        const response = await API.post("/api/payments/movie/create-order", {
          movieId: id,
          movieTitle: itemDetails?.title || "Movie",
          price: 49 // Fixed price for movies
        });
        console.log("✅ Order created:", response.data);
        orderData = response.data;
      }

      if (!orderData || !orderData.orderId) {
        alert("Failed to create payment order. Please try again.");
        throw new Error("Invalid order data received from server");
      }

      console.log("🔧 Configuring Razorpay options...");
      console.log("   Key ID:", orderData.keyId);
      console.log("   Order ID:", orderData.orderId);
      console.log("   Amount:", orderData.amount);

      // Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "CineVerse",
        description: type === 'subscription' ? `${itemDetails?.name} Subscription` : `Purchase ${itemDetails?.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          console.log("✅ Payment successful!", response);
          try {
            setLoading(true);
            // Verify payment
            let verifyEndpoint = type === 'subscription' 
              ? '/api/payments/subscription/verify'
              : '/api/payments/movie/verify';

            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            if (type === 'subscription') {
              verifyData.planId = id;
            } else {
              verifyData.movieId = id;
              verifyData.movieTitle = itemDetails?.title;
              verifyData.price = 49;
            }

            console.log("🔍 Verifying payment...", verifyData);
            const verifyResponse = await API.post(verifyEndpoint, verifyData);
            console.log("✅ Payment verified:", verifyResponse.data);

            toast.success(type === 'subscription' ? '🎉 Subscription activated!' : '🎬 Movie unlocked!');
            
            // Redirect based on type
            setTimeout(() => {
              if (type === 'subscription') {
                navigate('/profile');
              } else {
                navigate(`/movie/${id}`);
              }
            }, 1000);
          } catch (error) {
            console.error("❌ Payment verification failed:", error);
            toast.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#dc2626" // Red color matching your theme
        },
        modal: {
          ondismiss: function() {
            console.log("⚠️ Payment modal dismissed");
            setLoading(false);
            toast.info("Payment cancelled");
          },
          escape: true,
          backdropclose: false
        }
      };

      console.log("🚀 Opening Razorpay checkout...");
      try {
        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', function (response) {
          console.error("❌ Payment failed:", response.error);
          alert(`Payment Failed: ${response.error.description || response.error.reason}`);
          toast.error(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        
        razorpay.open();
        setLoading(false);
      } catch (razorpayError) {
        console.error("❌ Razorpay initialization error:", razorpayError);
        alert(`Payment gateway error: ${razorpayError.message}`);
        toast.error("Failed to open payment gateway");
        setLoading(false);
      }

    } catch (error) {
      console.error("❌ Payment error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Payment failed. Please try again.";
      alert(`Payment Error: ${errorMessage}`);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8"
        >
          <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Complete Your {type === 'subscription' ? 'Subscription' : 'Purchase'}
          </h1>

          {itemDetails && (
            <div className="mb-8">
              <div className="bg-black/30 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold mb-2">
                  {type === 'subscription' ? itemDetails.name + ' Plan' : itemDetails.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-black text-green-400">
                    ₹{type === 'subscription' ? itemDetails.price : 49}
                  </span>
                  <span className="text-gray-400">
                    {type === 'subscription' ? `/${itemDetails.duration}` : '/48 hours'}
                  </span>
                </div>

                {type === 'subscription' && itemDetails.features && (
                  <ul className="space-y-2 text-gray-300">
                    {itemDetails.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {type === 'movie' && (
                  <p className="text-gray-300">
                    ⏰ Watch this movie anytime within 48 hours of purchase
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            🔒 Secure payment powered by Razorpay
          </p>
        </motion.div>
      </div>
    </div>
  );
}
