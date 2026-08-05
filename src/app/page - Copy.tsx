"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "./homepage.css";

const dynamicCapabilities = [
  {
    badge: "LIVE TELEMETRY STREAM · SYSTEMS CONNECTED",
    headline: "Real-Time Platform Capabilities",
    color: "#00e4a7", // Green
    title: "▥ Real-Time Post Telemetry & Multi-Tenant Analytics",
    description: "Watch Mini Post App autonomously formulate, restructure, and optimize high-engagement content across Facebook, X, Instagram, LinkedIn, and TikTok.",
    highlight: "1,420 posts transformed this minute",
    metric: "< 450ms latency",
  },
  {
    badge: "GEMINI FLASH LLM · ACTIVE ENGINE",
    headline: "Ultra-Low Latency AI Engine",
    color: "#ffae00", // Yellow
    title: "⚡ Powered by Gemini AI Flash Architecture",
    description: "Direct integration with Google AI Studio's latest Gemini Flash LLM for sub-second responses and context-aware translations.",
    highlight: "99.8% tone adaptation rate",
    metric: "Sub-second output",
  },
  {
    badge: "SHORT-FORM VIDEO STUDIO · RUNNING",
    headline: "Viral Shorts & Reels Generation",
    color: "#08c9ff", // Blue
    title: "▰ AI Video, Reels & Shorts Hook Engine",
    description: "Generate high-converting short video scripts, TikTok hook lines, YouTube Shorts outlines, and Instagram Reels voiceover directions.",
    highlight: "3-second viral hook library",
    metric: "15+ script presets",
  },
  {
    badge: "PUBLISHING AUTOMATION · ACTIVE QUEUE",
    headline: "Automated Content Scheduling",
    color: "#ef0d79", // Pink
    title: "▦ 30-Day Drag & Drop Content Calendar Grid",
    description: "Plan, schedule, and automate your entire monthly content strategy in a visual grid with AI optimal posting time suggestions.",
    highlight: "Optimal posting time AI",
    metric: "24/7 background queue",
  },
  {
    badge: "ENTERPRISE SECURITY · VERIFIED",
    headline: "Enterprise Multi-Tenant Security",
    color: "#a855f7", // Purple
    title: "◇ Token Encryption & GDPR Data Protocols",
    description: "Built-in AES-256 token encryption, automated rate limiting, multi-tenant workspace isolation, and real-time uptime telemetry.",
    highlight: "AES-256 token encryption",
    metric: "100% SLA Uptime",
  },
];

const studioCards = [
  {
    title: "Creator Studio Now",
    subtitle: "Fast 1-Click Multi-Platform Post Engine",
    className: "studio-card studio-card-orange",
    href: "/dashboard",
    icon: "⚡",
  },
  {
    title: "7-Step Pipeline Studio",
    subtitle: "Comprehensive Post & Media Workflow (Fast Post)",
    className: "studio-card studio-card-blue",
    href: "/dashboard/fast-post",
    icon: "✣",
  },
  {
    title: "Video Creator Studio",
    subtitle: "TikTok, Reels & Shorts Video Engine",
    className: "studio-card studio-card-pink",
    href: "/dashboard/fast-post",
    icon: "▰",
  },
];

const capabilityCards = [
  {
    icon: "ϟ",
    title: "1-Click Multi-Platform Engine",
    description:
      "Write one core message and our AI instantly reformats, adjusts character counts, and inserts platform-native hashtags for Facebook, X, Instagram, LinkedIn, and TikTok.",
    points: ["Facebook Page & Group formats", "LinkedIn Professional articles"],
  },
  {
    icon: "▣",
    title: "Powered by Gemini AI Flash",
    description:
      "Direct integration with Google AI Studio's latest Gemini Flash LLM for ultra-low latency response times and contextual adaptations.",
    points: ["Sub-second generation speed", "Multi-lingual translation"],
  },
  {
    icon: "▰",
    title: "AI Video & Reels Studio",
    description:
      "Generate high-converting short video scripts, TikTok hook lines, YouTube Shorts outlines, and Instagram Reels voiceover directions.",
    points: ["Viral 3-second hook library", "On-screen caption generator"],
  },
  {
    icon: "▦",
    title: "30-Day Content Calendar",
    description:
      "Plan, schedule, and automate your entire monthly content strategy in a drag-and-drop visual calendar grid with publishing queues.",
    points: ["Optimal posting time AI", "Automated queuing & retries"],
  },
  {
    icon: "▧",
    title: "Image & Resize Studio",
    description:
      "Transform single visual assets into exact aspect ratios for feed, stories, landscape, and portrait formats with zero quality loss.",
    points: ["AI visual overlay banners", "Aspect ratio auto-cropping"],
  },
  {
    icon: "◇",
    title: "Enterprise Security & Telemetry",
    description:
      "Built-in token encryption, automated rate limiting, multi-tenant isolation, and GDPR-compliant data processing protocols.",
    points: ["AES-256 token encryption", "Real-time uptime telemetry"],
  },
];

const comparisonRows = [
  ["1-Click Multi-Platform Adaptation", "✓ Instant 5-in-1", "Basic Text Reuse", "Hours of manual editing"],
  ["AI Engine Acceleration", "✓ Gemini Flash LLM", "Generic Add-on AI", "✕ None"],
  ["Aspect Ratio Auto-Resizer", "✓ Built-in 1:1, 9:16, 16:9", "Requires Canva/Photoshop", "✕ Manual Cropping"],
  ["30-Day Content Calendar Grid", "✓ Included", "$99+/mo Add-on", "Spreadsheet chaos"],
  ["Multi-Tenant API", "✓ Enterprise Isolation", "Shared workspace limits", "✕ N/A"],
];

const testimonials = [
  {
    initials: "SD",
    name: "Sarah Jenkins",
    role: "Founder, GrowthPulse Agency",
    quote:
      "Mini Post App cut my content distribution time from four hours a day down to ten minutes. The AI formats everything perfectly for LinkedIn and X.",
  },
  {
    initials: "MK",
    name: "Marcus Vance",
    role: "Content Director, MediaVerse",
    quote:
      "The Video Creator Studio script generator is outstanding. It produces viral short-form hooks and captions that doubled our engagement.",
  },
  {
    initials: "EL",
    name: "Elena Rostova",
    role: "SaaS Growth Specialist",
    quote:
      "Having seven social channel connections in one control hub with live telemetry makes client management seamless.",
  },
];

export default function HomePage() {
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTargetText = dynamicCapabilities[activeCapIndex].headline;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing out letter by letter
        const nextText = currentTargetText.slice(0, typedText.length + 1);
        setTypedText(nextText);

        if (nextText === currentTargetText) {
          // Pause at full phrase before deleting letter by letter
          setTimeout(() => setIsDeleting(true), 2400);
        }
      } else {
        // Deleting letter by letter
        const nextText = currentTargetText.slice(0, typedText.length - 1);
        setTypedText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setActiveCapIndex((prev) => (prev + 1) % dynamicCapabilities.length);
        }
      }
    }, isDeleting ? 30 : 65);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, activeCapIndex]);

  const activeCap = dynamicCapabilities[activeCapIndex];

  return (
    <main className="homepage">

      <section className="hero">
        <div className="page-container hero-inner">
          <div className="hero-pill-badge">
            ✨ ENTERPRISE CREATOR SUITE • 1-TEMPLATE → 5 SOCIAL APPS
          </div>

          <h1>
            <span className="gradient-text">Craft Once. Multiply to All Social Platforms.</span>
          </h1>
          <p>
            The ultimate content creation & publishing engine. Automatically transform 1 master idea into
            tailored, high-converting formats for <span className="highlight-fb">Facebook</span>, <span className="highlight-ig">Instagram</span>, <span className="highlight-li">LinkedIn</span>, <span className="highlight-x">X (Twitter)</span>, and <span className="highlight-tt">TikTok</span> powered by Google Gemini AI Flash.
          </p>

          <div className="studio-grid">
            {studioCards.map((card) => (
              <Link href={card.href} className={card.className} key={card.title}>
                <div className="studio-title">
                  <span>{card.icon}</span>
                  <strong>{card.title}</strong>
                  <span>→</span>
                </div>
                <small>{card.subtitle}</small>
              </Link>
            ))}
          </div>

          <div className="stats-grid">
            <div><strong>10k+</strong><span>Generated Posts</span></div>
            <div><strong>5-in-1</strong><span>Platform Formats</span></div>
            <div><strong>Gemini Flash</strong><span>AI Engine</span></div>
            <div><strong>15 Presets</strong><span>Viral Templates</span></div>
          </div>
        </div>
      </section>

      <section className="section" id="product-experience">
        <div className="page-container">
          <div className="section-intro">
            <span>LIVE FEATURE INTELLIGENCE STREAM</span>
            <h2 style={{ color: activeCap.color, transition: "color 0.4s ease" }}>
              {typedText}
              <span className="typewriter-cursor" style={{ color: activeCap.color }}>|</span>
            </h2>
          </div>

          <div className="telemetry-card" style={{ borderColor: `${activeCap.color}55`, transition: "border-color 0.4s ease" }}>
            <div className="telemetry-badge" style={{ color: activeCap.color, borderColor: `${activeCap.color}55`, backgroundColor: `${activeCap.color}15`, transition: "all 0.4s ease" }}>
              {activeCap.badge}
            </div>
            <h3 key={`cap-title-${activeCapIndex}`} className="animate-fadeIn" style={{ color: activeCap.color, transition: "color 0.4s ease" }}>
              {activeCap.title}
            </h3>
            <p key={`cap-desc-${activeCapIndex}`} className="animate-fadeIn">
              {activeCap.description}
            </p>

            <div className="telemetry-stats-row">
              <span className="stat-pill" style={{ color: activeCap.color, borderColor: `${activeCap.color}55`, backgroundColor: `${activeCap.color}15`, transition: "all 0.4s ease" }}>✓ {activeCap.highlight}</span>
              <span className="stat-pill" style={{ color: activeCap.color, borderColor: `${activeCap.color}55`, backgroundColor: `${activeCap.color}15`, transition: "all 0.4s ease" }}>⚡ {activeCap.metric}</span>
            </div>

            <div className="slider-dots">
              {dynamicCapabilities.map((item, idx) => (
                <span
                  key={idx}
                  className={idx === activeCapIndex ? "active" : ""}
                  style={idx === activeCapIndex ? { backgroundColor: item.color } : {}}
                  onClick={() => {
                    setActiveCapIndex(idx);
                    setTypedText("");
                    setIsDeleting(false);
                  }}
                  title={`View capability ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="capabilities">
        <div className="page-container">
          <div className="capability-grid">
            {capabilityCards.map((card) => (
              <article className="capability-card" key={card.title}>
                <div className="capability-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <ul>
                  {card.points.map((point) => <li key={point}>✓ {point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="page-container">
          <div className="section-intro">
            <span>3-STEP PUBLISHING AUTOMATION</span>
            <h2>How Mini Post Studio Works</h2>
            <p>From single idea to multi-channel execution in under 60 seconds.</p>
          </div>

          <div className="steps-grid">
            <article>
              <span className="step-number orange">01</span>
              <h3>Input Master Concept</h3>
              <p>Enter your core product announcement, blog link, or campaign goal into our Creator Studio.</p>
            </article>
            <article>
              <span className="step-number purple">02</span>
              <h3>AI Multiplies Formats</h3>
              <p>Generate tailored posts for Facebook, Instagram, LinkedIn, X, and TikTok with platform-appropriate tone.</p>
            </article>
            <article>
              <span className="step-number green">03</span>
              <h3>Schedule & Publish</h3>
              <p>Review adaptations, prepare visual formats, and schedule directly into your content calendar.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="ai-engine">
        <div className="page-container">
          <div className="section-intro">
            <span>PLATFORM SUPERIORITY</span>
            <h2>Why Creators Switch to Mini Post App</h2>
          </div>

          <div className="comparison-wrap">
            <table>
              <thead>
                <tr>
                  <th>Feature Capabilities</th>
                  <th>Mini Post App</th>
                  <th>Traditional Buffer / Hootsuite</th>
                  <th>Manual Copy-Paste</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="page-container">
          <div className="section-intro">
            <span>★ TRUSTED BY 5,000+ CREATORS</span>
            <h2>What Modern Creators Say</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.name}>
                <div className="stars">★★★★★</div>
                <blockquote>“{item.quote}”</blockquote>
                <div className="person">
                  <span>{item.initials}</span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="page-container">
          <div className="cta-card">
            <h2>Ready to Multiply Your Social Media Reach?</h2>
            <p>Join thousands of creators, agencies, and brands publishing faster with Mini Post App.</p>
            <div className="cta-actions">
              <Link href="/dashboard/fast-post" className="cta-primary">Launch 7-Step Creator Studio →</Link>
              <Link href="/subscribe" className="cta-secondary">View Pricing Plans</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-container footer-top">
          <div className="footer-brand">
            <div className="brand footer-logo">
              <span className="brand-icon">◆</span>
              <span>MINI POST <strong>APP</strong></span>
            </div>
            <p>Enterprise-grade publishing and workflow infrastructure built for creators, publishers, agencies, brands, and teams.</p>
            <div className="social-links">
              <Link href="#">GitHub</Link><span>•</span>
              <Link href="#">Twitter</Link><span>•</span>
              <Link href="#">LinkedIn</Link>
            </div>
          </div>

          <div className="footer-column">
            <h3>Capabilities</h3>
            <Link href="/dashboard/fast-post">7-Step Pipeline Creator Studio (Fast Post)</Link>
            <Link href="/dashboard">Creator Studio Now</Link>
            <Link href="/dashboard/fast-post">Video Creator Studio</Link>
            <Link href="/dashboard">30-Day Content Calendar</Link>
          </div>

          <div className="footer-column">
            <h3>Resources</h3>
            <Link href="/dev-workspace">Developer Hub & Skeleton Box</Link>
            <Link href="/dashboard">Documentation & Dashboard</Link>
            <Link href="/dashboard">Changelog</Link>
            <Link href="/dashboard">System Status & Security</Link>
            <Link href="/dashboard">Security & Trust</Link>
            <Link href="/dashboard">Contact Us</Link>
          </div>

          <div className="footer-column">
            <h3>Legal</h3>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>

          <div className="footer-column">
            <h3>Compliance</h3>
            <Link href="/data-processing-agreement">Data Processing Agreement</Link>
            <Link href="/gdpr">GDPR Compliance</Link>
            <Link href="/subprocessors">Subprocessors</Link>
            <Link href="/data-deletion">Data Deletion Request</Link>
          </div>
        </div>

        <div className="page-container footer-middle">
          <Link href="/company">Company</Link><span>•</span>
          <Link href="/values">Our Values</Link><span>•</span>
          <Link href="/jobs">Jobs</Link><span>•</span>
          <Link href="/companies">Companies</Link><span>•</span>
          <Link href="/websites">Websites</Link><span>•</span>
          <Link href="/support">Customer Support</Link>
        </div>

        <div className="page-container footer-bottom">
          <p>© 2026 Mini Post App. All rights reserved. Owned and operated by Yoga Products Top Limited.</p>
          <p className="status">System Status: ● Fully Operational</p>
        </div>
      </footer>

      <Link href="/dashboard/fast-post" className="floating-action-btn" title="Open 7-Step Pipeline Creator Studio">
        +
      </Link>
    </main>
  );
}