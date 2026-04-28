import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {
  Bike,
  ChefHat,
  ChevronRight,
  Clock3,
  Flame,
  IndianRupee,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Minus,
  Navigation,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Utensils,
  User,
  UserPlus,
  WalletCards,
  Zap
} from "lucide-react";
import "./styles.css";

const usersStorageKey = "flashfeast-users";
const sessionStorageKey = "flashfeast-user";

function ParticleBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setReady(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: "#ffffff"
      },
      fullScreen: {
        enable: false
      },
      detectRetina: false,
      fpsLimit: 120,
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "repulse"
          },
          resize: {
            enable: true,
            delay: 0.5
          }
        },
        modes: {
          repulse: {
            distance: 95,
            duration: 0.8,
            easing: "ease-out-quad",
            speed: 0.8,
            factor: 90,
            maxSpeed: 20
          }
        }
      },
      particles: {
        color: {
          value: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"]
        },
        links: {
          enable: false
        },
        number: {
          value: 84,
          density: {
            enable: true,
            width: 1440,
            height: 900
          }
        },
        opacity: {
          value: 0.95
        },
        shape: {
          type: "circle"
        },
        size: {
          value: { min: 1.2, max: 2.6 }
        },
        move: {
          enable: true,
          speed: 4.2,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out"
          }
        }
      },
      responsive: [
        {
          maxWidth: 900,
          options: {
            particles: {
              number: {
                value: 80
              },
              move: {
                speed: 3.2
              }
            }
          }
        }
      ]
    }),
    []
  );

  if (!ready) {
    return null;
  }

  return (
    <div className="particleLayer" aria-hidden="true">
      <Particles id="app-particles" options={options} className="particleCanvas" />
    </div>
  );
}

function readSavedUsers() {
  try {
    const raw = window.localStorage.getItem(usersStorageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedUsers(users) {
  window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
}

function LoginPage({ onBack, onOpenSignup, onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmit({ email, password });
    if (!result.ok) {
      setError(result.message);
    }
  }

  return (
    <main className="authPageMain">
      <ParticleBackground />
      <section className="authPage" aria-label="Login page">
        <div className="authCard authPageCard">
          <div className="authVisual">
            <span className="brandMark">
              <Zap size={22} />
            </span>
            <h2>Welcome back to FlashFeast</h2>
            <p>Sign in to place orders, track deliveries live, and manage your account.</p>
          </div>
          <form className="authForm" onSubmit={handleSubmit}>
            <label>
              Email
              <span>
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </span>
            </label>

            <label>
              Password
              <span>
                <Lock size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                />
              </span>
            </label>

            {error && <p className="authError">{error}</p>}

            <button className="authSubmit" type="submit">
              <LogIn size={19} />
              Login
            </button>

            <p className="authHintText">
              New user?
              <button className="authLinkBtn" type="button" onClick={onOpenSignup}>
                Create account
              </button>
            </p>
            <button className="authBackBtn" type="button" onClick={onBack}>
              Continue without login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function SignupPage({ onBack, onOpenLogin, onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmit(form);
    if (!result.ok) {
      setError(result.message);
    }
  }

  return (
    <main className="authPageMain">
      <ParticleBackground />
      <section className="authPage" aria-label="Signup page">
        <div className="authCard authPageCard">
          <div className="authVisual">
            <span className="brandMark">
              <Zap size={22} />
            </span>
            <h2>Create your FlashFeast account</h2>
            <p>Join now to save your details and order from local kitchens faster.</p>
          </div>
          <form className="authForm" onSubmit={handleSubmit}>
            <label>
              Full name
              <span>
                <User size={18} />
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Aarav Sharma"
                />
              </span>
            </label>

            <label>
              Email
              <span>
                <Mail size={18} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                />
              </span>
            </label>

            <label>
              Password
              <span>
                <Lock size={18} />
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </span>
            </label>

            <label>
              Mobile number
              <span>
                <Phone size={18} />
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+91 98765 43210"
                />
              </span>
            </label>

            {error && <p className="authError">{error}</p>}

            <button className="authSubmit" type="submit">
              <UserPlus size={19} />
              Sign up
            </button>

            <p className="authHintText">
              Already have an account?
              <button className="authLinkBtn" type="button" onClick={onOpenLogin}>
                Login
              </button>
            </p>
            <button className="authBackBtn" type="button" onClick={onBack}>
              Continue without login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

const restaurants = [
  {
    name: "Biryani By Kilo",
    tag: "North Indian",
    rating: 4.9,
    eta: "18-24 min",
    accent: "#ff6b35",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Dosa House Express",
    tag: "South Indian",
    rating: 4.8,
    eta: "20-28 min",
    accent: "#00a6a6",
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Tandoori Junction",
    tag: "Tandoor & curries",
    rating: 4.7,
    eta: "15-22 min",
    accent: "#d62828",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Burger District",
    tag: "Burgers & wraps",
    rating: 4.6,
    eta: "17-24 min",
    accent: "#7a3e12",
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Sushi Sprint",
    tag: "Sushi & bowls",
    rating: 4.8,
    eta: "22-30 min",
    accent: "#2f5d8a",
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80"
  }
];

const cityRestaurantMap = {
  Hyderabad: [
    {
      name: "Paradise Biryani",
      tag: "Hyderabadi biryani",
      eta: "16-22 min",
      image: commonsImage("Hyderabadi Biryani.jpg")
    },
    {
      name: "Chutneys Express",
      tag: "Dosa & idli",
      eta: "18-25 min",
      image: commonsImage("Masala dosa (96279).jpg")
    },
    {
      name: "Shah Ghouse Kitchen",
      tag: "Kebabs & haleem",
      eta: "20-28 min",
      image: commonsImage("Haleem.jpg")
    },
    {
      name: "Jubilee Burger Club",
      tag: "Burgers & fries",
      eta: "17-24 min",
      image:
        "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Banjara Bowl Co.",
      tag: "Rice bowls",
      eta: "22-30 min",
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80"
    }
  ],
  Bengaluru: [
    { name: "CTR Tiffin Room", tag: "Benne dosa", eta: "17-24 min" },
    { name: "Meghana Feast", tag: "Andhra biryani", eta: "20-29 min" },
    { name: "Indiranagar Pizza Co.", tag: "Wood-fired pizza", eta: "18-26 min" },
    { name: "Koramangala Smash", tag: "Burgers & wraps", eta: "16-24 min" },
    { name: "Malleshwaram Bento Lab", tag: "Sushi bowls", eta: "22-31 min" }
  ],
  Mumbai: [
    { name: "Bombay Canteen Go", tag: "Mumbai classics", eta: "18-26 min" },
    { name: "Juhu Chaat Studio", tag: "Chaat & snacks", eta: "14-21 min" },
    { name: "Bandra Burger Bar", tag: "Burgers", eta: "19-27 min" },
    { name: "Colaba Coastal Grill", tag: "Seafood", eta: "21-30 min" },
    { name: "Powai Bowl Kitchen", tag: "Asian bowls", eta: "22-31 min" }
  ],
  Delhi: [
    { name: "Karol Bagh Tandoor", tag: "Butter chicken", eta: "18-25 min" },
    { name: "Old Delhi Rolls", tag: "Kathi rolls", eta: "15-22 min" },
    { name: "Saket Sushi Box", tag: "Sushi", eta: "22-31 min" },
    { name: "Rajouri Garden Grill", tag: "Tandoori platters", eta: "19-27 min" },
    { name: "CP Chaat Cart", tag: "Street snacks", eta: "16-23 min" }
  ],
  Chennai: [
    { name: "Mylapore Meals", tag: "South Indian thali", eta: "16-23 min" },
    { name: "Marina Dosa Cart", tag: "Dosa & filter coffee", eta: "14-20 min" },
    { name: "Chettinad Flame", tag: "Chettinad curries", eta: "19-28 min" },
    { name: "Adyar Seafood Pot", tag: "Seafood", eta: "21-30 min" },
    { name: "T Nagar Kothu Lab", tag: "Parotta & kothu", eta: "18-26 min" }
  ],
  Pune: [
    { name: "FC Road Tiffins", tag: "Breakfast & tiffins", eta: "17-24 min" },
    { name: "Kalyani Biryani House", tag: "Spicy biryani", eta: "20-28 min" },
    { name: "Baner Pizza Mill", tag: "Wood-fired pizza", eta: "19-27 min" },
    { name: "Aundh Burger Yard", tag: "Burgers & shakes", eta: "18-25 min" },
    { name: "Camp Bento Corner", tag: "Asian bowls", eta: "23-32 min" }
  ],
  Kolkata: [
    { name: "Park Street Kosha", tag: "Bengali mains", eta: "19-27 min" },
    { name: "Salt Lake Roll Co.", tag: "Kathi rolls", eta: "16-23 min" },
    { name: "Howrah Biryani Pot", tag: "Kolkata biryani", eta: "21-30 min" },
    { name: "Gariahat Burger Hub", tag: "Burgers & fries", eta: "18-26 min" },
    { name: "New Town Bento Bar", tag: "Sushi bowls", eta: "23-32 min" }
  ]
};

const cityMenuMap = {
  Hyderabad: [
    [
      { section: "Biryani", items: ["Dum Chicken Biryani", "Mutton Biryani", "Paneer Biryani", "Egg Biryani"] },
      { section: "Starters", items: ["Chicken 65", "Apollo Fish", "Paneer Majestic"] },
      { section: "Sides", items: ["Mirchi Ka Salan", "Raita Bowl", "Bagara Rice"] },
      { section: "Desserts", items: ["Double Ka Meetha", "Qubani Ka Meetha"] }
    ],
    [
      { section: "Dosa", items: ["Ghee Karam Dosa", "Masala Dosa", "Pesarattu Upma", "Onion Rava Dosa"] },
      { section: "Tiffins", items: ["Idli Sambar Box", "Medu Vada", "Pongal Bowl"] },
      { section: "Combos", items: ["Mini Tiffin Platter", "Dosa Coffee Combo"] },
      { section: "Drinks", items: ["Filter Coffee", "Badam Milk"] }
    ],
    [
      { section: "Kebabs", items: ["Mutton Seekh Kebab", "Chicken Malai Kebab", "Paneer Tikka"] },
      { section: "Haleem", items: ["Haleem Bowl", "Special Mutton Haleem"] },
      { section: "Rolls", items: ["Rumali Chicken Roll", "Paneer Rumali Roll", "Egg Paratha Roll"] },
      { section: "Curries", items: ["Nalli Nihari", "Butter Chicken", "Dalcha"] }
    ]
  ],
  Bengaluru: [
    [
      { section: "Dosa", items: ["Benne Masala Dosa", "Plain Benne Dosa", "Open Butter Dosa", "Set Dosa"] },
      { section: "Tiffins", items: ["Thatte Idli", "Vada Sambar", "Khara Bath"] },
      { section: "Sweets", items: ["Kesari Bath", "Mysore Pak"] },
      { section: "Drinks", items: ["Filter Coffee", "Masala Chai"] }
    ],
    [
      { section: "Biryani", items: ["Andhra Chicken Biryani", "Mutton Fry Biryani", "Paneer Biryani"] },
      { section: "Bowls", items: ["Gongura Paneer Bowl", "Pulihora Rice Bowl", "Curd Rice Bowl"] },
      { section: "Starters", items: ["Kodi Vepudu", "Chilli Paneer", "Pepper Chicken"] },
      { section: "Meals", items: ["Andhra Veg Meals", "Chicken Curry Meals"] }
    ],
    [
      { section: "Pizza", items: ["Burrata Margherita", "Peri Peri Paneer Pizza", "Truffle Mushroom Pizza"] },
      { section: "Pasta", items: ["Arrabbiata Pasta", "Pesto Cream Pasta"] },
      { section: "Sides", items: ["Garlic Knots", "Loaded Potato Wedges"] },
      { section: "Desserts", items: ["Tiramisu Cup", "Chocolate Mousse"] }
    ]
  ],
  Mumbai: [
    [
      { section: "Mumbai Plates", items: ["Vada Pav Sliders", "Misal Pav", "Pav Bhaji", "Kanda Poha"] },
      { section: "Parsi Specials", items: ["Keema Pav", "Berry Pulao", "Salli Boti"] },
      { section: "Snacks", items: ["Bombay Sandwich", "Kanda Bhaji"] },
      { section: "Desserts", items: ["Caramel Custard", "Mawa Cake"] }
    ],
    [
      { section: "Chaat", items: ["Pani Puri Flight", "Ragda Pattice", "Dahi Sev Puri", "Bhel Puri"] },
      { section: "Street Rolls", items: ["Paneer Frankie", "Chicken Frankie"] },
      { section: "Combos", items: ["Chaat Sampler", "College Canteen Combo"] },
      { section: "Drinks", items: ["Kala Khatta Cooler", "Masala Soda"] }
    ],
    [
      { section: "Burgers", items: ["Smash Burger", "Crispy Chicken Burger", "Paneer Makhani Burger"] },
      { section: "Sides", items: ["Loaded Masala Fries", "Cheese Poppers", "Onion Rings"] },
      { section: "Wraps", items: ["Tandoori Wrap", "Falafel Wrap"] },
      { section: "Shakes", items: ["Cold Coffee Shake", "Oreo Shake"] }
    ]
  ],
  Delhi: [
    [
      { section: "Curries", items: ["Butter Chicken Bowl", "Dal Makhani", "Paneer Lababdar", "Chole Kulche"] },
      { section: "Tandoor", items: ["Paneer Tikka Platter", "Chicken Tikka", "Malai Chaap"] },
      { section: "Breads", items: ["Garlic Naan Basket", "Laccha Paratha", "Roomali Roti"] },
      { section: "Desserts", items: ["Gulab Jamun", "Phirni"] }
    ],
    [
      { section: "Rolls", items: ["Chicken Kathi Roll", "Paneer Roomali Roll", "Egg Roll", "Soya Chaap Roll"] },
      { section: "Snacks", items: ["Aloo Tikki", "Momos Platter", "Chilli Potato"] },
      { section: "Combos", items: ["Roll Meal Box", "Student Combo"] },
      { section: "Drinks", items: ["Masala Lemonade", "Sweet Lassi"] }
    ],
    [
      { section: "Sushi", items: ["Spicy Tuna Sushi", "Avocado Maki", "Tempura Prawn Roll"] },
      { section: "Ramen", items: ["Miso Ramen Cup", "Tantanmen Bowl"] },
      { section: "Bowls", items: ["Teriyaki Chicken Bowl", "Tofu Donburi"] },
      { section: "Sides", items: ["Edamame", "Chicken Gyoza"] }
    ]
  ],
  Chennai: [
    [
      { section: "Meals", items: ["Sambar Rice Combo", "South Indian Thali", "Lemon Rice", "Curd Rice Bowl"] },
      { section: "Tiffins", items: ["Mini Tiffin", "Idiyappam Kurma", "Ven Pongal"] },
      { section: "Snacks", items: ["Medu Vada", "Sundal Cup"] },
      { section: "Sweets", items: ["Payasam", "Mysore Pak"] }
    ],
    [
      { section: "Dosa", items: ["Ghee Podi Dosa", "Masala Dosa", "Rava Dosa", "Onion Uttapam"] },
      { section: "Breakfast", items: ["Medu Vada Plate", "Idli Sambar", "Pongal Vada"] },
      { section: "Combos", items: ["Dosa Coffee Combo", "Family Tiffin Box"] },
      { section: "Drinks", items: ["Degree Coffee", "Rose Milk"] }
    ],
    [
      { section: "Chettinad", items: ["Chettinad Chicken", "Mutton Chukka", "Pepper Paneer Fry"] },
      { section: "Parotta", items: ["Kothu Parotta", "Egg Parotta", "Veg Kurma Parotta"] },
      { section: "Seafood", items: ["Prawn Pepper Fry", "Fish Curry Meals"] },
      { section: "Rice", items: ["Chicken Biryani", "Ghee Rice"] }
    ]
  ],
  Pune: [
    [
      { section: "Maharashtrian", items: ["Misal Pav", "Sabudana Khichdi", "Pithla Bhakri", "Kothimbir Vadi"] },
      { section: "Street Snacks", items: ["Vada Pav", "Dabeli", "Samosa Chaat"] },
      { section: "Rice", items: ["Masale Bhat", "Curd Rice Bowl"] },
      { section: "Drinks", items: ["Solkadhi", "Masala Chaas"] }
    ],
    [
      { section: "Biryani", items: ["Chicken Biryani", "Mutton Biryani", "Paneer Biryani"] },
      { section: "Starters", items: ["Chicken 65", "Paneer Chilli", "Crispy Corn"] },
      { section: "Wraps", items: ["Chicken Roll", "Paneer Roll"] },
      { section: "Desserts", items: ["Gulab Jamun", "Rabdi"] }
    ],
    [
      { section: "Pizza", items: ["Margherita Pizza", "Farmhouse Pizza", "Paneer Tikka Pizza"] },
      { section: "Pasta", items: ["Arrabbiata Pasta", "White Sauce Pasta"] },
      { section: "Sides", items: ["Garlic Bread", "Cheese Fries"] },
      { section: "Shakes", items: ["Cold Coffee", "Chocolate Shake"] }
    ]
  ],
  Kolkata: [
    [
      { section: "Bengali", items: ["Kosha Mangsho", "Shorshe Fish", "Cholar Dal", "Luchi"] },
      { section: "Rice", items: ["Basanti Pulao", "Steamed Rice", "Veg Pulao"] },
      { section: "Snacks", items: ["Telebhaja", "Fish Fry"] },
      { section: "Desserts", items: ["Mishti Doi", "Rosogolla"] }
    ],
    [
      { section: "Rolls", items: ["Chicken Kathi Roll", "Egg Roll", "Paneer Roll"] },
      { section: "Chaat", items: ["Puchka", "Jhalmuri", "Aloo Kabli"] },
      { section: "Combos", items: ["Roll Combo Box", "College Snack Combo"] },
      { section: "Drinks", items: ["Lemon Soda", "Sweet Lassi"] }
    ],
    [
      { section: "Biryani", items: ["Kolkata Chicken Biryani", "Mutton Biryani", "Paneer Biryani"] },
      { section: "Bowls", items: ["Teriyaki Chicken Bowl", "Tofu Bowl"] },
      { section: "Sides", items: ["Spring Rolls", "Chilli Potato"] },
      { section: "Desserts", items: ["Baked Rasgulla", "Chocolate Mousse"] }
    ]
  ]
};

const overflowMenuProfiles = {
  burgers: [
    {
      section: "Burgers",
      items: ["Smash Burger", "Crispy Chicken Burger", "Paneer Makhani Burger", "Veg Crunch Burger"]
    },
    {
      section: "Fries",
      items: ["Loaded Masala Fries", "Peri Peri Fries", "Cheese Fries"]
    },
    {
      section: "Wraps",
      items: ["Chicken Kathi Roll", "Paneer Roll", "Egg Roll"]
    },
    {
      section: "Shakes",
      items: ["Cold Coffee Shake", "Oreo Shake", "Chocolate Shake"]
    }
  ],
  bowls: [
    {
      section: "Bowls",
      items: ["Teriyaki Chicken Bowl", "Tofu Bowl", "Pulihora Rice Bowl", "Curd Rice Bowl"]
    },
    {
      section: "Rice",
      items: ["Bagara Rice", "Lemon Rice", "Veg Pulao"]
    },
    {
      section: "Sides",
      items: ["Edamame", "Chilli Potato", "Paneer Tikka"]
    },
    {
      section: "Drinks",
      items: ["Sweet Lassi", "Masala Soda", "Lemon Soda"]
    }
  ],
  seafood: [
    {
      section: "Seafood",
      items: ["Prawn Pepper Fry", "Fish Curry Meals", "Shorshe Fish"]
    },
    {
      section: "Rice",
      items: ["Steamed Rice", "Lemon Rice", "Veg Pulao"]
    },
    {
      section: "Sides",
      items: ["Fish Fry", "Chilli Potato", "Edamame"]
    },
    {
      section: "Drinks",
      items: ["Lemon Soda", "Sweet Lassi", "Masala Soda"]
    }
  ],
  tandoor: [
    {
      section: "Tandoor",
      items: ["Chicken Tikka", "Paneer Tikka Platter", "Malai Chaap"]
    },
    {
      section: "Curries",
      items: ["Butter Chicken Bowl", "Dal Makhani", "Paneer Lababdar"]
    },
    {
      section: "Breads",
      items: ["Garlic Naan Basket", "Laccha Paratha", "Roomali Roti"]
    },
    {
      section: "Desserts",
      items: ["Gulab Jamun", "Phirni"]
    }
  ],
  street: [
    {
      section: "Chaat",
      items: ["Pani Puri Flight", "Ragda Pattice", "Dahi Sev Puri", "Bhel Puri"]
    },
    {
      section: "Snacks",
      items: ["Aloo Tikki", "Chilli Potato", "Momos Platter"]
    },
    {
      section: "Rolls",
      items: ["Chicken Kathi Roll", "Paneer Roll", "Egg Roll"]
    },
    {
      section: "Drinks",
      items: ["Masala Lemonade", "Sweet Lassi", "Lemon Soda"]
    }
  ],
  parotta: [
    {
      section: "Parotta",
      items: ["Kothu Parotta", "Egg Parotta", "Veg Kurma Parotta"]
    },
    {
      section: "Chettinad",
      items: ["Chettinad Chicken", "Pepper Paneer Fry", "Mutton Chukka"]
    },
    {
      section: "Seafood",
      items: ["Prawn Pepper Fry", "Fish Curry Meals"]
    },
    {
      section: "Rice",
      items: ["Chicken Biryani", "Ghee Rice", "Lemon Rice"]
    }
  ]
};

function overflowMenuForRestaurant(restaurant) {
  const lookup = `${restaurant.tag || ""} ${restaurant.name || ""}`.toLowerCase();

  if (lookup.includes("burger")) {
    return overflowMenuProfiles.burgers;
  }

  if (lookup.includes("bowl") || lookup.includes("bento") || lookup.includes("sushi")) {
    return overflowMenuProfiles.bowls;
  }

  if (lookup.includes("seafood") || lookup.includes("coastal")) {
    return overflowMenuProfiles.seafood;
  }

  if (lookup.includes("street") || lookup.includes("chaat")) {
    return overflowMenuProfiles.street;
  }

  if (lookup.includes("tandoor") || lookup.includes("kebab") || lookup.includes("grill")) {
    return overflowMenuProfiles.tandoor;
  }

  if (lookup.includes("parotta") || lookup.includes("kothu")) {
    return overflowMenuProfiles.parotta;
  }

  return null;
}

const cityCoordinates = [
  { city: "Hyderabad", lat: 17.385, lon: 78.4867 },
  { city: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { city: "Mumbai", lat: 19.076, lon: 72.8777 },
  { city: "Delhi", lat: 28.6139, lon: 77.209 },
  { city: "Chennai", lat: 13.0827, lon: 80.2707 },
  { city: "Pune", lat: 18.5204, lon: 73.8567 },
  { city: "Kolkata", lat: 22.5726, lon: 88.3639 }
];

const menu = [
  {
    id: 1,
    name: "Truffle Paneer Tikka Bowl",
    kitchen: "Saffron Street",
    price: 329,
    rating: 4.9,
    time: "19 min",
    category: "Bowls",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Crispy Chili Bao Box",
    kitchen: "Bao Bloom",
    price: 279,
    rating: 4.8,
    time: "22 min",
    category: "Asian",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Smoked Burrata Pizza",
    kitchen: "Napoli Rush",
    price: 449,
    rating: 4.7,
    time: "16 min",
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Mango Fire Sushi Set",
    kitchen: "Sora Kitchen",
    price: 529,
    rating: 4.9,
    time: "25 min",
    category: "Sushi",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Velvet Butter Chicken",
    kitchen: "Saffron Street",
    price: 399,
    rating: 4.9,
    time: "21 min",
    category: "Indian",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Green Goddess Burger",
    kitchen: "Urban Grill",
    price: 299,
    rating: 4.6,
    time: "17 min",
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80"
  }
];

function commonsImage(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=900`;
}

const exactDishImages = [
  ["pongal bowl", "Pongal Dish.JPG"],
  ["pongal vada", "Pongal Dish.JPG"],
  ["mini tiffin platter", "Tiffins South indian.jpg"],
  ["family tiffin box", "Tiffins South indian.jpg"],
  ["dosa coffee combo", "Masala dosa (96279).jpg"],
  ["filter coffee", "South Indian Filter Coffee.jpg"],
  ["degree coffee", "South Indian Filter Coffee.jpg"],
  ["mutton seekh kebab", "Mutton Seekh (9454117913).jpg"],
  ["chicken malai kebab", "Chicken Malai Kebab.JPG"],
  ["haleem bowl", "Haleem (2).jpg"],
  ["special mutton haleem", "Haleem.jpg"],
  ["paneer rumali roll", "Shahi paneer roll with Makhmali gravy 2.jpg"],
  ["egg paratha roll", "EGG ROLL.JPG"],
  ["nalli nihari", "Nalli Nihari.JPG"],
  ["dalcha", "Pot of Lamb Dalcha.jpg"],
  ["raita bowl", "Cucumber-raita.jpg"],
  ["bagara rice", "Bagara Rice South Indian Style.jpg"],
  ["double ka meetha", "Double Ka Meetha.JPG"],
  ["qubani ka meetha", "Khobani Ka Meetha.JPG"],
  ["khubani ka meetha", "Khobani Ka Meetha.JPG"],
  ["chicken 65", "Chicken 65.jpg"],
  ["apollo fish", "APOLLO FISH.jpg"],
  ["paneer majestic", "Paneer 65.jpg"],
  ["mirchi ka salan", "Hyderabadi Hari Mirchi Ka Salan.JPG"],
  ["hari mirchi ka salan", "Hyderabadi Hari Mirchi Ka Salan.JPG"],
  ["dum chicken biryani", "Hyderabadi Chicken Biryani.jpg"],
  ["chicken biryani", "Hyderabadi Chicken Biryani.jpg"],
  ["mutton biryani", "Mutton biryani.JPG"],
  ["paneer biryani", "Indian Veg Biryani.jpg"],
  ["egg biryani", "Egg biryani.JPG"],
  ["andhra chicken biryani", "Hyderabadi Biryani.jpg"],
  ["masala dosa", "Masala dosa (96279).jpg"],
  ["benne masala dosa", "MTR Masala Dosa.JPG"],
  ["ghee karam dosa", "Masala Dosa 02.jpg"],
  ["pesarattu upma", "Pesarattu Upma.jpg"],
  ["onion rava dosa", "Rawa Onion Dosa (48754301486).jpg"],
  ["rava dosa", "Rawa Onion Dosa (48754301486).jpg"],
  ["idli sambar box", "Idli-Sambar.JPG"],
  ["idli sambar", "Idli-Sambar.JPG"],
  ["medu vada", "Medu Vada.JPG"],
  ["thatte idli", "Idli-Sambar.JPG"],
  ["idli", "Idli vada in sambar.jpg"],
  ["vada sambar", "Idli vada in sambar.jpg"],
  ["pani puri", "Pani Puri .jpg"],
  ["puchka", "Pani Puri .jpg"],
  ["jhalmuri", "Pani Puri .jpg"],
  ["aloo kabli", "Pani Puri .jpg"],
  ["ragda pattice", "Pani Puri .jpg"],
  ["dahi sev puri", "Pani Puri .jpg"],
  ["bhel puri", "Pani Puri .jpg"],
  ["samosa chaat", "Pani Puri .jpg"],
  ["vada pav", "Vada Pav.jpg"],
  ["misal pav", "Vada Pav.jpg"],
  ["dabeli", "Vada Pav.jpg"],
  ["pav bhaji", "Pav Bhaji.JPG"],
  ["masale bhat", "Bagara Rice South Indian Style.jpg"],
  ["butter chicken", "Chicken makhani.jpg"],
  ["chettinad chicken", "Chicken makhani.jpg"],
  ["paneer tikka", "Paneer tikka.jpg"],
  ["paneer chilli", "Paneer tikka.jpg"],
  ["paneer chaat", "Paneer tikka.jpg"],
  ["kathi roll", "Chicken Kathi Roll (5646735923).jpg"],
  ["chicken roll", "Chicken Kathi Roll (5646735923).jpg"],
  ["paneer roll", "Shahi paneer roll with Makhmali gravy 2.jpg"],
  ["egg roll", "EGG ROLL.JPG"],
  ["frankie", "Kathi Roll.jpg"],
  ["gulab jamun", "Gulab Jamun.jpg"],
  ["thali", "'1' Thali Indian Food.jpg"],
  ["luchi", "'1' Thali Indian Food.jpg"],
  ["sabudana khichdi", "'1' Thali Indian Food.jpg"],
  ["pithla bhakri", "'1' Thali Indian Food.jpg"],
  ["kothimbir vadi", "'1' Thali Indian Food.jpg"],
  ["steamed rice", "Bagara Rice South Indian Style.jpg"],
  ["veg pulao", "Veg Pulao (Indian fried rice).jpg"],
  ["basanti pulao", "Bagara Rice South Indian Style.jpg"],
  ["pizza", "Pizza Margherita (14703152728).jpg"],
  ["garlic bread", "Pizza Margherita (14703152728).jpg"],
  ["smash burger", "Smash Burger, Village Commons, Tallahassee.jpg"],
  ["crispy chicken burger", "Crispy Chicken Burger & French Fry Set.jpg"],
  ["paneer makhani burger", "Caffine Rush Smoothie and Achari Paneer Burger - The Honeyed Tale Cafe, Vadodara - 04.jpg"],
  ["veg crunch burger", "Veg Patty Burger.jpg"],
  ["loaded masala fries", "Loaded fries food.jpg"],
  ["peri peri fries", "Peri Peri French Fries - Mum's Cafe, Vadodara - Gujarat - 01.jpg"],
  ["cheese fries", "Cheese Fries.jpg"],
  ["sushi", "Sushi platter.jpg"],
  ["teriyaki chicken bowl", "Teriyaki Chicken Rice Bowl from Botejyu (2024-12-21).jpg"],
  ["tofu bowl", "Bali vegan bowl with tofu.jpg"],
  ["curd rice bowl", "Curd Rice.jpg"],
  ["pulihora rice bowl", "Pulihora.jpg"],
  ["lemon rice", "Picture of Lemon rice dish.JPG"],
  ["edamame", "Edamame in a tray.jpg"],
  ["chilli potato", "Honey Chilli potato.jpg"],
  ["masala soda", "Masala soda.jpg"],
  ["lemon soda", "Nimbu Soda Or Lemon Soda.jpg"],
  ["sweet lassi", "Sweet Lassi.JPG"]
];

const foodImageLibrary = [
  {
    keywords: ["biryani", "pulao"],
    image: commonsImage("Hyderabadi Biryani.jpg")
  },
  {
    keywords: ["dosa", "uttapam", "pesarattu"],
    image: commonsImage("Masala dosa (96279).jpg")
  },
  {
    keywords: ["idli", "vada", "pongal", "tiffin"],
    image: commonsImage("Idli vada in sambar.jpg")
  },
  {
    keywords: ["kebab", "tikka", "tandoor", "chaap"],
    image: commonsImage("Vegetarian kebab platter.jpg")
  },
  {
    keywords: ["butter chicken", "curry", "lababdar", "dal", "nihari", "chettinad", "kurma"],
    image: commonsImage("Chicken makhani.jpg")
  },
  {
    keywords: ["roll", "frankie", "wrap", "kathi"],
    image: commonsImage("Chicken Kathi Roll (5646735923).jpg")
  },
  {
    keywords: ["pizza", "margherita"],
    image: commonsImage("Pizza Margherita (14703152728).jpg")
  },
  {
    keywords: ["pasta", "arrabbiata", "pesto"],
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["chaat", "pani puri", "puchka", "bhel", "ragda", "tikki", "jhalmuri", "kabli"],
    image: commonsImage("Pani Puri .jpg")
  },
  {
    keywords: ["burger", "fries"],
    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["sushi", "maki"],
    image: commonsImage("Sushi platter.jpg")
  },
  {
    keywords: ["ramen", "miso"],
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["pav", "vada pav", "misal", "sandwich", "bhaji", "dabeli"],
    image: commonsImage("Vada Pav.jpg")
  },
  {
    keywords: ["thali", "meals", "bhakri", "luchi"],
    image: commonsImage("'1' Thali Indian Food.jpg")
  },
  {
    keywords: ["parotta", "kothu", "idiyappam"],
    image:
      "https://images.unsplash.com/photo-1630409346824-4f0e7b080087?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["fish", "prawn", "seafood", "shorshe", "fry"],
    image:
      "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["coffee", "chai", "chaas", "lassi", "lemonade", "shake", "milk", "cooler", "soda", "solkadhi"],
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80"
  },
  {
    keywords: ["dessert", "sweet", "meetha", "payasam", "jamun", "phirni", "tiramisu", "mousse", "custard", "cake", "pak", "rabdi", "doi", "rosogolla", "rasgulla"],
    image: commonsImage("Gulab Jamun.jpg")
  },
  {
    keywords: ["khichdi", "bhat", "pulao", "bagara"],
    image: commonsImage("Bagara Rice South Indian Style.jpg")
  },
  {
    keywords: ["tofu bowl", "teriyaki", "bento", "crispy corn"],
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
  }
];

const trackingSteps = [
  "Order received",
  "Chef is firing it up",
  "Packed with care",
  "Rider on the way",
  "Arriving now"
];

const cancelReasons = [
  "Changed my mind",
  "Ordered by mistake",
  "ETA is too long",
  "Need to change address",
  "Found a better option"
];

const googleMapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function distanceKm(a, b) {
  const latDiff = a.lat - b.lat;
  const lonDiff = a.lon - b.lon;
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111;
}

function nearestCity(coords) {
  return cityCoordinates.reduce((nearest, candidate) => {
    const distance = distanceKm(coords, candidate);
    return distance < nearest.distance ? { ...candidate, distance } : nearest;
  }, { ...cityCoordinates[0], distance: Number.POSITIVE_INFINITY }).city;
}

function cityPoint(city) {
  const candidate = cityCoordinates.find((item) => item.city === city) || cityCoordinates[0];
  return {
    lat: candidate.lat,
    lon: candidate.lon
  };
}

function mapPointWithinCity(city, seed) {
  const center = cityPoint(city);
  const latSpread = ((seed.length * 17) % 100) / 1000 - 0.05;
  const lonSpread = ((seed.length * 29) % 100) / 1000 - 0.05;

  return {
    lat: center.lat + latSpread,
    lon: center.lon + lonSpread
  };
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mercatorY(lat) {
  const safeLat = clampNumber(lat, -85, 85);
  const radians = safeLat * (Math.PI / 180);
  return Math.log(Math.tan(Math.PI / 4 + radians / 2));
}

function routeBounds(points) {
  const safePoints = points.length ? points : [{ lat: 0, lon: 0 }];
  const latitudes = safePoints.map((point) => point.lat);
  const longitudes = safePoints.map((point) => point.lon);
  const latMinRaw = Math.min(...latitudes);
  const latMaxRaw = Math.max(...latitudes);
  const lonMinRaw = Math.min(...longitudes);
  const lonMaxRaw = Math.max(...longitudes);
  const latSpan = Math.max(0.02, latMaxRaw - latMinRaw);
  const lonSpan = Math.max(0.02, lonMaxRaw - lonMinRaw);
  const latPad = latSpan * 0.22;
  const lonPad = lonSpan * 0.22;

  return {
    latMin: clampNumber(latMinRaw - latPad, -85, 85),
    latMax: clampNumber(latMaxRaw + latPad, -85, 85),
    lonMin: lonMinRaw - lonPad,
    lonMax: lonMaxRaw + lonPad
  };
}

function mapOverlayPosition(point, bounds) {
  const lonRange = Math.max(0.000001, bounds.lonMax - bounds.lonMin);
  const mercatorMin = mercatorY(bounds.latMin);
  const mercatorMax = mercatorY(bounds.latMax);
  const mercatorRange = Math.max(0.000001, mercatorMax - mercatorMin);
  const normalizedX = clampNumber((point.lon - bounds.lonMin) / lonRange, 0, 1);
  const normalizedY = clampNumber(
    1 - (mercatorY(point.lat) - mercatorMin) / mercatorRange,
    0,
    1
  );

  return {
    x: 8 + normalizedX * 84,
    y: 10 + normalizedY * 80
  };
}

function routePath(points, bounds) {
  return points
    .map((point, index) => {
      const position = mapOverlayPosition(point, bounds);
      return `${index === 0 ? "M" : "L"} ${position.x.toFixed(2)} ${position.y.toFixed(2)}`;
    })
    .join(" ");
}

function routeDistance(points) {
  if (points.length < 2) {
    return 0;
  }

  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += distanceKm(points[index - 1], points[index]);
  }

  return total;
}

function pointOnRoute(points, progress) {
  if (!points.length) {
    return { lat: 0, lon: 0 };
  }

  if (points.length === 1 || progress <= 0) {
    return points[0];
  }

  if (progress >= 1) {
    return points[points.length - 1];
  }

  const segmentLengths = [];
  let totalDistance = 0;

  for (let index = 1; index < points.length; index += 1) {
    const segmentDistance = distanceKm(points[index - 1], points[index]);
    segmentLengths.push(segmentDistance);
    totalDistance += segmentDistance;
  }

  if (!totalDistance) {
    return points[points.length - 1];
  }

  let targetDistance = totalDistance * progress;
  for (let index = 1; index < points.length; index += 1) {
    const segmentDistance = segmentLengths[index - 1];
    if (targetDistance <= segmentDistance || index === points.length - 1) {
      const start = points[index - 1];
      const end = points[index];
      const ratio = segmentDistance ? clampNumber(targetDistance / segmentDistance, 0, 1) : 1;

      return {
        lat: start.lat + (end.lat - start.lat) * ratio,
        lon: start.lon + (end.lon - start.lon) * ratio
      };
    }

    targetDistance -= segmentDistance;
  }

  return points[points.length - 1];
}

function googleDirectionsEmbedUrl(origin, destination) {
  if (!googleMapsApiKey) {
    return "";
  }

  const params = new URLSearchParams({
    key: googleMapsApiKey,
    origin: `${origin.lat},${origin.lon}`,
    destination: `${destination.lat},${destination.lon}`,
    mode: "driving"
  });

  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

function googlePlaceEmbedUrl(point, zoom = 13) {
  if (!googleMapsApiKey) {
    return "";
  }

  const params = new URLSearchParams({
    key: googleMapsApiKey,
    q: `${point.lat},${point.lon}`,
    zoom: String(zoom)
  });

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

function googleMapsFallbackEmbedUrl(point, zoom = 13) {
  return `https://maps.google.com/maps?q=${point.lat},${point.lon}&z=${zoom}&output=embed`;
}

function openStreetMapEmbedUrl(bounds, markerPoint) {
  const params = new URLSearchParams({
    bbox: `${bounds.lonMin.toFixed(6)},${bounds.latMin.toFixed(6)},${bounds.lonMax.toFixed(6)},${bounds.latMax.toFixed(6)}`,
    layer: "mapnik"
  });

  if (markerPoint) {
    params.set("marker", `${markerPoint.lat.toFixed(6)},${markerPoint.lon.toFixed(6)}`);
  }

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

function onlineDishImage(dishName, sectionName) {
  const tags = `${dishName} ${sectionName} food`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, ",");
  const lock = Array.from(`${dishName}-${sectionName}`.toLowerCase()).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 10000,
    7
  );

  return `https://loremflickr.com/900/600/${tags || "food,dish"}?lock=${lock}`;
}

function imageForDish(dishName, sectionName) {
  const lookup = `${dishName} ${sectionName}`.toLowerCase();
  const exactMatch = exactDishImages.find(([keyword]) => lookup.includes(keyword));
  if (exactMatch) {
    return commonsImage(exactMatch[1]);
  }

  const match = foodImageLibrary.find(({ keywords }) =>
    keywords.some((keyword) => lookup.includes(keyword))
  );

  if (match) {
    return match.image;
  }

  return onlineDishImage(dishName, sectionName);
}

function sourceForImage(image) {
  return image.includes("Special:FilePath/")
    ? image.replace("Special:FilePath/", "File:").replace(/\?width=\d+$/, "")
    : image;
}

function formatRating(value) {
  return Number(value).toFixed(1);
}

function buildLocalMenu(city, localRestaurants) {
  const cityMenus = cityMenuMap[city] || cityMenuMap.Hyderabad;
  const fallbackMenus = cityMenuMap.Hyderabad;

  return localRestaurants.flatMap((restaurant, restaurantIndex) => {
    const menuSections = cityMenus[restaurantIndex]
      || overflowMenuForRestaurant(restaurant)
      || cityMenus[restaurantIndex % cityMenus.length]
      || fallbackMenus[restaurantIndex % fallbackMenus.length];

    return menuSections.flatMap((section, sectionIndex) =>
      section.items.map((dishName, dishIndex) => ({
        id: `${city}-${restaurantIndex}-${sectionIndex}-${dishIndex}`,
        name: dishName,
        kitchen: restaurant.name,
        price: 149 + restaurantIndex * 55 + sectionIndex * 45 + dishIndex * 35,
        rating: Math.max(4.4, (restaurant.rating || 4.8) - dishIndex * 0.06),
        time: (restaurant.eta || "20-28 min").split("-")[0].trim(),
        category: section.section,
        image: imageForDish(dishName, section.section)
      }))
    );
  });
}

function App() {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedRestaurant, setSelectedRestaurant] = useState("All nearby");
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [cancelledOrderId, setCancelledOrderId] = useState("");
  const [cancelledReason, setCancelledReason] = useState("");
  const [showCancelPicker, setShowCancelPicker] = useState(false);
  const [cancelReason, setCancelReason] = useState(cancelReasons[0]);
  const [userCity, setUserCity] = useState("Hyderabad");
  const [userCoords, setUserCoords] = useState(() => cityPoint("Hyderabad"));
  const [routePoints, setRoutePoints] = useState([]);
  const [locationLabel, setLocationLabel] = useState("Detecting nearby restaurants");
  const [authView, setAuthView] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = window.localStorage.getItem(sessionStorageKey);
    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!orderStarted || progress >= 100) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setProgress((value) => Math.min(100, value + 4));
    }, 1300);
    return () => window.clearInterval(id);
  }, [orderStarted, progress]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLabel("Popular restaurants near Hyderabad");
      setUserCoords(cityPoint("Hyderabad"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const city = nearestCity({
          lat: coords.latitude,
          lon: coords.longitude
        });
        setUserCity(city);
        setUserCoords({ lat: coords.latitude, lon: coords.longitude });
        setLocationLabel(`Popular restaurants near ${city}`);
      },
      () => {
        setLocationLabel("Popular restaurants near Hyderabad");
        setUserCoords(cityPoint("Hyderabad"));
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 }
    );
  }, []);

  const localRestaurants = restaurants.map((restaurant, index) => ({
    ...restaurant,
    ...(cityRestaurantMap[userCity]?.[index] || {})
  }));
  const localMenu = buildLocalMenu(userCity, localRestaurants);
  const localRestaurantsWithMenu = localRestaurants.map((restaurant) => ({
    ...restaurant,
    menuCount: localMenu.filter((item) => item.kitchen === restaurant.name).length
  }));
  const restaurantOptions = ["All nearby", ...localRestaurants.map((item) => item.name)];
  const categories = ["All", ...new Set(localMenu.map((item) => item.category))];
  const filteredMenu = localMenu.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesRestaurant =
      selectedRestaurant === "All nearby" || item.kitchen === selectedRestaurant;
    const needle = `${item.name} ${item.kitchen} ${item.category}`.toLowerCase();
    return (
      matchesCategory &&
      matchesRestaurant &&
      needle.includes(query.toLowerCase())
    );
  });

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({
          ...localMenu.find((item) => item.id === id),
          quantity
        }))
        .filter((item) => item.name && item.quantity > 0),
    [cart, localMenu]
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = cartItems.length ? (subtotal > 799 ? 0 : 49) : 0;
  const deliveryLabel = !cartItems.length
    ? currency(0)
    : delivery === 0
      ? "Free"
      : currency(delivery);
  const serviceFee = cartItems.length ? 19 : 0;
  const total = subtotal + delivery + serviceFee;
  const hasActiveOrder = orderStarted && progress < 100;
  const hasCancelledOrder = !orderStarted && Boolean(cancelledOrderId);
  const activeStep = orderStarted
    ? Math.min(
        trackingSteps.length - 1,
        Math.floor(progress / (100 / trackingSteps.length))
      )
    : -1;
  const eta = orderStarted
    ? progress >= 100
      ? "Delivered"
      : `${Math.max(2, 24 - Math.floor(progress / 5))} min`
    : "Waiting";
  const trackedKitchenName =
    selectedRestaurant === "All nearby"
      ? cartItems[0]?.kitchen || localRestaurants[0]?.name || "Nearby kitchen"
      : selectedRestaurant;
  const restaurantPoint = mapPointWithinCity(userCity, trackedKitchenName);
  const destinationPoint = userCoords || cityPoint(userCity);
  const routeProgress = Math.min(1, Math.max(0, progress / 100));
  const defaultRoutePoints = [restaurantPoint, destinationPoint];
  const activeRoutePoints = routePoints.length > 1 ? routePoints : defaultRoutePoints;
  const overlayBounds = routeBounds(activeRoutePoints);
  const routeOverlayPath = routePath(activeRoutePoints, overlayBounds);
  const routeTravelPoint = pointOnRoute(activeRoutePoints, routeProgress);
  const routeDistanceKm = Math.max(0.4, routeDistance(activeRoutePoints));
  const routeCoveredKm = routeDistanceKm * routeProgress;
  const hasDeliveredOrder = orderStarted && progress >= 100;
  const mapFocusPoint = hasActiveOrder
    ? routeTravelPoint
    : hasCancelledOrder
      ? restaurantPoint
      : destinationPoint;
  const showLiveRider = orderStarted && !hasCancelledOrder;
  const riderMapPoint = hasActiveOrder ? routeTravelPoint : destinationPoint;
  const riderMapPosition = mapOverlayPosition(riderMapPoint, overlayBounds);
  const riderMapLabel = hasActiveOrder ? `${eta} away` : hasDeliveredOrder ? "Arrived" : "Waiting";
  const trackingMapUrl = showLiveRider
    ? openStreetMapEmbedUrl(overlayBounds, riderMapPoint)
    : googleMapsApiKey
      ? googlePlaceEmbedUrl(mapFocusPoint, hasCancelledOrder ? 12 : 13)
      : googleMapsFallbackEmbedUrl(mapFocusPoint, hasCancelledOrder ? 12 : 13);

  useEffect(() => {
    let cancelled = false;

    if (!orderStarted || hasCancelledOrder) {
      setRoutePoints([]);
      return undefined;
    }

    const fallbackRoute = [restaurantPoint, destinationPoint];
    setRoutePoints(fallbackRoute);

    async function loadDrivingRoute() {
      try {
        const url = new URL(
          `https://router.project-osrm.org/route/v1/driving/${restaurantPoint.lon},${restaurantPoint.lat};${destinationPoint.lon},${destinationPoint.lat}`
        );
        url.searchParams.set("overview", "full");
        url.searchParams.set("geometries", "geojson");

        const response = await fetch(url.toString());
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const coordinates = payload?.routes?.[0]?.geometry?.coordinates;
        if (!Array.isArray(coordinates)) {
          return;
        }

        const parsedPoints = coordinates
          .map((coordinate) => {
            if (!Array.isArray(coordinate) || coordinate.length < 2) {
              return null;
            }

            return {
              lon: Number(coordinate[0]),
              lat: Number(coordinate[1])
            };
          })
          .filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lon));

        if (!cancelled && parsedPoints.length > 1) {
          setRoutePoints(parsedPoints);
        }
      } catch {
        // Ignore route API failures and continue with fallback straight-line route.
      }
    }

    loadDrivingRoute();

    return () => {
      cancelled = true;
    };
  }, [
    orderStarted,
    hasCancelledOrder,
    restaurantPoint.lat,
    restaurantPoint.lon,
    destinationPoint.lat,
    destinationPoint.lon
  ]);

  function updateCart(id, delta) {
    setCart((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + delta)
    }));
  }

  function openRestaurantMenu(restaurantName) {
    setSelectedRestaurant(restaurantName);
    setActiveCategory("All");
    setQuery("");
    window.setTimeout(() => {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function startOrder() {
    if (!cartItems.length) {
      return;
    }

    if (!user) {
      setAuthView("login");
      return;
    }

    if (hasActiveOrder) {
      window.setTimeout(() => {
        document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
      return;
    }

    setOrderStarted(true);
    setProgress(3);
    setOrderId(`FF-${Math.floor(1000 + Math.random() * 9000)}`);
    setCancelledOrderId("");
    setCancelledReason("");
    setShowCancelPicker(false);
    setCancelReason(cancelReasons[0]);
    window.setTimeout(() => {
      document.getElementById("tracking")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function requestOrderCancellation() {
    if (!hasActiveOrder) {
      return;
    }

    setShowCancelPicker(true);
  }

  function confirmOrderCancellation() {
    if (!hasActiveOrder) {
      return;
    }

    const currentOrderId = orderId || "your current order";

    setCancelledOrderId(currentOrderId);
    setCancelledReason(cancelReason);
    setShowCancelPicker(false);
    setOrderStarted(false);
    setOrderId("");
    setProgress(0);
  }

  function keepCurrentOrder() {
    setShowCancelPicker(false);
  }

  function handleLoginSubmit(credentials) {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password.trim();

    if (!email.includes("@") || password.length < 6) {
      return { ok: false, message: "Enter a valid email and password." };
    }

    const users = readSavedUsers();
    const matched = users.find(
      (item) => item.email.toLowerCase() === email && item.password === password
    );

    if (!matched) {
      return { ok: false, message: "Account not found. Check credentials or sign up." };
    }

    const profile = {
      name: matched.name,
      email: matched.email,
      phone: matched.phone || ""
    };

    setUser(profile);
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(profile));
    setAuthView(null);
    return { ok: true };
  }

  function handleSignupSubmit(form) {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const phone = form.phone.trim();

    if (name.length < 2) {
      return { ok: false, message: "Please enter your full name." };
    }

    if (!email.includes("@")) {
      return { ok: false, message: "Please use a valid email address." };
    }

    if (password.length < 6) {
      return { ok: false, message: "Password must be at least 6 characters." };
    }

    const users = readSavedUsers();
    if (users.some((item) => item.email.toLowerCase() === email)) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const nextUsers = [...users, { name, email, password, phone }];
    writeSavedUsers(nextUsers);

    const profile = { name, email, phone };
    setUser(profile);
    window.localStorage.setItem(sessionStorageKey, JSON.stringify(profile));
    setAuthView(null);
    return { ok: true };
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(sessionStorageKey);
  }

  if (authView === "login") {
    return (
      <LoginPage
        onBack={() => setAuthView(null)}
        onOpenSignup={() => setAuthView("signup")}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  if (authView === "signup") {
    return (
      <SignupPage
        onBack={() => setAuthView(null)}
        onOpenLogin={() => setAuthView("login")}
        onSubmit={handleSignupSubmit}
      />
    );
  }

  return (
    <>
      <main>
      <ParticleBackground />
      <header className="nav">
        <a className="brand" href="#top" aria-label="FlashFeast home">
          <span className="brandMark">
            <Zap size={22} />
          </span>
          FlashFeast
        </a>
        <nav aria-label="Primary navigation">
          <a href="#restaurants">Restaurants</a>
          <a href="#menu">Menu</a>
          <a href="#tracking">Live tracking</a>
        </nav>
        <div className="navActions">
          {user ? (
            <div className="accountPill">
              <span>
                <User size={17} />
                {user.name}
              </span>
              <button onClick={logout} aria-label="Logout">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <>
              <button className="loginBtn" onClick={() => setAuthView("login")}>
                <LogIn size={17} />
                Login
              </button>
              <button className="signupBtn" onClick={() => setAuthView("signup")}>
                <UserPlus size={17} />
                Sign up
              </button>
            </>
          )}
          <a className="navCta" href="#checkout">
            <ShoppingBag size={18} />
            {cartItems.length}
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="heroBg" />
        <div className="heroContent">
          <div className="eyebrow">
            <MapPin size={18} />
            {locationLabel}
          </div>
          <h1>Crave it. Track it. Taste it while it is still sizzling.</h1>
          <p>
            Order from top kitchens around {userCity}, watch your courier move in real time,
            and get chef-hot food delivered with delivery estimates that update
            as your order moves.
          </p>
          <div className="heroActions">
            <a href="#menu" className="primaryBtn">
              Order now
              <ChevronRight size={20} />
            </a>
            <a href="#tracking" className="secondaryBtn">
              <Navigation size={19} />
              Track live
            </a>
          </div>
          <div className="heroStats" aria-label="FlashFeast service stats">
            <span>
              <strong>18 min</strong>
              avg arrival
            </span>
            <span>
              <strong>4.9</strong>
              diner rating
            </span>
            <span>
              <strong>24/7</strong>
              concierge
            </span>
          </div>
        </div>

        <div className="heroStage" aria-label="Animated delivery preview">
          <div className="dishOrbit">
            <img
              src="https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=700&q=80"
              alt="Fresh bowl meal"
            />
          </div>
          <div className="floatingCard etaCard">
            <Clock3 size={19} />
            <span>
              <strong>12 min</strong>
              to your door
            </span>
          </div>
          <div className="floatingCard riderCard">
            <Bike size={20} />
            <span>
              <strong>Arya</strong>
              picking up
            </span>
          </div>
          <div className="pulseRing" />
        </div>
      </section>

      <section className="featureStrip" aria-label="Delivery promises">
        {[
          [Flame, "Hot-drop packaging"],
          [ShieldCheck, "Verified kitchens"],
          [WalletCards, "UPI, card, wallet"],
          [Phone, "Human support"]
        ].map(([Icon, label]) => (
          <div className="feature" key={label}>
            <Icon size={21} />
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="restaurants">
        <div className="sectionHead">
          <span className="kicker">{locationLabel}</span>
          <h2>Local restaurants moving fast tonight</h2>
        </div>
        <div className="restaurantGrid">
          {localRestaurantsWithMenu.map((restaurant, index) => (
            <article
              className="restaurantCard"
              style={{ "--accent": restaurant.accent, "--delay": `${index * 90}ms` }}
              key={restaurant.name}
            >
              <img src={restaurant.image} alt={`${restaurant.name} food`} />
              <div className="restaurantOverlay">
                <span>{restaurant.tag}</span>
                <h3>{restaurant.name}</h3>
                <div>
                  <Star size={16} fill="currentColor" />
                  {formatRating(restaurant.rating)}
                  <Clock3 size={16} />
                  {restaurant.eta}
                  <Utensils size={16} />
                  {restaurant.menuCount} items
                </div>
                <button
                  className="restaurantMenuBtn"
                  onClick={() => openRestaurantMenu(restaurant.name)}
                >
                  View menu
                  <ChevronRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="menuSection" id="menu">
        <div className="sectionHead">
          <span className="kicker">
            {selectedRestaurant === "All nearby"
              ? `Menus near ${userCity}`
              : `${selectedRestaurant} menu`}
          </span>
          <h2>
            {selectedRestaurant === "All nearby"
              ? "Build your perfect delivery"
              : "Order from this local favourite"}
          </h2>
        </div>
        <div className="menuLayout">
          <div className="menuPanel">
            <div className="searchBar">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search food, kitchen, or craving"
                aria-label="Search menu"
              />
            </div>
            <div className="tabs" aria-label="Menu categories">
              {restaurantOptions.map((restaurantName) => (
                <button
                  className={restaurantName === selectedRestaurant ? "active" : ""}
                  onClick={() => setSelectedRestaurant(restaurantName)}
                  key={restaurantName}
                >
                  {restaurantName}
                </button>
              ))}
            </div>
            <div className="tabs categoryTabs" aria-label="Food categories">
              {categories.map((category) => (
                <button
                  className={category === activeCategory ? "active" : ""}
                  onClick={() => setActiveCategory(category)}
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="menuGrid">
              {filteredMenu.map((item) => (
                <article className="menuCard" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="menuInfo">
                    <span>{item.kitchen}</span>
                    <h3>{item.name}</h3>
                    <div className="menuMeta">
                      <span>
                        <Star size={15} fill="currentColor" />
                        {formatRating(item.rating)}
                      </span>
                      <span>
                        <Clock3 size={15} />
                        {item.time}
                      </span>
                    </div>
                    <a
                      className="imageSource"
                      href={sourceForImage(item.image)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open matched photo
                    </a>
                    <div className="menuFooter">
                      <strong>{currency(item.price)}</strong>
                      <div className="quantity">
                        <button
                          onClick={() => updateCart(item.id, -1)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Minus size={15} />
                        </button>
                        <span>{cart[item.id] || 0}</span>
                        <button
                          onClick={() => updateCart(item.id, 1)}
                          aria-label={`Add ${item.name}`}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="checkout" id="checkout">
            <div className="checkoutTop">
              <span className="bagIcon">
                <ShoppingBag size={22} />
              </span>
              <div>
                <span>Current order</span>
                <h3>{cartItems.length ? "Ready to roll" : "Cart is waiting"}</h3>
              </div>
            </div>
            <div className="cartList">
              {cartItems.map((item) => (
                <div className="cartItem" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} x {currency(item.price)}
                    </span>
                  </div>
                  <b>{currency(item.quantity * item.price)}</b>
                </div>
              ))}
            </div>
            <div className="totals">
              <span>
                Subtotal <b>{currency(subtotal)}</b>
              </span>
              <span>
                Delivery <b>{deliveryLabel}</b>
              </span>
              <span>
                Service <b>{currency(serviceFee)}</b>
              </span>
              <strong>
                Total <b>{currency(total)}</b>
              </strong>
            </div>
            <button
              className="checkoutBtn"
              onClick={startOrder}
              disabled={!cartItems.length}
            >
              {user ? <IndianRupee size={19} /> : <LogIn size={19} />}
              {!user
                ? "Login to place order"
                : hasActiveOrder
                  ? "Track current order"
                  : hasCancelledOrder
                    ? "Place a new order"
                    : "Place order & track"}
            </button>
          </aside>
        </div>
      </section>

      <section className="tracking" id="tracking">
        <div className="sectionHead">
          <span className="kicker">Realtime order tracking</span>
          <h2>
            {orderStarted
              ? "Your food is moving in realtime"
              : hasCancelledOrder
                ? "Order cancelled successfully"
              : "Place an order to unlock live tracking"}
          </h2>
        </div>
        <div className="trackingLayout">
          <div
            className={
              orderStarted
                ? "mapPanel"
                : hasCancelledOrder
                  ? "mapPanel cancelled"
                  : "mapPanel idle"
            }
          >
            <iframe
              className="mapFrame"
              src={trackingMapUrl}
              title={`Tracking map for ${trackedKitchenName} in ${userCity}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {showLiveRider && (
              <svg className="mapRouteOverlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path className="mapRouteTrail" d={routeOverlayPath} pathLength="100" />
                <path
                  className="mapRouteProgress"
                  d={routeOverlayPath}
                  pathLength="100"
                  style={{ strokeDasharray: `${Math.max(1.5, routeProgress * 100)} 100` }}
                />
              </svg>
            )}
            <div className="mapBadge restaurant" aria-label="Restaurant pickup point">
              <ChefHat size={16} />
              <span>{trackedKitchenName}</span>
            </div>
            <div className="mapBadge destination" aria-label="Delivery destination">
              <MapPin size={16} />
              <span>{hasCancelledOrder ? `${userCity} area` : "Your location"}</span>
            </div>
            {showLiveRider && (
              <div
                className={hasActiveOrder ? "mapLiveRider" : "mapLiveRider arrived"}
                style={{
                  "--rider-x": `${riderMapPosition.x}%`,
                  "--rider-y": `${riderMapPosition.y}%`
                }}
                aria-label={
                  hasActiveOrder
                    ? `Rider is ${Math.round(progress)} percent through the route`
                    : "Rider has arrived at your location"
                }
              >
                <span className="mapLivePulse" />
                <span className="mapLivePin">
                  <Bike size={16} />
                </span>
                <span className="mapLiveEta">{riderMapLabel}</span>
              </div>
            )}
            {hasActiveOrder && (
              <div className="mapRiderCard" aria-label="Rider route progress">
                <Bike size={18} />
                <span>
                  <strong>{Math.round(progress)}% route covered</strong>
                  {routeCoveredKm.toFixed(1)} km of {routeDistanceKm.toFixed(1)} km
                </span>
              </div>
            )}
            {!googleMapsApiKey && !showLiveRider && (
              <p className="mapApiHint">
                Add VITE_GOOGLE_MAPS_API_KEY in .env.local for Google directions mode.
              </p>
            )}
          </div>
          <div className="trackingPanel">
            <div
              className={
                orderStarted
                  ? "trackingStatus live"
                  : hasCancelledOrder
                    ? "trackingStatus cancelled"
                    : "trackingStatus"
              }
            >
              <span />
              {orderStarted
                ? progress >= 100
                  ? `${orderId} delivered`
                  : `${orderId} live now`
                : hasCancelledOrder
                  ? `${cancelledOrderId} cancelled`
                  : "Checkout starts the tracker"}
            </div>
            <div className="courier">
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80"
                alt="Courier Arya"
              />
              <div>
                <span>
                  {orderStarted
                    ? "Your rider"
                    : hasCancelledOrder
                      ? "Latest update"
                      : "Assigned after checkout"}
                </span>
                <h3>
                  {orderStarted
                    ? "Arya Mehta"
                    : hasCancelledOrder
                      ? "Order cancelled"
                      : "No active order"}
                </h3>
                <p>
                  {orderStarted
                    ? progress >= 100
                      ? "Delivered to your doorstep"
                      : `Arriving in ${eta}`
                    : hasCancelledOrder
                      ? "Your cancellation is confirmed. Refunds for prepaid orders start automatically."
                    : "Add your favourites and place the order to begin."}
                </p>
              </div>
              <button aria-label="Call courier" disabled={!hasActiveOrder}>
                <Phone size={18} />
              </button>
            </div>
            {hasActiveOrder && (
              <>
                <button className="cancelOrderBtn" onClick={requestOrderCancellation}>
                  Cancel this order
                </button>
                {showCancelPicker && (
                  <div className="cancelPicker" role="dialog" aria-label="Cancel order reason">
                    <label htmlFor="cancel-reason">Why are you cancelling?</label>
                    <select
                      id="cancel-reason"
                      value={cancelReason}
                      onChange={(event) => setCancelReason(event.target.value)}
                    >
                      {cancelReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    <div className="cancelPickerActions">
                      <button
                        className="cancelGhostBtn"
                        onClick={keepCurrentOrder}
                        type="button"
                      >
                        Keep order
                      </button>
                      <button
                        className="cancelConfirmBtn"
                        onClick={confirmOrderCancellation}
                        type="button"
                      >
                        Confirm cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            {hasCancelledOrder && (
              <p className="cancelNotice">
                {cancelledOrderId} was cancelled. Reason: {cancelledReason}. You can place a new
                order anytime.
              </p>
            )}
            <div className="steps">
              {trackingSteps.map((step, index) => (
                <div className={index <= activeStep ? "step done" : "step"} key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rewards">
        <div>
          <span className="kicker">FeastPass</span>
          <h2>Free delivery, priority couriers, and surprise chef drops.</h2>
        </div>
        <a className="primaryBtn" href="#menu">
          <Utensils size={19} />
          Start ordering
        </a>
      </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
