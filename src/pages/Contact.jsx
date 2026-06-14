import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaWhatsapp } from "react-icons/fa"; // Imported WhatsApp Icon

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear any navigation state on component mount
  useEffect(() => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const sendMessage = async () => {
    if (!name || !email || !message) {
      toast.error("Please fill all the fields", {
        style: { background: '#171717', color: '#fff', border: '1px solid #262626' }
      });
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address", {
        style: { background: '#171717', color: '#fff', border: '1px solid #262626' }
      });
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        "service_jb5si3h", 
        "template_djbkjug", 
        {
          name: name,
          email: email, 
          message: message,
        },
        "JcFgDr0UzaRME0M9w" 
      );

      toast.success(
        `Thank you for messaging me ${name}, I will reach you soon`, {
          style: { background: '#171717', color: '#fff', border: '1px solid #a3e635' },
          icon: '🙏'
        }
      );

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Something went wrong. Please try again!", {
        style: { background: '#171717', color: '#fff', border: '1px solid #ef4444' }
      });
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Click Handler
  const handleWhatsAppClick = () => {
    const phoneNumber = import.meta.env.VITE_phoneNumber; 
    const waMessage = "Hello Padmanaban! I found your portfolio and would like to connect with you.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen pt-32 pb-24 px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Premium Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-2xl text-center relative z-10">
        <motion.h2
          className="text-4xl font-bold text-white mb-6 sm:text-5xl tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Get In <span className="text-lime-400">Touch</span>
        </motion.h2>
        <motion.p
          className="text-neutral-400 text-lg font-light mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Have a project in mind or just want to say hi? I'd love to hear from you.
        </motion.p>
      </div>

      <motion.form
        className="mx-auto max-w-xl glass-panel p-8 sm:p-10 rounded-3xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type your good name"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Message
            </label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Your message..."
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all duration-300 resize-none"
            />
          </div>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-lime-400 text-neutral-950 font-semibold py-4 rounded-xl hover:bg-lime-500 hover:shadow-lg hover:shadow-lime-400/20 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {/* Elegant Divider */}
        <div className="mt-8 flex items-center gap-4 w-full">
          <div className="h-[1px] flex-1 bg-white/5"></div>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Or</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        {/* Secondary WhatsApp Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-400 font-light mb-4">
            You can contact me in WhatsApp also
          </p>
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full bg-white/[0.03] border border-white/10 text-white font-medium py-4 rounded-xl hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:text-[#25D366] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <FaWhatsapp className="w-5 h-5 text-neutral-400 group-hover:text-[#25D366] transition-colors duration-300" />
            Chat on WhatsApp
          </button>
        </div>

      </motion.form>
    </motion.div>
  );
};

export default Contact;