import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bike,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock3,
  IndianRupee,
  Leaf,
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
  Sparkles,
  Star,
  Utensils,
  User,
  UserPlus,
  Zap
} from "lucide-react";
import "./styles.css";
import appIcon from "./assets/app-icon.svg";

const usersStorageKey = "flashfeast-users";
const sessionStorageKey = "flashfeast-user";
const foodImageAssets = import.meta.glob("./assets/food/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default"
});
const fallbackFoodImage = Object.values(foodImageAssets)[0];
const restaurantLogoAssets = import.meta.glob(
  "./assets/restaurant-logos/*.{avif,jpg,jpeg,png,webp}",
  {
    eager: true,
    import: "default"
  }
);
const fallbackRestaurantLogo = Object.values(restaurantLogoAssets)[0];

function localFoodImage(fileName) {
  const direct = foodImageAssets[`./assets/food/${fileName}`];
  if (direct) {
    return direct;
  }

  const normalized = fileName.replace(/\s+/g, " ").trim();
  const match = Object.entries(foodImageAssets).find(([key]) =>
    key.endsWith(`/${normalized}`)
  );
  return match ? match[1] : fallbackFoodImage;
}

function localRestaurantLogo(fileName) {
  const direct = restaurantLogoAssets[`./assets/restaurant-logos/${fileName}`];
  if (direct) {
    return direct;
  }

  const normalized = fileName.replace(/\s+/g, " ").trim();
  const match = Object.entries(restaurantLogoAssets).find(([key]) =>
    key.endsWith(`/${normalized}`)
  );
  return match ? match[1] : fallbackRestaurantLogo || fallbackFoodImage;
}

function ParticleBackground() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, lastMove: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = 0;

    const maxDpr = 2;
    const baseSpeed = 1.2;
    const gravityRadius = 150;
    const gravityRadiusSq = gravityRadius * gravityRadius;
    const gravityStrength = 140;
    const noiseScale = 0.0022;
    const flowInfluence = 0.08;
    const flowInfluenceNear = 0.04;
    const maxSpeed = 3.2;
    const idleTimeout = 260;
    const margin = 12;

    const palette = [
      [122, 166, 144],
      [168, 201, 185],
      [201, 219, 206],
      [95, 132, 112]
    ];

    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i += 1) {
      p[i] = i;
    }
    for (let i = 255; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = p[i];
      p[i] = p[j];
      p[j] = swap;
    }
    for (let i = 0; i < 512; i += 1) {
      perm[i] = p[i & 255];
    }

    function fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function grad(hash, x, y) {
      const h = hash & 3;
      if (h === 0) return x + y;
      if (h === 1) return -x + y;
      if (h === 2) return x - y;
      return -x - y;
    }

    function noise2D(x, y) {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);

      const aa = perm[xi + perm[yi]];
      const ab = perm[xi + perm[yi + 1]];
      const ba = perm[xi + 1 + perm[yi]];
      const bb = perm[xi + 1 + perm[yi + 1]];

      const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
      const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
      return lerp(x1, x2, v);
    }

    const particles = [];

    function seedParticles() {
      particles.length = 0;
      const area = Math.max(1, width * height);
      const count = Math.min(240, Math.max(120, Math.floor(area / 9000)));
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * baseSpeed,
          vy: Math.sin(angle) * baseSpeed,
          size: 1 + Math.random() * 2,
          color
        });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      seedParticles();
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = event.clientX - rect.left;
      pointerRef.current.y = event.clientY - rect.top;
      pointerRef.current.active = true;
      pointerRef.current.lastMove = performance.now();
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    window.addEventListener("resize", resize);

    resize();

    let lastTime = performance.now();

    function tick(time) {
      const delta = Math.min(32, time - lastTime);
      lastTime = time;
      const pointer = pointerRef.current;
      if (pointer.active && time - pointer.lastMove > idleTimeout) {
        pointer.active = false;
      }

      const timeOffset = time * 0.00008;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const flowAngle = noise2D(
          particle.x * noiseScale + timeOffset,
          particle.y * noiseScale - timeOffset
        ) * Math.PI * 2;

        const targetVx = Math.cos(flowAngle) * baseSpeed;
        const targetVy = Math.sin(flowAngle) * baseSpeed;
        const influence = pointer.active ? flowInfluenceNear : flowInfluence;
        particle.vx += (targetVx - particle.vx) * influence;
        particle.vy += (targetVy - particle.vy) * influence;

        let opacity = 0.3;
        let distSq = Number.POSITIVE_INFINITY;
        if (pointer.active) {
          const dx = pointer.x - particle.x;
          const dy = pointer.y - particle.y;
          distSq = dx * dx + dy * dy;
          if (distSq < gravityRadiusSq) {
            const dist = Math.sqrt(distSq) || 1;
            const force = gravityStrength / (distSq + 60);
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
            particle.vx *= 0.88;
            particle.vy *= 0.88;
            opacity = 0.3 + (1 - dist / gravityRadius) * 0.4;
          }
        }

        const speed = Math.hypot(particle.vx, particle.vy) || 1;
        if (!pointer.active || distSq >= gravityRadiusSq) {
          particle.vx = (particle.vx / speed) * baseSpeed;
          particle.vy = (particle.vy / speed) * baseSpeed;
        } else if (speed > maxSpeed) {
          const scale = maxSpeed / speed;
          particle.vx *= scale;
          particle.vy *= scale;
        }

        particle.x += particle.vx * (delta / 16.6);
        particle.y += particle.vy * (delta / 16.6);

        if (particle.x < -margin) particle.x = width + margin;
        if (particle.x > width + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = height + margin;
        if (particle.y > height + margin) particle.y = -margin;

        const [r, g, b] = particle.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = window.requestAnimationFrame(tick);
    }

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="particleLayer" aria-hidden="true">
      <canvas ref={canvasRef} className="particleCanvas" />
    </div>
  );
}

function DeferredParticles({ enabled = true }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let cancelled = false;
    const reveal = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(reveal, { timeout: 1200 });
      return () => {
        cancelled = true;
        if (window.cancelIdleCallback) {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = window.setTimeout(reveal, 900);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  return ready ? <ParticleBackground /> : null;
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
      <DeferredParticles />
      <section className="authPage" aria-label="Login page">
        <div className="authCard authPageCard">
          <div className="authVisual">
            <span className="brandMark">
              <img src={appIcon} alt="FlashFeast" />
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
      <DeferredParticles />
      <section className="authPage" aria-label="Signup page">
        <div className="authCard authPageCard">
          <div className="authVisual">
            <span className="brandMark">
              <img src={appIcon} alt="FlashFeast" />
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
      image: localRestaurantLogo("paradise.avif"),
      imageFit: "contain"
    },
    {
      name: "Chutneys Express",
      tag: "Dosa & idli",
      eta: "18-25 min",
      image: localRestaurantLogo("chutneys.jpeg"),
      imageFit: "contain"
    },
    {
      name: "Shah Ghouse Kitchen",
      tag: "Kebabs & haleem",
      eta: "20-28 min",
      image: localRestaurantLogo("shah-ghouse.avif"),
      imageFit: "contain"
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
    image: localFoodImage("Paneer Tikka.jpeg")
  },
  {
    id: 2,
    name: "Crispy Chili Bao Box",
    kitchen: "Bao Bloom",
    price: 279,
    rating: 4.8,
    time: "22 min",
    category: "Asian",
    image: localFoodImage("Chilli Potato.jpeg")
  },
  {
    id: 3,
    name: "Smoked Burrata Pizza",
    kitchen: "Napoli Rush",
    price: 449,
    rating: 4.7,
    time: "16 min",
    category: "Pizza",
    image: localFoodImage("Paneer Majestic.jpeg")
  },
  {
    id: 4,
    name: "Mango Fire Sushi Set",
    kitchen: "Sora Kitchen",
    price: 529,
    rating: 4.9,
    time: "25 min",
    category: "Sushi",
    image: localFoodImage("Tofu Bowl.jpeg")
  },
  {
    id: 5,
    name: "Velvet Butter Chicken",
    kitchen: "Saffron Street",
    price: 399,
    rating: 4.9,
    time: "21 min",
    category: "Indian",
    image: localFoodImage("Butter Chicken.jpeg")
  },
  {
    id: 6,
    name: "Green Goddess Burger",
    kitchen: "Urban Grill",
    price: 299,
    rating: 4.6,
    time: "17 min",
    category: "Burgers",
    image: localFoodImage("Veg Crunch Burger.jpeg")
  }
];

const ingredientSlides = [
  {
    name: "Avocado",
    note: "Healthy fats",
    detail: "Creamy omega balance for steady, sustained energy.",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Citrus",
    note: "Vitamin C",
    detail: "Bright, immune-forward freshness in every squeeze.",
    image:
      "https://images.unsplash.com/photo-1502741126161-b048400d3c9b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Microgreens",
    note: "Phytonutrients",
    detail: "High-density greens that lift flavor without weight.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Harvest Bowl",
    note: "Plant protein",
    detail: "Balanced grains and legumes for clean, lasting fuel.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Berries",
    note: "Antioxidants",
    detail: "Natural sweetness with a fresh, bright finish.",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Olive oil",
    note: "Heart healthy",
    detail: "Cold-pressed richness that keeps flavors refined.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80"
  }
];

function commonsImage(fileName) {
  const query = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, ",");
  const safeQuery = query || "gourmet,food";
  const sig = Array.from(fileName).reduce(
    (acc, char) => (acc + char.charCodeAt(0)) % 1000,
    7
  );
  return `https://source.unsplash.com/900x700/?${safeQuery}&sig=${sig}`;
}

const exactDishImages = [
  ["pongal bowl", "Pongal Bowl.jpeg"],
  ["pongal vada", "Pongal Bowl.jpeg"],
  ["mini tiffin platter", "Mini Tiffin Platter.jpeg"],
  ["family tiffin box", "Mini Tiffin Platter.jpeg"],
  ["dosa coffee combo", "Dosa Coffee Combo.jpeg"],
  ["filter coffee", "Filter Coffee.jpeg"],
  ["degree coffee", "Filter Coffee.jpeg"],
  ["badam milk", "Badam Milk.jpeg"],
  ["mutton seekh kebab", "Mutton Sheek Kabbab.jpeg"],
  ["chicken malai kebab", "Chicken Malai Kabbab.jpeg"],
  ["haleem bowl", "Haleem bowl.jpeg"],
  ["special mutton haleem", "Mutton Haleem Special.jpeg"],
  ["paneer rumali roll", "Paneer Rumali Roll.jpeg"],
  ["egg paratha roll", "Egg Paratha roll.jpeg"],
  ["egg kathi roll", "Egg Kathi roll.jpeg"],
  ["nalli nihari", "Nalli Nihari.jpeg"],
  ["dalcha", "Dalcha.jpeg"],
  ["raita bowl", "Raita Bowl.jpeg"],
  ["bagara rice", "Bagara Rice.jpeg"],
  ["baggara rice", "Baggara Rice.jpeg"],
  ["double ka meetha", "Double ka Meetha.jpeg"],
  ["qubani ka meetha", "Qubani ka Meetha.jpeg"],
  ["khubani ka meetha", "Qubani ka Meetha.jpeg"],
  ["chicken 65", "Chicken 65.jpeg"],
  ["apollo fish", "Apollo Fish.jpeg"],
  ["paneer majestic", "Paneer Majestic.jpeg"],
  ["mirchi ka salan", "Mirchi Ka Salan.jpeg"],
  ["hari mirchi ka salan", "Mirchi Ka Salan.jpeg"],
  ["dum chicken biryani", "Dum Chicken Biriyani.jpeg"],
  ["chicken biryani", "Dum Chicken Biriyani.jpeg"],
  ["mutton biryani", "Mutton Biriyani.jpeg"],
  ["paneer biryani", "Paneer Biriyani.jpeg"],
  ["egg biryani", "Egg Biriyani.jpeg"],
  ["andhra chicken biryani", "Dum Chicken Biriyani.jpeg"],
  ["masala dosa", "Masala Dosa.jpeg"],
  ["benne masala dosa", "Masala Dosa.jpeg"],
  ["ghee karam dosa", "Ghee Karam Dosa.jpeg"],
  ["pesarattu upma", "Pesarattu Upma.jpeg"],
  ["onion rava dosa", "Onion Rava dosa.jpeg"],
  ["rava dosa", "Onion Rava dosa.jpeg"],
  ["idli sambar box", "Idli Sambar box.jpeg"],
  ["idli sambar", "Idli Sambar box.jpeg"],
  ["medu vada", "Medu Vada.jpeg"],
  ["thatte idli", "Idli Sambar box.jpeg"],
  ["idli", "Idli Sambar box.jpeg"],
  ["vada sambar", "Idli Sambar box.jpeg"],
  ["pani puri", "Chilli Potato.jpeg"],
  ["puchka", "Chilli Potato.jpeg"],
  ["jhalmuri", "Chilli Potato.jpeg"],
  ["aloo kabli", "Chilli Potato.jpeg"],
  ["ragda pattice", "Chilli Potato.jpeg"],
  ["dahi sev puri", "Chilli Potato.jpeg"],
  ["bhel puri", "Chilli Potato.jpeg"],
  ["samosa chaat", "Chilli Potato.jpeg"],
  ["vada pav", "Veg Crunch Burger.jpeg"],
  ["misal pav", "Veg Crunch Burger.jpeg"],
  ["dabeli", "Veg Crunch Burger.jpeg"],
  ["pav bhaji", "Veg Crunch Burger.jpeg"],
  ["masale bhat", "Baggara Rice.jpeg"],
  ["butter chicken", "Butter Chicken.jpeg"],
  ["chettinad chicken", "Butter Chicken.jpeg"],
  ["paneer tikka", "Paneer Tikka.jpeg"],
  ["paneer chilli", "Paneer Tikka.jpeg"],
  ["paneer chaat", "Paneer Tikka.jpeg"],
  ["kathi roll", "Chicken Kathi Roll.jpeg"],
  ["chicken roll", "Chicken Kathi Roll.jpeg"],
  ["rumali chicken roll", "Rumali chicken Roll.jpeg"],
  ["paneer roll", "Paneer Kathi Roll.jpeg"],
  ["egg roll", "Egg Kathi roll.jpeg"],
  ["frankie", "Chicken Kathi Roll.jpeg"],
  ["gulab jamun", "Double ka Meetha.jpeg"],
  ["thali", "Mini Tiffin Platter.jpeg"],
  ["luchi", "Mini Tiffin Platter.jpeg"],
  ["sabudana khichdi", "Mini Tiffin Platter.jpeg"],
  ["pithla bhakri", "Mini Tiffin Platter.jpeg"],
  ["kothimbir vadi", "Mini Tiffin Platter.jpeg"],
  ["steamed rice", "Veg Pulav.jpeg"],
  ["veg pulao", "Veg Pulav.jpeg"],
  ["basanti pulao", "Veg Pulav.jpeg"],
  ["pizza", "Paneer Majestic.jpeg"],
  ["garlic bread", "Paneer Majestic.jpeg"],
  ["smash burger", "Smash Burger.jpeg"],
  ["crispy chicken burger", "Crispy Chicken Burger.jpeg"],
  ["paneer makhani burger", "Paneer Makhni Burger.jpeg"],
  ["veg crunch burger", "Veg Crunch Burger.jpeg"],
  ["loaded masala fries", "Loaded Masala Fries.jpeg"],
  ["peri peri fries", "Peri Peri Fries.jpeg"],
  ["cheese fries", "Cheese Fries.jpeg"],
  ["sushi", "Tofu Bowl.jpeg"],
  ["teriyaki chicken bowl", "Teriyaki Chicken Bowl.jpeg"],
  ["tofu bowl", "Tofu Bowl.jpeg"],
  ["curd rice bowl", "Curd Rice Bowl.jpeg"],
  ["pulihora rice bowl", "Pulihora Rice Bowl.jpeg"],
  ["lemon rice", "Lemon Rice.jpeg"],
  ["edamame", "Edamamme.jpeg"],
  ["chilli potato", "Chilli Potato.jpeg"],
  ["masala soda", "Masala Soda.jpeg"],
  ["lemon soda", "lemon Soda.jpeg"],
  ["sweet lassi", "Lassi.jpeg"],
  ["cold coffee", "Cold Coffee Shake.jpeg"],
  ["oreo shake", "Oreo Shake.jpeg"],
  ["chocolate shake", "Chocolate Shake.jpeg"],
  ["loaded fries", "Loaded Masala Fries.jpeg"]
];

const foodImageLibrary = [
  {
    keywords: ["biryani", "pulao"],
    image: localFoodImage("Dum Chicken Biriyani.jpeg")
  },
  {
    keywords: ["dosa", "uttapam", "pesarattu"],
    image: localFoodImage("Masala Dosa.jpeg")
  },
  {
    keywords: ["idli", "vada", "pongal", "tiffin"],
    image: localFoodImage("Idli Sambar box.jpeg")
  },
  {
    keywords: ["kebab", "tikka", "tandoor", "chaap"],
    image: localFoodImage("Chicken Malai Kabbab.jpeg")
  },
  {
    keywords: ["butter chicken", "curry", "lababdar", "dal", "nihari", "chettinad", "kurma"],
    image: localFoodImage("Butter Chicken.jpeg")
  },
  {
    keywords: ["roll", "frankie", "wrap", "kathi"],
    image: localFoodImage("Chicken Kathi Roll.jpeg")
  },
  {
    keywords: ["pizza", "margherita", "pasta", "arrabbiata", "pesto"],
    image: localFoodImage("Paneer Majestic.jpeg")
  },
  {
    keywords: ["chaat", "pani puri", "puchka", "bhel", "ragda", "tikki", "jhalmuri", "kabli"],
    image: localFoodImage("Chilli Potato.jpeg")
  },
  {
    keywords: ["burger", "fries"],
    image: localFoodImage("Smash Burger.jpeg")
  },
  {
    keywords: ["sushi", "maki", "ramen", "miso"],
    image: localFoodImage("Tofu Bowl.jpeg")
  },
  {
    keywords: ["pav", "vada pav", "misal", "sandwich", "bhaji", "dabeli"],
    image: localFoodImage("Veg Crunch Burger.jpeg")
  },
  {
    keywords: ["thali", "meals", "bhakri", "luchi"],
    image: localFoodImage("Mini Tiffin Platter.jpeg")
  },
  {
    keywords: ["parotta", "kothu", "idiyappam"],
    image: localFoodImage("Rumali chicken Roll.jpeg")
  },
  {
    keywords: ["fish", "prawn", "seafood", "shorshe", "fry"],
    image: localFoodImage("Apollo Fish.jpeg")
  },
  {
    keywords: ["coffee", "chai", "chaas", "lassi", "lemonade", "shake", "milk", "cooler", "soda", "solkadhi"],
    image: localFoodImage("Lassi.jpeg")
  },
  {
    keywords: ["dessert", "sweet", "meetha", "payasam", "jamun", "phirni", "tiramisu", "mousse", "custard", "cake", "pak", "rabdi", "doi", "rosogolla", "rasgulla"],
    image: localFoodImage("Double ka Meetha.jpeg")
  },
  {
    keywords: ["khichdi", "bhat", "pulao", "bagara"],
    image: localFoodImage("Bagara Rice.jpeg")
  },
  {
    keywords: ["tofu bowl", "teriyaki", "bento", "crispy corn"],
    image: localFoodImage("Teriyaki Chicken Bowl.jpeg")
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
  return localFoodImage("Veg Pulav.jpeg");
}

function imageForDish(dishName, sectionName) {
  const lookup = `${dishName} ${sectionName}`.toLowerCase();
  const exactMatch = exactDishImages.find(([keyword]) => lookup.includes(keyword));
  if (exactMatch) {
    return localFoodImage(exactMatch[1]);
  }

  const match = foodImageLibrary.find(({ keywords }) =>
    keywords.some((keyword) => lookup.includes(keyword))
  );

  if (match) {
    return match.image;
  }

  return onlineDishImage(dishName, sectionName);
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
  const deferredQuery = useDeferredValue(query);
  const [activeIngredient, setActiveIngredient] = useState(0);
  const [sliderPaused, setSliderPaused] = useState(false);
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
  const [trackingVisible, setTrackingVisible] = useState(false);
  const trackingRef = useRef(null);
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
    if (sliderPaused) {
      return undefined;
    }

    const id = window.setInterval(() => {
      setActiveIngredient((value) => (value + 1) % ingredientSlides.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [sliderPaused]);

  useEffect(() => {
    const heroAssets = [
      appIcon,
      ingredientSlides[0]?.image,
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2200&q=80"
    ].filter(Boolean);

    const links = heroAssets.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, []);

  useEffect(() => {
    const node = trackingRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setTrackingVisible(true);
      return undefined;
    }

    let didCancel = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          if (!didCancel) {
            setTrackingVisible(true);
          }
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px" }
    );

    observer.observe(node);
    return () => {
      didCancel = true;
      observer.disconnect();
    };
  }, []);

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

  const localRestaurants = useMemo(
    () =>
      restaurants.map((restaurant, index) => ({
        ...restaurant,
        ...(cityRestaurantMap[userCity]?.[index] || {})
      })),
    [userCity]
  );
  const localMenu = useMemo(
    () => buildLocalMenu(userCity, localRestaurants),
    [userCity, localRestaurants]
  );
  const localRestaurantsWithMenu = useMemo(
    () =>
      localRestaurants.map((restaurant) => ({
        ...restaurant,
        menuCount: localMenu.filter((item) => item.kitchen === restaurant.name).length
      })),
    [localMenu, localRestaurants]
  );
  const restaurantOptions = useMemo(
    () => ["All nearby", ...localRestaurants.map((item) => item.name)],
    [localRestaurants]
  );
  const categories = useMemo(
    () => ["All", ...new Set(localMenu.map((item) => item.category))],
    [localMenu]
  );
  const filteredMenu = useMemo(() => {
    const needle = deferredQuery.toLowerCase();
    return localMenu.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesRestaurant =
        selectedRestaurant === "All nearby" || item.kitchen === selectedRestaurant;
      const searchText = `${item.name} ${item.kitchen} ${item.category}`.toLowerCase();
      return matchesCategory && matchesRestaurant && searchText.includes(needle);
    });
  }, [activeCategory, deferredQuery, localMenu, selectedRestaurant]);
  const ingredientStep = 360 / ingredientSlides.length;
  const activeIngredientData = ingredientSlides[activeIngredient];
  const stepIngredient = (direction) => {
    setActiveIngredient((value) =>
      (value + direction + ingredientSlides.length) % ingredientSlides.length
    );
  };

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
  const shouldLoadTracking = trackingVisible || hasActiveOrder || hasCancelledOrder;
  const trackingMapUrl = shouldLoadTracking
    ? showLiveRider
      ? openStreetMapEmbedUrl(overlayBounds, riderMapPoint)
      : googleMapsApiKey
        ? googlePlaceEmbedUrl(mapFocusPoint, hasCancelledOrder ? 12 : 13)
        : googleMapsFallbackEmbedUrl(mapFocusPoint, hasCancelledOrder ? 12 : 13)
    : "";

  useEffect(() => {
    let cancelled = false;

    if (!orderStarted || hasCancelledOrder || !shouldLoadTracking) {
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
    destinationPoint.lon,
    shouldLoadTracking
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
      <DeferredParticles />
      <header className="nav">
        <a className="brand" href="#top" aria-label="FlashFeast home">
          <span className="brandMark">
            <img src={appIcon} alt="FlashFeast" />
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
          <h1>Clean energy meals, crafted fresh and delivered fast.</h1>
          <p>
            FlashFeast curates macro-balanced bowls and gourmet plates around {userCity},
            with real-time freshness tracking and chef-led kitchens focused on clean fuel.
          </p>
          <div className="heroActions">
            <a href="#menu" className="primaryBtn">
              Build a clean order
              <ChevronRight size={20} />
            </a>
            <a href="#tracking" className="secondaryBtn">
              <Navigation size={19} />
              Track freshness
            </a>
          </div>
          <div className="heroStats" aria-label="FlashFeast service stats">
            <span>
              <strong>92%</strong>
              fresh sourcing
            </span>
            <span>
              <strong>28g</strong>
              avg protein
            </span>
            <span>
              <strong>15 min</strong>
              avg delivery
            </span>
          </div>
        </div>

        <div className="heroStage" aria-label="Fresh ingredient carousel">
          <div
            className="ingredientStage"
            onPointerEnter={() => setSliderPaused(true)}
            onPointerLeave={() => setSliderPaused(false)}
          >
            <div className="ingredientHalo" aria-hidden="true" />
            <div className="ingredientRingWrap">
              <div
                className="ingredientRing"
                style={{
                  "--active-index": activeIngredient,
                  "--step": `${ingredientStep}deg`
                }}
              >
                {ingredientSlides.map((ingredient, index) => (
                  <button
                    className={`ingredientCard${index === activeIngredient ? " active" : ""}`}
                    style={{ "--i": index }}
                    key={ingredient.name}
                    type="button"
                    onClick={() => setActiveIngredient(index)}
                    aria-pressed={index === activeIngredient}
                  >
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      loading={index === activeIngredient ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="ingredientLabel">
                      <span>{ingredient.name}</span>
                      <small>{ingredient.note}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="ingredientInfo" aria-live="polite">
              <span className="ingredientKicker">Ingredient focus</span>
              <h3>{activeIngredientData.name}</h3>
              <p>{activeIngredientData.detail}</p>
            </div>
            <div className="ingredientControls">
              <button
                className="ingredientArrow"
                type="button"
                onClick={() => stepIngredient(-1)}
                aria-label="Previous ingredient"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="ingredientDots" aria-label="Ingredient slider">
                {ingredientSlides.map((ingredient, index) => (
                  <button
                    key={ingredient.name}
                    className={
                      index === activeIngredient ? "ingredientDot active" : "ingredientDot"
                    }
                    type="button"
                    onClick={() => setActiveIngredient(index)}
                    aria-label={`Show ${ingredient.name}`}
                    aria-pressed={index === activeIngredient}
                  />
                ))}
              </div>
              <button
                className="ingredientArrow"
                type="button"
                onClick={() => stepIngredient(1)}
                aria-label="Next ingredient"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="floatingCard nutrientCard">
              <Leaf size={18} />
              <span>
                <strong>Plant-forward</strong>
                clean macros
              </span>
            </div>
            <div className="floatingCard glowCard">
              <Sparkles size={18} />
              <span>
                <strong>Chef finish</strong>
                plated by pros
              </span>
            </div>
            <div className="floatingCard techCard">
              <Zap size={18} />
              <span>
                <strong>Live nutrition</strong>
                updated instantly
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="featureStrip" aria-label="Delivery promises">
        {[
          [Leaf, "Macro-balanced menus"],
          [ShieldCheck, "Traceable sourcing"],
          [Sparkles, "Gourmet plating"],
          [Zap, "Live nutrition stats"]
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
          <h2>Gourmet kitchens building clean menus tonight</h2>
        </div>
        <div className="restaurantGrid">
          {localRestaurantsWithMenu.map((restaurant, index) => (
            <article
              className={
                restaurant.imageFit === "contain"
                  ? "restaurantCard logoCard"
                  : "restaurantCard"
              }
              style={{ "--accent": restaurant.accent, "--delay": `${index * 90}ms` }}
              key={restaurant.name}
            >
              <img
                src={restaurant.image}
                alt={`${restaurant.name} food`}
                loading="lazy"
                decoding="async"
              />
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
              ? "Build a nutrition-forward order"
              : "Order a clean plate from this kitchen"}
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
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
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
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
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

      <section className="tracking" id="tracking" ref={trackingRef}>
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
            {shouldLoadTracking ? (
              <iframe
                className="mapFrame"
                src={trackingMapUrl}
                title={`Tracking map for ${trackedKitchenName} in ${userCity}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="mapFrame mapFramePlaceholder" aria-hidden="true" />
            )}
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
                loading="lazy"
                decoding="async"
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
