import React from "react";
import { ArrowLeft, Leaf, Zap, ChevronRight, Navigation } from "lucide-react";
import "./globals.css";

const defaultSlides = [
  {
    name: "Microgreens",
    note: "Phytonutrients",
    detail: "High-density greens that lift flavor without weighing the plate down.",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Harvest Bowl",
    note: "Plant protein",
    detail: "Balanced grains and legumes for clean, steady fuel.",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Citrus",
    note: "Vitamin C",
    detail: "Bright, immune-forward freshness with a sharp finish.",
    image:
      "https://images.unsplash.com/photo-1502741126161-b048400d3c9b?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Berries",
    note: "Antioxidants",
    detail: "Natural sweetness that keeps the palette light and vivid.",
    image:
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80"
  },
  {
    name: "Olive oil",
    note: "Heart healthy",
    detail: "Cold-pressed richness that keeps the whole frame refined.",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80"
  }
];

function wrapIndex(index, total) {
  return (index + total) % total;
}

export default function HeroSection({
  locationLabel = "Fresh picks nearby",
  userCity = "your city",
  slides = defaultSlides,
  activeIndex = 0,
  setActiveIndex,
  setPaused
}) {
  const items = slides.length ? slides : defaultSlides;
  const total = items.length;
  const currentIndex = wrapIndex(activeIndex, total);
  const activeCard = items[currentIndex];
  const heroBadges = [
    {
      icon: Leaf,
      title: "Plant-forward",
      text: "Built for clean energy"
    },
    {
      icon: Zap,
      title: "Live nutrition",
      text: "Updated instantly"
    }
  ];

  const visibleCards = [-1, 0, 1].map((offset) => {
    const cardIndex = wrapIndex(currentIndex + offset, total);
    return {
      ...items[cardIndex],
      index: cardIndex,
      position: offset === 0 ? "active" : offset < 0 ? "prev" : "next"
    };
  });

  return (
    <section className="heroSection" id="top" aria-labelledby="hero-title">
      <div className="heroStage" onPointerEnter={() => setPaused?.(true)} onPointerLeave={() => setPaused?.(false)}>
        <div className="heroCopy">
          <p className="heroEyebrow">{locationLabel}</p>
          <h1 id="hero-title">{activeCard.name}</h1>
          <p className="heroLead">
            Plant-forward menus shaped for {userCity} with card-level detail, clean
            ingredients, and a stage built to feel calm at a glance.
          </p>
          <div className="heroActions">
            <a className="heroButton heroButton--primary" href="#menu">
              Build order
              <ChevronRight size={18} />
            </a>
            <a className="heroButton heroButton--secondary" href="#tracking">
              <Navigation size={18} />
              Live tracking
            </a>
          </div>
        </div>

        <div className="heroInfoRow" aria-label="Hero highlights">
          {heroBadges.map(({ icon: Icon, title, text }) => (
            <div className="heroBadge heroBadge--inline" key={title}>
              <Icon size={16} />
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="heroCarousel" aria-label="Featured ingredient carousel">
          {visibleCards.map((card) => (
            <article
              key={card.name}
              className={`heroCard heroCard--${card.position}`}
              data-position={card.position}
              role="button"
              tabIndex={0}
              aria-current={card.position === "active" ? "true" : undefined}
              onClick={() => setActiveIndex?.(card.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex?.(card.index);
                }
              }}
            >
              <div className="heroCardMedia">
                <img src={card.image} alt={card.name} loading="lazy" decoding="async" />
                <span className="heroCardChip">{card.note}</span>
              </div>
              <div className="heroCardBody">
                <div className="heroCardTopline">
                  <span>{card.position === "active" ? "Focused now" : "In the mix"}</span>
                  <strong>{String(card.index + 1).padStart(2, "0")}</strong>
                </div>
                <h2>{card.name}</h2>
                <p>{card.detail}</p>
                <div className="heroCardMeta" aria-hidden="true">
                  <span>Fresh prep</span>
                  <span>Macro-balanced</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="heroBadge heroBadge--floating heroBadge--topLeft">
          <Leaf size={16} />
          <span>
            <strong>Plant-forward</strong>
            <small>Built for clean energy</small>
          </span>
        </div>

        <div className="heroBadge heroBadge--floating heroBadge--bottomRight">
          <Zap size={16} />
          <span>
            <strong>Live nutrition</strong>
            <small>Updated instantly</small>
          </span>
        </div>

        <nav className="heroDock" aria-label="Carousel navigation">
          <button
            className="heroBackButton"
            type="button"
            onClick={() => setActiveIndex?.((current) => wrapIndex(current - 1, total))}
            aria-label="Previous featured card"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="heroPagination" role="tablist" aria-label="Featured cards">
            {items.map((card, index) => (
              <button
                key={card.name}
                type="button"
                className={index === currentIndex ? "heroDot active" : "heroDot"}
                aria-label={`Show ${card.name}`}
                aria-pressed={index === currentIndex}
                onClick={() => setActiveIndex?.(index)}
              />
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
