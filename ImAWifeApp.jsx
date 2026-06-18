import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Flower2,
  Sparkles,
  Gem,
  Gift,
  Cookie,
  Mail,
  Wind,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  RefreshCcw,
  Book,
  Armchair,
  Plane,
  ChefHat,
  Film,
  PenTool,
  Link as LinkIcon,
  Send,
  Loader,
} from "lucide-react";

/* ============================================================
   CONFIG — edit these before sharing the app.
   Replace the placeholder `link` values with the real product /
   storefront URLs you want the "buy this for her" buttons to use.
   ============================================================ */
const GIFT_OPTIONS = [
  { id: "flowers", label: "Flowers", icon: Flower2, link: "https://example.com/REPLACE-WITH-FLOWER-LINK" },
  { id: "dessert", label: "Her Favorite Dessert", icon: Cookie, link: "https://example.com/REPLACE-WITH-DESSERT-LINK" },
  { id: "spa", label: "Spa Day", icon: Sparkles, link: "https://example.com/REPLACE-WITH-SPA-LINK" },
  { id: "jewelry", label: "Something Sparkly", icon: Gem, link: "https://example.com/REPLACE-WITH-JEWELRY-LINK" },
  { id: "date", label: "Date Night", icon: Heart, link: "https://example.com/REPLACE-WITH-DATE-NIGHT-LINK" },
  { id: "surprise", label: "His Choice — Surprise Me", icon: Gift, link: "https://example.com/REPLACE-WITH-SURPRISE-LINK" },
];

const SITUATIONS = [
  { id: "forgot", label: "He forgot something important", phrase: "you forgot something that mattered to me" },
  { id: "phone", label: "He was distracted / on his phone", phrase: "I felt like I was talking to your phone instead of you" },
  { id: "words", label: "Something he said stung", phrase: "something you said earlier really stuck with me" },
  { id: "help", label: "He didn't help enough", phrase: "I felt like I was carrying more than my share today" },
  { id: "dismissed", label: "He brushed off how I felt", phrase: "I felt brushed off when I tried to tell you how I felt" },
  { id: "plans", label: "He changed plans without asking", phrase: "I was looking forward to our plans and felt sidelined when they changed" },
  { id: "attention", label: "I felt invisible or unheard", phrase: "I felt invisible in that moment, like my presence didn't matter" },
  { id: "comparison", label: "He compared me to someone else", phrase: "when you compared me to someone else, it made me feel inadequate" },
  { id: "priority", label: "I wasn't a priority today", phrase: "today I felt like I wasn't a priority, and that hurt" },
  { id: "tone", label: "His tone was harsh or dismissive", phrase: "the tone you used made me feel small" },
  { id: "promise", label: "He broke a promise", phrase: "I was counting on you keeping that promise" },
  { id: "other", label: "Something else", phrase: null },
];

const AFFIRMATIONS = [
  "Your feelings are real, even if no one else noticed them today.",
  "You can love him and still feel hurt by him in the same breath.",
  "Needing a minute before you respond isn't weakness — it's wisdom.",
  "You don't have to perform \u201cfine.\u201d You're allowed to just be tired.",
  "Naming what hurt you isn't the same as starting a fight.",
  "You deserve care that doesn't require you to ask twice.",
  "It's okay to ask for what you need, even if it feels uncomfortable.",
  "Your boundaries are valid, even when they inconvenience others.",
  "Taking space to process your emotions is a sign of strength, not distance.",
  "You are allowed to change your mind and express new feelings.",
  "Your worth isn't measured by how much you tolerate.",
  "It's brave to be vulnerable, even when you're not sure how it will be received.",
  "You can be understanding without abandoning your own needs.",
  "Your intuition matters — trust what you're feeling.",
  "Healing happens in small moments of honesty, not just grand gestures.",
  "You are more than your role as a wife — you're a whole person with valid needs.",
  "It's okay to feel multiple emotions at once — love and frustration can coexist.",
  "Your voice matters, even when it shakes.",
  "Setting boundaries is an act of love for both of you.",
  "You don't have to have it all figured out right now.",
  "Your emotional labor is valuable and deserves recognition.",
  "It's okay to need reassurance — we all do sometimes.",
  "Your peace is worth protecting, even if it means saying no.",
  "You're doing the best you can with what you have today.",
  "Growth happens in the messy middle, not just at the destination.",
];

const BREATH_PHASES = [
  { name: "Breathe in", ms: 4000, scale: 1.35 },
  { name: "Hold", ms: 3000, scale: 1.35 },
  { name: "Breathe out", ms: 5000, scale: 1 },
];

const STEP_LABELS = ["What happened", "Breathe", "Affirmations", "A little something", "Tell him"];

export default function ImAWifeApp() {
  const [step, setStep] = useState(0); // 0 = landing
  const [situationId, setSituationId] = useState(null);
  const [customText, setCustomText] = useState("");
  const [affIndex, setAffIndex] = useState(0);
  const [giftIds, setGiftIds] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [subject, setSubject] = useState("Something I wanted to share 💛");
  const [body, setBody] = useState("");
  const [bodyTouched, setBodyTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pastedLink, setPastedLink] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const timeoutRef = useRef(null);

  // Breathing animation loop, only while on step 2
  useEffect(() => {
    if (step !== 2) return;
    const phase = BREATH_PHASES[phaseIdx];
    timeoutRef.current = setTimeout(() => {
      const next = (phaseIdx + 1) % BREATH_PHASES.length;
      if (next === 0) setCycles((c) => c + 1);
      setPhaseIdx(next);
    }, phase.ms);
    return () => clearTimeout(timeoutRef.current);
  }, [step, phaseIdx]);

  // Build the email body once when entering the final step (unless she's edited it)
  useEffect(() => {
    if (step === 5 && !bodyTouched) {
      setBody(buildBody());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Keep affirmation cycling alive while the user stays on step 3.
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(() => {
      setAffIndex((i) => (i + 1) % AFFIRMATIONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  function situationPhrase() {
    const s = SITUATIONS.find((x) => x.id === situationId);
    if (!s) return "something happened earlier that I want to be honest about";
    if (s.id === "other") return customText.trim() || "something happened earlier that I want to be honest about";
    return s.phrase;
  }

  function selectedGifts() {
    return GIFT_OPTIONS.filter((g) => giftIds.includes(g.id));
  }

  function giftSentence() {
    const gifts = selectedGifts();
    if (gifts.length === 0) return null;
    const labels = gifts.map((g) => g.label.toLowerCase());
    let joined;
    if (labels.length === 1) joined = labels[0];
    else if (labels.length === 2) joined = `${labels[0]} and ${labels[1]}`;
    else joined = `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
    return `Honestly, ${joined} would go a long way right now.`;
  }

  function buildBody() {
    const opener = senderName ? `Hey love,` : `Hey love,`;
    const gSentence = giftSentence();
    const linksBlock = selectedGifts()
      .map((g) => `${g.label}: ${g.link}`)
      .join("\n");

    const pastedLinkText = pastedLink ? `\nHere's something I wanted to share with you: ${pastedLink}` : "";

    return [
      opener,
      "",
      `I had a moment today — ${situationPhrase()}. I'm not upset forever, I just didn't want to swallow it and pretend it didn't happen.`,
      "",
      "I'm okay. I just needed a minute, and I took it instead of snapping at you.",
      gSentence ? "" : null,
      gSentence,
      linksBlock ? "" : null,
      linksBlock || null,
      pastedLinkText,
      "",
      `— ${senderName || "Me"}`,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  function toggleGift(id) {
    setGiftIds((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  function handleCopy() {
    navigator.clipboard?.writeText(body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  async function handleSendEmail() {
    if (!recipientEmail) return;
    
    setIsSendingEmail(true);
    setEmailError("");
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          senderName,
          subject: subject || 'You Messed Up',
          body,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        setEmailError(data.error || 'Failed to send email');
      }
    } catch (error) {
      setEmailError('Network error. Check the deployed app or local Vercel dev server.');
      console.error('Email sending error:', error);
    } finally {
      setIsSendingEmail(false);
    }
  }

  function handleOpenMail() {
    const params = new URLSearchParams({ subject: subject || 'You Messed Up', body });
    window.location.href = `mailto:${recipientEmail}?${params.toString()}`;
  }

  function regenerate() {
    setBody(buildBody());
    setBodyTouched(false);
  }

  function handlePasteLink(e) {
    const text = e.clipboardData.getData('text');
    if (text.match(/https?:\/\//)) {
      setPastedLink(text);
      // Auto-add to body if user hasn't edited it
      if (!bodyTouched) {
        setTimeout(() => {
          setBody(buildBody());
        }, 100);
      }
    }
  }

  const canContinueStep1 = situationId && (situationId !== "other" || customText.trim().length > 0);

  return (
    <div className="iaw-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..500&family=Work+Sans:wght@300;400;500;600&display=swap');

        /* Base styles for mobile-first design */
        .iaw-root {
          min-height: 100vh;
          width: 100%;
          font-family: 'Work Sans', sans-serif;
          color: #3D2630;
          background: radial-gradient(circle at 15% 10%, #FBE7DC 0%, #F6DACE 35%, #EFC9BD 70%, #E8B6A8 100%);
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .iaw-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 22px 22px;
          opacity: 0.35;
        }
        
        /* Typography */
        .iaw-serif { font-family: 'Fraunces', serif; }
        
        /* Responsive containers */
        .iaw-card {
          background: #FFFCF8;
          border-radius: 28px;
          box-shadow: 0 20px 50px -20px rgba(61,38,48,0.35), 0 2px 8px rgba(61,38,48,0.06);
          width: 100%;
          margin: 0 auto;
        }
        
        /* Touch-friendly interactive elements */
        .iaw-chip {
          border: 1.5px solid #E2978C55;
          background: #FFFCF8;
          transition: all 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .iaw-chip:hover, .iaw-chip:active {
          border-color: #C96B5E;
          transform: translateY(-1px);
        }
        .iaw-chip.selected {
          background: #C96B5E;
          border-color: #C96B5E;
          color: #FFF8F0;
        }
        
        /* Buttons with touch-friendly sizing */
        .iaw-btn-primary {
          background: #C96B5E;
          color: #FFF8F0;
          transition: all 0.18s ease;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          border: none;
        }
        .iaw-btn-primary:hover, .iaw-btn-primary:active {
          background: #B25749;
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -8px rgba(201,107,94,0.55);
        }
        .iaw-btn-primary:disabled { 
          opacity: 0.4; 
          transform: none; 
          box-shadow: none; 
          cursor: not-allowed; 
        }
        
        .iaw-btn-ghost {
          background: transparent;
          color: #6B4750;
          border: 1.5px solid #6B475033;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          transition: all 0.18s ease;
        }
        .iaw-btn-ghost:hover, .iaw-btn-ghost:active {
          border-color: #6B4750;
          transform: translateY(-1px);
        }
        
        /* Progress indicators */
        .iaw-dot { 
          width: 7px; 
          height: 7px; 
          border-radius: 50%; 
          background: #6B475033; 
        }
        .iaw-dot.active { 
          background: #C96B5E; 
          width: 20px; 
          border-radius: 4px; 
        }
        
        /* Breathing animation */
        .iaw-breath-circle {
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #F6DACE, #E2978C 65%, #C96B5E 100%);
          box-shadow: 0 0 0 14px #E2978C22, 0 30px 60px -20px rgba(201,107,94,0.5);
          transition: transform ease-in-out;
          width: 150px;
          height: 150px;
        }
        
        @media (min-width: 768px) {
          .iaw-breath-circle {
            width: 180px;
            height: 180px;
          }
        }
        
        /* Animations */
        .iaw-fade-in { 
          animation: iawFadeIn 0.5s ease both; 
        }
        @keyframes iawFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Background elements */
        .iaw-flower-bg {
          position: absolute;
          opacity: 0.12;
          color: #C96B5E;
          display: none;
        }
        
        @media (min-width: 768px) {
          .iaw-flower-bg {
            display: block;
          }
        }
        
        /* Form elements optimized for mobile */
        textarea.iaw-textarea {
          font-family: 'Work Sans', sans-serif;
          width: 100%;
          border: 1.5px solid #6B475033;
          border-radius: 16px;
          padding: 16px;
          background: #FFFEFB;
          resize: vertical;
          line-height: 1.6;
          font-size: 16px; /* Prevents iOS zoom on focus */
          min-height: 120px;
        }
        
        textarea.iaw-textarea:focus, 
        input.iaw-input:focus { 
          outline: none; 
          border-color: #C96B5E; 
        }
        
        input.iaw-input {
          font-family: 'Work Sans', sans-serif;
          width: 100%;
          border: 1.5px solid #6B475033;
          border-radius: 14px;
          padding: 14px 16px;
          background: #FFFEFB;
          font-size: 16px; /* Prevents iOS zoom on focus */
          min-height: 48px;
        }
        
        /* Mobile-safe grid layouts */
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
          
          .gap-3 {
            gap: 2rem;
          }
          
          .p-8 {
            padding: 1.5rem;
          }
          
          .p-10 {
            padding: 2rem;
          }
          
          .text-4xl {
            font-size: 2rem;
            line-height: 2.5rem;
          }
          
          .text-5xl {
            font-size: 2.5rem;
            line-height: 3rem;
          }
        }
        
        /* Safe area handling for notched phones */
        @supports (padding: max(0px)) {
          .iaw-root {
            padding-left: max(1rem, env(safe-area-inset-left));
            padding-right: max(1rem, env(safe-area-inset-right));
          }
        }
        
        /* Loading spinner animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <Flower2 className="iaw-flower-bg" size={180} style={{ top: -30, right: -40, transform: "rotate(15deg)" }} />
      <Flower2 className="iaw-flower-bg" size={120} style={{ bottom: 40, left: -30, transform: "rotate(-20deg)" }} />

      {/* Header */}
      <div className="w-full max-w-2xl px-6 pt-10 pb-4 flex flex-col items-center relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Heart size={18} color="#C96B5E" fill="#C96B5E" />
          <span className="text-xs tracking-[0.2em] uppercase text-[#6B4750]">I'm a Wife</span>
        </div>
        {step > 0 && (
          <div className="flex gap-2 mt-3">
            {STEP_LABELS.map((_, i) => (
              <div key={i} className={`iaw-dot ${i + 1 === step ? "active" : ""}`} />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="w-full max-w-2xl px-6 pb-16 flex-1 flex flex-col items-center relative z-10">
        {step === 0 && (
          <div className="iaw-card iaw-fade-in w-full p-10 md:p-14 flex flex-col items-center text-center mt-6">
            <h1 className="iaw-serif text-4xl md:text-5xl leading-tight mb-4" style={{ color: "#3D2630" }}>
              A soft place to land<br />before you press send.
            </h1>
            <p className="text-[#6B4750] max-w-md mb-8 leading-relaxed">
              Name what happened, breathe for a minute, remember you're not the problem —
              then tell him about it like a grown woman instead of a slammed door.
            </p>
            <button className="iaw-btn-primary rounded-full px-8 py-3.5 flex items-center gap-2 font-medium" onClick={() => setStep(1)}>
              Begin <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="iaw-card iaw-fade-in w-full p-8 md:p-10 mt-4">
            <h2 className="iaw-serif text-2xl md:text-3xl mb-2">What happened?</h2>
            <p className="text-[#6B4750] mb-6 text-sm">Pick what's closest — you can say more in your own words after.</p>
            <div className="grid grid-cols-1 gap-2.5">
              {SITUATIONS.map((s) => (
                <button
                  key={s.id}
                  className={`iaw-chip rounded-2xl px-5 py-3.5 text-left text-sm font-medium ${situationId === s.id ? "selected" : ""}`}
                  onClick={() => setSituationId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {situationId === "other" && (
              <textarea
                className="iaw-textarea mt-4 text-sm"
                rows={3}
                placeholder="Tell it your way..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
            )}
            <div className="flex justify-between mt-8">
              <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center gap-1.5" onClick={() => setStep(0)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center gap-1.5"
                disabled={!canContinueStep1}
                onClick={() => {
                  setStep(2);
                  setPhaseIdx(0);
                  setCycles(0);
                }}
              >
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="iaw-card iaw-fade-in w-full p-8 md:p-10 mt-4 flex flex-col items-center text-center">
            <h2 className="iaw-serif text-2xl md:text-3xl mb-2">Just breathe for a second.</h2>
            <p className="text-[#6B4750] mb-8 text-sm">No rush. Stay as long as you want.</p>
            <div
              className="iaw-breath-circle flex items-center justify-center mb-8"
              style={{
                width: 180,
                height: 180,
                transform: `scale(${BREATH_PHASES[phaseIdx].scale})`,
                transitionDuration: `${BREATH_PHASES[phaseIdx].ms}ms`,
              }}
            >
              <Wind color="#FFF8F0" size={32} />
            </div>
            <p className="iaw-serif text-xl mb-1" style={{ color: "#C96B5E" }}>{BREATH_PHASES[phaseIdx].name}</p>
            <p className="text-xs text-[#6B475099] mb-8">{cycles} full cycle{cycles === 1 ? "" : "s"} done</p>
            <div className="flex justify-between w-full">
              <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center gap-1.5" onClick={() => setStep(1)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button
                className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center gap-1.5"
                onClick={() => {
                  setStep(3);
                  setAffIndex(0);
                }}
              >
                I'm ready <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="iaw-card iaw-fade-in w-full p-8 md:p-10 mt-4 flex flex-col items-center text-center">
            <h2 className="iaw-serif text-2xl md:text-3xl mb-6">A few true things.</h2>
            <div className="w-full max-w-sm mb-5">
              <div className="h-1.5 rounded-full bg-[#E2978C22] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "100%",
                    background: "linear-gradient(90deg, #E2978C, #C96B5E)",
                    animation: "iawAffirmationSweep 2s linear infinite",
                    transformOrigin: "left center",
                  }}
                />
              </div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6B475099] mt-2">
                Auto-rotates every 2 seconds
              </p>
            </div>
            <div
              className="rounded-3xl px-8 py-10 mb-6 w-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #F6DACE, #EFC9BD)", minHeight: 160 }}
            >
              <p className="iaw-serif text-xl md:text-2xl leading-snug text-center max-w-md" style={{ color: "#3D2630" }}>
                {AFFIRMATIONS[affIndex]}
              </p>
            </div>
            <div className="flex gap-1.5 mb-8">
              {AFFIRMATIONS.map((_, i) => (
                <div key={i} className={`iaw-dot ${i === affIndex ? "active" : ""}`} />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-8">
              <button
                className="iaw-btn-ghost rounded-full px-5 py-2 text-sm"
                onClick={() => setAffIndex((i) => (i - 1 + AFFIRMATIONS.length) % AFFIRMATIONS.length)}
              >
                Previous
              </button>
              <button
                className="iaw-btn-ghost rounded-full px-5 py-2 text-sm"
                onClick={() => setAffIndex((i) => (i + 1) % AFFIRMATIONS.length)}
              >
                Another one
              </button>
            </div>
            <div className="flex justify-between w-full">
              <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center gap-1.5" onClick={() => setStep(2)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center gap-1.5" onClick={() => setStep(4)}>
                I feel a little better <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="iaw-card iaw-fade-in w-full p-6 md:p-10 mt-4">
            <h2 className="iaw-serif text-2xl md:text-3xl mb-2">A little something would help.</h2>
            <p className="text-[#6B4750] mb-6 text-sm">Pick whatever sounds good. He's buying.</p>
            <div className="grid grid-cols-2 gap-3">
              {GIFT_OPTIONS.map((g) => {
                const Icon = g.icon;
                const sel = giftIds.includes(g.id);
                return (
                  <button
                    key={g.id}
                    className={`iaw-chip rounded-2xl px-4 py-5 flex flex-col items-center gap-2 text-sm font-medium text-center ${sel ? "selected" : ""}`}
                    onClick={() => toggleGift(g.id)}
                  >
                    <Icon size={22} />
                    {g.label}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-8">
              <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center gap-1.5" onClick={() => setStep(3)}>
                <ArrowLeft size={15} /> Back
              </button>
              <button className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center gap-1.5" onClick={() => setStep(5)}>
                Continue <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="iaw-card iaw-fade-in w-full p-8 md:p-10 mt-4">
            <h2 className="iaw-serif text-2xl md:text-3xl mb-2">Tell him, gently.</h2>
            <p className="text-[#6B4750] mb-6 text-sm">Edit anything you want — it's your voice, not a script.</p>

            <div className="rounded-[30px] border border-[#E2978C33] bg-[#FFF8F0] p-4 md:p-5 mb-5 shadow-[0_14px_30px_-26px_rgba(61,38,48,0.28)]">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon size={16} className="text-[#C96B5E]" />
                <label className="text-sm font-medium text-[#3D2630]">Share one useful link</label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  className="iaw-input text-sm flex-1"
                  type="text"
                  placeholder="Paste any link here (product, article, video, etc.)"
                  value={pastedLink}
                  onChange={(e) => setPastedLink(e.target.value)}
                  onPaste={handlePasteLink}
                />
                <button
                  className="iaw-btn-ghost rounded-full px-4 py-2.5 text-sm whitespace-nowrap"
                  onClick={() => {
                    setPastedLink("");
                    if (!bodyTouched) {
                      setBody(buildBody());
                    }
                  }}
                >
                  Clear Link
                </button>
              </div>
              {pastedLink && (
                <p className="text-xs text-[#6B475080] mt-2">
                  ✓ Link added. It will flow into the note automatically.
                </p>
              )}
            </div>

            <div className="rounded-[30px] border border-[#E2978C33] bg-[#FFFEFB] p-4 md:p-5 mb-5 shadow-[0_14px_30px_-26px_rgba(61,38,48,0.22)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-[#6B475099] mb-1.5 block">His email</label>
                  <input className="iaw-input text-sm" type="email" placeholder="him@email.com" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-[#6B475099] mb-1.5 block">Your name</label>
                  <input className="iaw-input text-sm" type="text" placeholder="Your name" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                </div>
              </div>

              <label className="text-xs uppercase tracking-wide text-[#6B475099] mb-1.5 block">Subject</label>
              <input className="iaw-input text-sm mb-2" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div className="rounded-[30px] border border-[#E2978C33] bg-[#FFFDFC] p-4 md:p-5 mb-6 shadow-[0_14px_30px_-26px_rgba(61,38,48,0.22)]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wide text-[#6B475099] block">Message</label>
                <button className="text-xs flex items-center gap-1 text-[#C96B5E] hover:underline" onClick={regenerate}>
                  <RefreshCcw size={12} /> Rewrite for me
                </button>
              </div>
              <textarea
                className="iaw-textarea text-sm"
                rows={10}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  setBodyTouched(true);
                }}
              />
            </div>

            {/* Status Messages */}
            {emailError && (
              <div className="mb-4 p-4 rounded-[24px] bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{emailError}</p>
                <p className="text-xs text-red-600 mt-1">Make sure the app endpoint is reachable on this origin.</p>
              </div>
            )}
            
            {emailSent && (
              <div className="mb-4 p-4 rounded-[24px] bg-green-50 border border-green-200">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <Check size={16} /> Email sent successfully via SMTP!
                </p>
              </div>
            )}

            <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-between md:items-center">
              <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center gap-1.5 justify-center" onClick={() => setStep(4)}>
                <ArrowLeft size={15} /> Back
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
                <button className="iaw-btn-ghost rounded-full px-5 py-2.5 text-sm flex items-center justify-center gap-1.5" onClick={handleCopy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
                </button>
                <button
                  className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"
                  disabled={!recipientEmail || isSendingEmail}
                  onClick={handleOpenMail}
                >
                  <Mail size={15} /> Open Mail App
                </button>
                <button
                  className="iaw-btn-primary rounded-full px-7 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"
                  style={{ background: '#4A6FA5' }}
                  disabled={!recipientEmail || isSendingEmail}
                  onClick={handleSendEmail}
                >
                  {isSendingEmail ? <Loader size={15} className="animate-spin" /> : <Send size={15} />} 
                  {isSendingEmail ? 'Sending...' : 'Send via SMTP'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-[11px] text-[#6B475080] text-center px-8 pb-8 max-w-md relative z-10">
        Made with care, for the moments that don't need a fight to be heard.<br />
        Not a substitute for actually talking to him — just a softer way in.
      </p>
      <style>{`
        @keyframes iawAffirmationSweep {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
