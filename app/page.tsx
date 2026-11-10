"use client";

import React, { useState, useEffect, useRef } from "react";

// Deterministic LCG sequence for repeatable particle generation
function seeded(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280;
}

interface Slide {
  src: string;
  caption: string;
}

const GALLERY_SLIDES: Slide[] = [
  { src: "/media/scene-walking.jpg", caption: "Hand in hand" },
  { src: "/media/scene-dancing.jpg", caption: "The first dance" },
  { src: "/media/scene-hands.jpg", caption: "Henna and promises" },
  { src: "/media/scene-balcony.jpg", caption: "Golden hour" },
];

const WISH_BLESSINGS = [
  "May your evenings always be unhurried.",
  "May the tea be hot and the arguments short.",
  "May you keep choosing each other.",
  "May your house be loud with the right people.",
  "May the monsoon always find you together.",
  "May your journey together be blessed with endless laughter and joy.",
];

export default function WeddingPage() {
  // Envelope State
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [envelopeLeaving, setEnvelopeLeaving] = useState(false);
  const [envelopeRemoved, setEnvelopeRemoved] = useState(false);
  const [isPlayingFilm, setIsPlayingFilm] = useState(false);

  // Audio State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filmRef = useRef<HTMLVideoElement | null>(null);

  // Gallery State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideFading, setIsSlideFading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // RSVP Form State
  const [attending, setAttending] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState<"none" | "yes" | "no">("none");
  const [submitting, setSubmitting] = useState(false);
  const [awayGuestName, setAwayGuestName] = useState("friend");
  const [lanternSentForGuest, setLanternSentForGuest] = useState(false);

  // Wishes Lanterns
  const [wishes, setWishes] = useState<Array<{ id: number; text: string; left: number }>>([]);

  // Countdown State
  const [countdown, setCountdown] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });
  const [tickUnit, setTickUnit] = useState<string | null>(null);

  // Particles for Hero & Farewell
  const [heroLanterns, setHeroLanterns] = useState<Array<any>>([]);
  const [heroPetals, setHeroPetals] = useState<Array<any>>([]);
  const [farewellLanterns, setFarewellLanterns] = useState<Array<any>>([]);

  // Target Wedding Date: 20 November 2026 18:30 IST
  const targetDate = new Date("2026-12-02T12:00:00+05:30").getTime();

  // Lock body scroll while envelope is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Initialize Particles
  useEffect(() => {
    // Generate Hero Lanterns (10 count)
    const hl = [];
    for (let i = 0; i < 10; i++) {
      const r = seeded(i);
      const size = 18 + r * 44;
      const start = (i * 23 + r * 30) % 72;
      hl.push({
        left: 4 + ((i * 11.3 + r * 17) % 90),
        bottom: start,
        width: size,
        opacity: 0.55 + r * 0.45,
        climb: (100 - start + 18) * 1.1,
        drift: r > 0.5 ? 22 : -18,
        dur: 22 + r * 18,
        height: size * 1.3,
      });
    }
    setHeroLanterns(hl);

    // Generate Petals (14 count)
    const TINTS = ["var(--peach)", "var(--blush)", "var(--rose)"];
    const hp = [];
    for (let i = 0; i < 14; i++) {
      const r = ((i * 7919) % 997) / 997;
      const size = 6 + r * 9;
      hp.push({
        left: (i * 13.7 + r * 9) % 100,
        width: size,
        height: size * 0.62,
        hue: TINTS[r > 0.6 ? 2 : r > 0.3 ? 1 : 0],
        sway: 30 + r * 50,
        dur: 13 + r * 12,
        delay: -r * 20,
      });
    }
    setHeroPetals(hp);

    // Farewell Lanterns (7 count)
    const fl = [];
    for (let i = 0; i < 7; i++) {
      const r = seeded(i + 20);
      const size = 18 + r * 44;
      const start = (i * 23 + r * 30) % 72;
      fl.push({
        left: 4 + ((i * 11.3 + r * 17) % 90),
        bottom: start,
        width: size,
        opacity: 0.55 + r * 0.45,
        climb: (100 - start + 18) * 1.05,
        drift: r > 0.5 ? 20 : -16,
        dur: 22 + r * 18,
        height: size * 1.3,
      });
    }
    setFarewellLanterns(fl);
  }, []);

  // Parallax Scroll Effect
  useEffect(() => {
    let queued = false;
    const bg = document.querySelector('[data-parallax="bg"]') as HTMLElement;
    const content = document.querySelector('[data-parallax="content"]') as HTMLElement;
    const blooms = document.querySelectorAll('[data-parallax="bloom"]');

    function paint() {
      queued = false;
      const y = window.scrollY;
      const vh = window.innerHeight;

      if (y < vh + 200) {
        const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
        if (bg) bg.style.translate = `0 ${clamp(y / 900) * 170}px`;
        blooms.forEach((el) => {
          (el as HTMLElement).style.translate = `0 ${clamp(y / 900) * 70}px`;
        });
        if (content) {
          content.style.translate = `0 ${clamp(y / 600) * -60}px`;
          content.style.opacity = `${1 - clamp(y / 520)}`;
        }
      }
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    paint();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // IntersectionObserver for Scroll Reveals & 3D Hand-Fans
  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-12% 0px -8% 0px" }
    );
    revealItems.forEach((el) => revealObserver.observe(el));

    // Event Fans 3D Toggle
    const eventItems = document.querySelectorAll(".event");
    const fanObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-open");
          } else {
            entry.target.classList.remove("is-open");
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
    );
    eventItems.forEach((el) => fanObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      fanObserver.disconnect();
    };
  }, []);

  // Countdown Live Timer
  useEffect(() => {
    function tick() {
      const now = Date.now();
      const left = Math.max(0, targetDate - now);

      const d = String(Math.floor(left / 86400000)).padStart(2, "0");
      const h = String(Math.floor((left % 86400000) / 3600000)).padStart(2, "0");
      const m = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

      setCountdown((prev) => {
        if (prev.seconds !== s) setTickUnit("s");
        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Envelope Opening Handler
  const handleOpenEnvelope = () => {
    if (isPlayingFilm) return;
    setIsPlayingFilm(true);

    // Play Background Music
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => { });
    }

    // Play Video Film
    if (filmRef.current) {
      filmRef.current.currentTime = 0;
      filmRef.current.play().catch(() => handleLeaveEnvelope());
    }
  };

  const handleLeaveEnvelope = () => {
    if (envelopeLeaving) return;
    setEnvelopeLeaving(true);
    setTimeout(() => {
      setEnvelopeRemoved(true);
      document.body.style.overflow = "";
    }, 1300);
  };

  // Music Toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => { });
    } else {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    }
  };

  // Gallery Slide Navigation
  const changeSlide = (index: number) => {
    setIsSlideFading(true);
    setTimeout(() => {
      setCurrentSlide((index + GALLERY_SLIDES.length) % GALLERY_SLIDES.length);
      setIsSlideFading(false);
    }, 200);
  };

  // Lightbox Keyboard Navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") changeSlide(currentSlide - 1);
      else if (e.key === "ArrowRight") changeSlide(currentSlide + 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, currentSlide]);

  // Wish Lantern Release
  const releaseWish = (customText?: string) => {
    const text = customText || WISH_BLESSINGS[Math.floor(Math.random() * WISH_BLESSINGS.length)];
    const newWish = {
      id: Date.now() + Math.random(),
      text,
      left: 18 + Math.random() * 64,
    };
    setWishes((prev) => [...prev, newWish]);
    setTimeout(() => {
      setWishes((prev) => prev.filter((w) => w.id !== newWish.id));
    }, 7000);
  };

  // RSVP Submit Handler
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const fName = guestName.trim().split(/\s+/)[0] || "friend";
    setAwayGuestName(fName);

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: guestName.trim(),
          phone: phone.trim(),
          attending: attending ? "Joyfully yes" : "Regretfully no",
          numberOfGuests: attending ? guestsCount : 0,
          message: message.trim(),
        }),
      });
    } catch (err) {
      console.warn("Could not save RSVP to server:", err);
    }

    setTimeout(() => {
      setSubmitting(false);
      setRsvpSubmitted(attending ? "yes" : "no");
    }, 600);
  };

  const handleSendRegretsLantern = () => {
    setLanternSentForGuest(true);
    const farewell = document.querySelector(".farewell");
    if (farewell) {
      farewell.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    setTimeout(() => {
      releaseWish(`For ${awayGuestName}, who cannot be with us`);
    }, 800);
  };

  return (
    <main className="page">
      {/* Background Music */}
      <audio
        ref={audioRef}
        src="/videos/radha-krishna.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlayingMusic(true)}
        onPause={() => setIsPlayingMusic(false)}
      />

      {/* Floating Music Toggle */}
      <button
        className={`music-toggle ${!isPlayingMusic ? "is-muted" : ""}`}
        onClick={toggleMusic}
        type="button"
        aria-pressed={isPlayingMusic}
        aria-label={isPlayingMusic ? "Turn music off" : "Turn music on"}
      >
        <span className="music-toggle__ring" aria-hidden="true"></span>
        <svg className="icon music-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <svg className="icon music-toggle__slash" viewBox="0 0 24 24" aria-hidden="true">
          <line x1="3" y1="3" x2="21" y2="21" />
        </svg>
      </button>

      {/* =====================================================================
          1. The Envelope Opening Film & Wax Seal
          ===================================================================== */}
      {!envelopeRemoved && (
        <div
          className={`envelope ${isPlayingFilm ? "is-playing" : ""} ${envelopeLeaving ? "is-leaving" : ""
            }`}
          id="envelope"
        >
          <video
            ref={filmRef}
            className="envelope__film"
            src="/invite-open.mp4"
            playsInline
            muted
            preload="auto"
            onTimeUpdate={() => {
              if (filmRef.current && filmRef.current.currentTime >= 7.15) {
                handleLeaveEnvelope();
              }
            }}
            onEnded={handleLeaveEnvelope}
            onError={handleLeaveEnvelope}
          />

          <button
            className="envelope__seal is-ready"
            onClick={handleOpenEnvelope}
            type="button"
            aria-label="Tap the seal to open the invitation"
          >
            <img
              src="/images/template-2/invite-seal.webp"
              alt="Ivory wedding envelope with gold wax seal"
            />
            <span className="envelope__glow" aria-hidden="true"></span>
          </button>

          <button className="envelope__skip" onClick={handleLeaveEnvelope} type="button">
            Skip
          </button>
        </div>
      )}

      {/* =====================================================================
          2. Hero Section: Sandstone Palace at Dawn, Lanterns, Petals
          ===================================================================== */}
      <section className="hero">
        <div className="hero__bg" data-parallax="bg">
          <img
            src="/images/template-2/hero-palace.jpg"
            width={1024}
            height={1536}
            alt="Watercolour illustration of a sandstone palace beneath a blush dawn sky"
          />
        </div>
        <div className="hero__wash" aria-hidden="true"></div>

        {/* Floating Lanterns */}
        <div className="lanterns" aria-hidden="true">
          {heroLanterns.map((l, idx) => (
            <span
              key={idx}
              className="lantern"
              style={{
                left: `${l.left}%`,
                bottom: `${l.bottom}%`,
                width: `${l.width}px`,
                opacity: l.opacity,
                ["--climb" as any]: l.climb,
                ["--drift" as any]: l.drift,
                ["--dur" as any]: `${l.dur}s`,
              }}
            >
              <img
                src="/images/template-2/lantern.webp"
                alt=""
                width={l.width}
                height={l.height}
                loading="lazy"
              />
            </span>
          ))}
        </div>

        {/* Falling Petals */}
        <div className="petals" aria-hidden="true">
          {heroPetals.map((p, idx) => (
            <span
              key={idx}
              className="petal"
              style={{
                left: `${p.left}%`,
                width: `${p.width}px`,
                height: `${p.height}px`,
                ["--hue" as any]: p.hue,
                ["--sway" as any]: p.sway,
                ["--dur" as any]: `${p.dur}s`,
                ["--delay" as any]: `${p.delay}s`,
              }}
            >
              <span></span>
            </span>
          ))}
        </div>

        {/* Ambient Haze Bands */}
        <div className="haze" aria-hidden="true">
          <span></span>
          <span></span>
        </div>

        {/* Drifting Birds Crossing Sky */}
        <div className="birds" aria-hidden="true">
          <svg viewBox="0 0 24 8">
            <path d="M1 5C4 1 7 1 10 5M14 5c3-4 6-4 9 0" />
          </svg>
          <svg viewBox="0 0 24 8">
            <path d="M1 5C4 1 7 1 10 5M14 5c3-4 6-4 9 0" />
          </svg>
          <svg viewBox="0 0 24 8">
            <path d="M1 5C4 1 7 1 10 5M14 5c3-4 6-4 9 0" />
          </svg>
        </div>

        {/* Swaying Bougainvillea Blooms */}
        <img
          className="hero__bloom hero__bloom--left"
          src="/images/template-2/bougainvillea.webp"
          alt=""
          aria-hidden="true"
          width="957"
          height="715"
          data-parallax="bloom"
        />
        <img
          className="hero__bloom hero__bloom--right"
          src="/images/template-2/bougainvillea.webp"
          alt=""
          aria-hidden="true"
          width="957"
          height="715"
          data-parallax="bloom"
        />

        {/* Hero Content */}
        <div className="hero__content" data-parallax="content">
          <span className="hero__invocation" role="img" aria-label="Shri Ganeshaya Namah"></span>
          <p className="hero__kicker">Together with our families</p>

          <h1 className="hero__names">
            <span className="hero__name">Alankrita Tripathi</span>
            <span className="hero__amp">&amp;</span>
            <span className="hero__name">Hemant Sharma</span>
          </h1>

          <div className="hero__rule"></div>

          <p className="hero__blessing">
            <span className="gold-text shimmer">Wednesday, 2 December 2026</span>
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "2.25rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <a className="hero__cta glass-plate" href="#events" style={{ marginTop: 0 }}>
              <span className="gold-text shimmer">View Events</span>
            </a>
          </div>

          <div className="hero__scroll" aria-hidden="true">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. The Royal Invitation Card & Swaying Jhumar
          ===================================================================== */}
      <section className="invite" aria-labelledby="invite-names">
        <div className="invite__bg" aria-hidden="true">
          <img
            src="/images/template-2/invite-bg.webp"
            width="941"
            height="1672"
            alt=""
            loading="lazy"
          />
        </div>

        <img
          className="invite__jhumar"
          src="/images/template-2/Ornate-Pink-and-Gold-Jhumar.webp"
          width="941"
          height="1672"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />

        <div className="invite__card" data-reveal>
          <div className="invite__frame" aria-hidden="true"></div>

          <div className="invite__text">
            <p className="invite__overline">With the blessings of the divine</p>
            <p className="invite__kicker">
              we request the honour of your presence
              <br />
              at the wedding celebration of
            </p>

            <img
              className="invite__lotus"
              src="/images/template-2/Pastel-Gold-Lotus-Emblem.webp"
              width="1536"
              height="1024"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />

            <h2 className="invite__names" id="invite-names">
              <span className="invite__person">
                <span className="invite__name">Alankrita Tripathi</span>
                <span className="invite__family">Daughter of Mrs. Anjana Tripathi &amp; Mr. Ajay Tripathi</span>
              </span>
              <span className="invite__amp" aria-hidden="true">
                &amp;
              </span>
              <span className="invite__person">
                <span className="invite__name">Hemant Sharma</span>
                <span className="invite__family">Son of Mrs. Anuja Sharma &amp; Mr. Sanjay Sharma</span>
              </span>
            </h2>

            <img
              className="invite__lotus"
              src="/images/template-2/Pastel-Gold-Lotus-Emblem.webp"
              width="1536"
              height="1024"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />

            <div className="invite__meta">
              <p className="invite__date">
                2<sup>nd</sup> December 2026
              </p>
              <p className="invite__time">12:00 PM Onwards</p>
              <p className="invite__venue">Indralok Marriage Garden, Termiinal 2, jagatpura road, near airport Jaipur</p>
              <a
                className="map-link"
                href="https://maps.app.goo.gl/amVNorJKCCNc2epL7"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                View on map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. Chapter Two: The Ceremonies (3D Folding Hand-Fans)
          ===================================================================== */}
      <section className="band band--events" id="events">
        <div className="events__decor" aria-hidden="true">
          <img
            className="decor decor--jhoomer decor--jhoomer-l"
            src="/images/template-2/decor-jhoomer.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--jhoomer decor--jhoomer-r"
            src="/images/template-2/decor-jhoomer.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--chandelier decor--chandelier-1"
            src="/images/template-2/decor-chandelier.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--chandelier decor--chandelier-2"
            src="/images/template-2/decor-chandelier.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--nazar decor--nazar-1"
            src="/images/template-2/decor-nazar.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--nazar decor--nazar-2"
            src="/images/template-2/decor-nazar.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--nazar decor--nazar-3"
            src="/images/template-2/decor-nazar.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--peacock"
            src="/images/template-2/decor-peacock.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--camel"
            src="/images/template-2/decor-camel.webp"
            alt=""
            loading="lazy"
          />
          <img
            className="decor decor--horse"
            src="/images/template-2/decor-horse.webp"
            alt=""
            loading="lazy"
          />
        </div>

        <div className="wrap wrap--wide">
          <div className="head">
            <h2 className="head__title" data-reveal style={{ transitionDelay: ".08s" }}>
              Our Events
            </h2>
            <p className="head__note" data-reveal style={{ transitionDelay: ".16s" }}>
              A celebration journey, in five ceremonies
            </p>
          </div>

          <div className="flourish" data-reveal="short">
            <img
              src="/images/template-2/gold-flourish.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="888"
              height="124"
            />
          </div>

          <div className="events" role="list" aria-label="Wedding events">
            {/* 1. Sangeet */}
            <article className="event event--left" role="listitem" aria-label="1 of 5: Mehendi">
              <div className="event__stage">
                <div className="event__panel">
                  <div className="event__frame" aria-hidden="true"></div>
                  <div className="event__body">
                    <img
                      className="event__art"
                      src="/images/template-2/event-sangeet.webp"
                      alt="Sangeet"
                      loading="lazy"
                    />
                    <h3 className="event__name">Sangeet</h3>
                    <div className="event__rule" aria-hidden="true"></div>
                    <p className="event__when">
                      <span className="event__date">
                        22<sup className="event__ord">nd</sup> Nov 2026
                      </span>
                      <span className="event__time">4:00 PM</span>
                    </p>
                    <p className="event__venue">Crown Palace</p>
                    <p className="event__note">Jawahar nagar, Kanpur</p>
                    <a
                      className="map-link"
                      href="https://maps.app.goo.gl/Nai6x9ZcXzfoxVcp6"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* 2. Sagai */}
            <article className="event event--right" role="listitem" aria-label="2 of 5: Sagai">
              <div className="event__stage">
                <div className="event__panel">
                  <div className="event__frame" aria-hidden="true"></div>
                  <div className="event__body">
                    <img
                      className="event__art"
                      src="/images/template-2/event-shaadi.webp"
                      alt="Haldi"
                      loading="lazy"
                    />
                    <h3 className="event__name">Sagai</h3>
                    <div className="event__rule" aria-hidden="true"></div>
                    <p className="event__when">
                      <span className="event__date">
                        1<sup className="event__ord">st</sup> Dec 2026
                      </span>
                      <span className="event__time">3:00 AM</span>
                    </p>
                    <p className="event__venue">Hotel Nesta</p>
                    <p className="event__note">Sector-8,9, Pratap nagar, Jaipur</p>
                    <a
                      className="map-link"
                      href="https://maps.app.goo.gl/tdi9VCQHLffXKhox7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* 4. Shaadi */}
            <article className="event event--left" role="listitem" aria-label="4 of 5: Shaadi">
              <div className="event__stage">
                <div className="event__panel">
                  <div className="event__frame" aria-hidden="true"></div>
                  <div className="event__body">
                    <img
                      className="event__art"
                      src="/images/template-2/event-shaadi.webp"
                      alt="Shaadi"
                      loading="lazy"
                    />
                    <h3 className="event__name">Shaadi</h3>
                    <div className="event__rule" aria-hidden="true"></div>
                    <p className="event__when">
                      <span className="event__date">
                        2<sup className="event__ord">nd</sup> Dec 2026
                      </span>
                      <span className="event__time">12:00 PM</span>
                    </p>
                    <p className="event__venue">Indralok Marriage Garden</p>
                    <p className="event__note">Terminal 2, Jagatpura road, near airport Jaipur</p>
                    <a
                      className="map-link"
                      href="https://maps.app.goo.gl/amVNorJKCCNc2epL7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* 5. Reception */}
            <article className="event event--right" role="listitem" aria-label="5 of 5: Reception">
              <div className="event__stage">
                <div className="event__panel">
                  <div className="event__frame" aria-hidden="true"></div>
                  <div className="event__body">
                    <img
                      className="event__art"
                      src="/images/template-2/event-reception.webp"
                      alt="Reception"
                      loading="lazy"
                    />
                    <h3 className="event__name">Reception</h3>
                    <div className="event__rule" aria-hidden="true"></div>
                    <p className="event__when">
                      <span className="event__date">
                        2<sup className="event__ord">nd</sup> Dec 2026
                      </span>
                      <span className="event__time">6:00 PM</span>
                    </p>
                    <p className="event__venue">Indralok Marriage Garden</p>
                    <p className="event__note">Terminal 2, Jagatpura road, near airport Jaipur</p>
                    <a
                      className="map-link"
                      href="https://maps.app.goo.gl/amVNorJKCCNc2epL7"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      View on map
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. Chapter Three: The Album (Gallery & Lightbox)
          ===================================================================== */}
      <section className="band band--gallery" id="gallery">
        <div className="wrap">
          <div className="head">
            <h2 className="head__title" data-reveal style={{ transitionDelay: ".08s" }}>
              Painted moments
            </h2>
            <p className="head__note" data-reveal style={{ transitionDelay: ".16s" }}>
              A few pages from our album
            </p>
          </div>

          <div className="flourish" data-reveal="short">
            <img
              src="/images/template-2/gold-flourish.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="888"
              height="124"
            />
          </div>

          <div className="album" data-reveal style={{ transitionDelay: ".1s" }}>
            <div
              className={`album__stage ${isSlideFading ? "is-fading" : ""}`}
              onClick={() => setLightboxOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="View photo full screen"
            >
              <img
                className="album__photo"
                src={GALLERY_SLIDES[currentSlide].src}
                alt={GALLERY_SLIDES[currentSlide].caption}
              />
              <img
                className="album__frame"
                src="/images/template-2/gallery-frame.webp"
                alt=""
                aria-hidden="true"
              />
              <button
                className="album__arrow album__arrow--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  changeSlide(currentSlide - 1);
                }}
                type="button"
                aria-label="Previous photo"
              >
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                className="album__arrow album__arrow--next"
                onClick={(e) => {
                  e.stopPropagation();
                  changeSlide(currentSlide + 1);
                }}
                type="button"
                aria-label="Next photo"
              >
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <p className="album__caption">{GALLERY_SLIDES[currentSlide].caption}</p>

            <div className="album__dots" role="tablist" aria-label="Gallery navigation">
              {GALLERY_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`album__dot ${i === currentSlide ? "is-active" : ""}`}
                  onClick={() => changeSlide(i)}
                  type="button"
                  role="tab"
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>

            <div className="album__thumbs" role="list" aria-label="Photo thumbnails">
              {GALLERY_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`thumb ${i === currentSlide ? "is-active" : ""}`}
                  onClick={() => changeSlide(i)}
                  role="listitem"
                  aria-label={`Show photo ${i + 1}`}
                >
                  <img className="thumb__photo" src={slide.src} alt="" loading="lazy" />
                  <img
                    className="thumb__art"
                    src="/images/template-2/gallery-frame.webp"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="lightbox__close"
            onClick={() => setLightboxOpen(false)}
            type="button"
            aria-label="Close"
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <button
            className="lightbox__step lightbox__step--prev"
            onClick={(e) => {
              e.stopPropagation();
              changeSlide(currentSlide - 1);
            }}
            type="button"
            aria-label="Previous photo"
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            className="lightbox__step lightbox__step--next"
            onClick={(e) => {
              e.stopPropagation();
              changeSlide(currentSlide + 1);
            }}
            type="button"
            aria-label="Next photo"
          >
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <img
              className="lightbox__img"
              src={GALLERY_SLIDES[currentSlide].src}
              alt={GALLERY_SLIDES[currentSlide].caption}
            />
            <p className="lightbox__caption">{GALLERY_SLIDES[currentSlide].caption}</p>
          </div>
        </div>
      )}

      {/* =====================================================================
          6. Chapter Four: The RSVP Response
          ===================================================================== */}
      <section className="band band--rsvp" id="rsvp">
        <div className="wrap wrap--slim">
          <div className="head">
            <h2 className="head__title" data-reveal style={{ transitionDelay: ".08s" }}>
              Will you come?
            </h2>
            <p className="head__note" data-reveal style={{ transitionDelay: ".16s" }}>
              A seat at our table is already yours
            </p>
          </div>

          <div className="flourish" data-reveal="short">
            <img
              src="/images/template-2/gold-flourish.webp"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="888"
              height="124"
            />
          </div>

          <div className="reply plate paper-grain" data-reveal style={{ transitionDelay: ".1s" }}>
            {rsvpSubmitted === "none" && (
              <form className="reply__form" onSubmit={handleRsvpSubmit}>
                <div className="field">
                  <label htmlFor="rsvp-name">Your name</label>
                  <input
                    id="rsvp-name"
                    type="text"
                    placeholder="Full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="rsvp-phone">Phone number</label>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    placeholder="+91 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Will you be there?</label>
                  <div className="choice-pair">
                    <button
                      className="choice"
                      type="button"
                      aria-pressed={attending}
                      onClick={() => setAttending(true)}
                    >
                      Joyfully yes
                    </button>
                    <button
                      className="choice"
                      type="button"
                      aria-pressed={!attending}
                      onClick={() => setAttending(false)}
                    >
                      Regretfully no
                    </button>
                  </div>
                </div>

                {attending && (
                  <div className="field">
                    <label htmlFor="rsvp-guests">Number of guests</label>
                    <input
                      id="rsvp-guests"
                      type="number"
                      min="1"
                      max="10"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                    />
                  </div>
                )}

                <div className="field">
                  <label htmlFor="rsvp-message">A message for us</label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    placeholder="Your blessings &amp; wishes..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>

                <button className="btn btn--solid reply__send" type="submit" disabled={submitting}>
                  <svg className="icon icon--sm" viewBox="0 0 24 24" strokeWidth="1.6">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>
                    {submitting
                      ? attending
                        ? "Sending RSVP..."
                        : "Sending your note..."
                      : attending
                        ? "Please Respond"
                        : "Send my regrets"}
                  </span>
                </button>
              </form>
            )}

            {rsvpSubmitted === "yes" && (
              <div className="reply__thanks">
                <svg className="icon icon--heart reply__heart" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                </svg>
                <h3 className="reply__title">Thank you</h3>
                <p className="reply__note">
                  Your reply is safely with us. We cannot wait to see you there!
                </p>
                <button
                  className="reply__again"
                  type="button"
                  onClick={() => {
                    setRsvpSubmitted("none");
                    setGuestName("");
                    setPhone("");
                    setMessage("");
                  }}
                >
                  Send another response
                </button>
              </div>
            )}

            {rsvpSubmitted === "no" && (
              <div className="reply__thanks reply__thanks--regrets">
                <svg className="icon reply__lamp" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.2 4.4h5.6" />
                  <path d="M9.2 4.4C8.1 6.6 6.6 8.3 6.6 10.6a5.4 5.4 0 0 0 10.8 0c0-2.3-1.5-4-2.6-6.2" />
                  <path d="m9.9 15.4-.6 3h5.4l-.6-3" />
                  <path d="M12 8.7c1 .9 1.3 1.8.8 2.6-.4.6-1.2.6-1.6 0-.5-.8-.2-1.7.8-2.6Z" />
                  <path d="M4.4 6.6v-2M3.4 5.6h2M19.8 9.6V8M19 8.8h1.6" />
                </svg>
                <h3 className="reply__title">
                  You will be missed, <span className="reply__name">{awayGuestName}</span>
                </h3>
                <p className="reply__note">
                  If your plans ever change, your seat will always be here for you. 💛
                </p>

                <div className="reply__actions">
                  <button
                    className="btn reply__lantern"
                    type="button"
                    onClick={handleSendRegretsLantern}
                    disabled={lanternSentForGuest}
                  >
                    <svg className="icon icon--sm" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                      <path d="M9.2 4.4h5.6" />
                      <path d="M9.2 4.4C8.1 6.6 6.6 8.3 6.6 10.6a5.4 5.4 0 0 0 10.8 0c0-2.3-1.5-4-2.6-6.2" />
                      <path d="m9.9 15.4-.6 3h5.4l-.6-3" />
                    </svg>
                    <span>{lanternSentForGuest ? "Look up — it is rising" : "Send it up for me"}</span>
                  </button>
                  <button
                    className="reply__again"
                    type="button"
                    onClick={() => {
                      setRsvpSubmitted("none");
                      setLanternSentForGuest(false);
                    }}
                  >
                    Change my answer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. Closing Sky, Garland Countdown & Sky Wishes
          ===================================================================== */}
      <div className="closing">
        <img
          className="closing__sky"
          src="/images/template-2/sunset-sky.jpg"
          alt=""
          aria-hidden="true"
          width="1920"
          height="1024"
          loading="lazy"
        />
        <div className="closing__wash" aria-hidden="true"></div>
        <div className="aurora" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* The Garland Countdown */}
        <section className="finale" aria-labelledby="countdown-title">
          <div className="finale__head" data-reveal>
            <h2 className="finale__title" id="countdown-title">
              <span className="finale__lead">Counting Down to</span>
              <span className="finale__forever">Forever</span>
            </h2>
            <img
              className="finale__rule"
              src="/images/template-2/title-rule.webp"
              width="3546"
              height="443"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
          </div>

          <div className="finale__frame" data-reveal style={{ transitionDelay: ".12s" }}>
            <img
              className="finale__art"
              src="/images/template-2/countdown-garland.webp"
              width="1672"
              height="941"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
            <div
              className="finale__cells"
              id="countdown"
              role="timer"
              aria-label="Time remaining until the wedding"
            >
              <div className="cd-cell cd-cell--1">
                <span className={`cd-num ${tickUnit === "s" ? "is-tick" : ""}`}>{countdown.days}</span>
                <span className="cd-label">Days</span>
              </div>
              <div className="cd-cell cd-cell--2">
                <span className={`cd-num ${tickUnit === "s" ? "is-tick" : ""}`}>{countdown.hours}</span>
                <span className="cd-label">Hours</span>
              </div>
              <div className="cd-cell cd-cell--3">
                <span className={`cd-num ${tickUnit === "s" ? "is-tick" : ""}`}>{countdown.minutes}</span>
                <span className="cd-label">Minutes</span>
              </div>
              <div className="cd-cell cd-cell--4">
                <span className={`cd-num ${tickUnit === "s" ? "is-tick" : ""}`}>{countdown.seconds}</span>
                <span className="cd-label">Seconds</span>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Send-off & Wish Lanterns */}
        <footer className="farewell">
          {/* Ambient Rising Lanterns */}
          <div className="lanterns" aria-hidden="true">
            {farewellLanterns.map((l, idx) => (
              <span
                key={idx}
                className="lantern"
                style={{
                  left: `${l.left}%`,
                  bottom: `${l.bottom}%`,
                  width: `${l.width}px`,
                  opacity: l.opacity,
                  ["--climb" as any]: l.climb,
                  ["--drift" as any]: l.drift,
                  ["--dur" as any]: `${l.dur}s`,
                }}
              >
                <img
                  src="/images/template-2/lantern.webp"
                  alt=""
                  width={l.width}
                  height={l.height}
                  loading="lazy"
                />
              </span>
            ))}
          </div>

          {/* User Released Wish Lanterns */}
          <div className="wishes" id="wishes" aria-hidden="true">
            {wishes.map((w) => (
              <div key={w.id} className="wish" style={{ left: `${w.left}%` }}>
                <img
                  src="/images/template-2/lantern.webp"
                  alt=""
                  width="580"
                  height="751"
                />
                <span>{w.text}</span>
              </div>
            ))}
          </div>

          <div className="farewell__inner">
            <div className="flourish" data-reveal="short">
              <img
                src="/images/template-2/gold-flourish.webp"
                alt=""
                aria-hidden="true"
                loading="lazy"
                width="888"
                height="124"
              />
            </div>

            <h2 className="farewell__lines">
              Come early. Stay late.
              <br />
              Dance badly with us.
            </h2>

            <button
              className="farewell__wish glass-plate"
              type="button"
              onClick={() => releaseWish()}
            >
              Release a wish lantern
            </button>

            <p className="farewell__signoff">
              With all our love
              <br />
              Alankrita Tripathi &amp; Hemant Sharma
              <br />
              <span className="farewell__families">&amp; Our Families</span>
            </p>
            <p className="farewell__date">
              2nd December 2026
              <br />
              Indrlok Marriage Garden, Terminal 2, jagatpura Road, near Airport Jaipur
            </p>

            <p className="farewell__made">
              Made with
              <svg className="icon icon--heart" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </svg>
              for our people
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
