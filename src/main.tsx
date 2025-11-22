import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {Github, BookOpen} from 'lucide-react';

// --- Assets ---
// 1. 修改头像：将下面的链接替换为您自己的图片路径
const PROFILE_PIC = "OIP-pixelized.png";

// 2. 修改校徽：将下面的链接替换为您自己的校徽图片路径
const SCAU_LOGO = "scau.png";
const UMICH_LOGO = "umich.png";

// --- Types ---
type Project = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
};

type SocialLink = {
  name: string;
  color: string;
  textColor: string;
  icon: React.ReactNode;
  url: string;
  description: string;
};

// --- Data ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "High-Freq Trading Engine",
    description: "A low-latency C++ engine for market making strategies. Includes order book reconstruction and execution optimization.",
    tags: ["C++", "Python", "Market Microstructure"],
    link: "#"
  },
  {
    id: 2,
    title: "Bayesian Option Pricing",
    description: "MCMC simulation framework for pricing exotic options with stochastic volatility models.",
    tags: ["R", "Statistics", "Monte Carlo"],
    link: "#"
  },
  {
    id: 3,
    title: "Alternative Data NLP",
    description: "Sentiment analysis pipeline using Transformers on financial news to predict short-term price movements.",
    tags: ["PyTorch", "NLP", "Time Series"],
    link: "#"
  },
  {
    id: 4,
    title: "Crypto Arbitrage Bot",
    description: "Real-time triangular arbitrage detection across decentralized exchanges on Ethereum.",
    tags: ["Solidity", "Rust", "DeFi"],
    link: "#"
  },
  {
    id: 5,
    title: "Portfolio Optimizer",
    description: "Mean-variance optimization tool using modern portfolio theory with constraints for transaction costs.",
    tags: ["Python", "Pandas", "Optimization"],
    link: "#"
  },
  {
    id: 6,
    title: "Volatility Surface Viz",
    description: "Interactive 3D visualization of implied volatility surfaces for major indices.",
    tags: ["D3.js", "React", "Finance"],
    link: "#"
  }
];

const SOCIALS: SocialLink[] = [
  {
    name: "X",
    color: "bg-black",
    textColor: "text-white",
    icon: <span className="font-bold text-lg font-mono">X</span>,
    url: "https://x.com/000li718377",
    description: "Thoughts & Takes"
  },
  {
    name: "Xiaohongshu",
    color: "bg-red-500",
    textColor: "text-white",
    icon: <span className="font-bold text-lg">RED</span>,
    url: "https://www.xiaohongshu.com",
    description: "Lifestyle & Notes"
  },
  {
    name: "Zhihu",
    color: "bg-blue-500",
    textColor: "text-white",
    icon: <span className="font-bold text-lg">知</span>,
    url: "https://www.zhihu.com",
    description: "Q&A Community"
  },
  {
    name: "Google Scholar",
    color: "bg-gray-100",
    textColor: "text-slate-900",
    icon: <BookOpen size={20} />,
    url: "https://scholar.google.com",
    description: "Academic Research"
  }
];

// --- Components ---

interface PixelCardProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`relative bg-[#24283b] border-4 border-black p-6 pixel-shadow transition-all duration-200 ${className}`}
  >
    {children}
  </div>
);

const SocialDeck = () => {
  const [deckHovered, setDeckHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div 
      className="relative h-64 w-full max-w-xs mx-auto mt-12 group"
      onMouseEnter={() => setDeckHovered(true)}
      onMouseLeave={() => {
        setDeckHovered(false);
        setHoveredIndex(null);
      }}
    >
      {SOCIALS.map((social, index) => {
        // Determine if this specific card is being hovered
        const isCardHovered = hoveredIndex === index;
        
        // Calculate transforms for the "fanning" effect
        // When deck is hovered, spread them out more. 
        const rotation = deckHovered ? (index - 1.5) * 10 : (index - 1.5) * 4;
        const translateX = deckHovered ? (index - 1.5) * 60 : (index - 1.5) * 10;
        
        // If this card is hovered, pop it up significantly (Y axis)
        const translateY = isCardHovered ? -40 : (deckHovered ? 0 : (index - 1.5) * 4);
        
        // Z-index logic: 
        // 1. If hovered, this card is absolutely on top (50).
        // 2. If not hovered, but deck is hovered, we keep original order.
        // 3. Default stack order.
        const zIndex = isCardHovered ? 50 : index;

        return (
          <a 
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`absolute top-0 left-0 w-full h-48 border-4 border-black flex flex-col items-center justify-center transition-all duration-300 ease-out shadow-xl ${social.color} ${social.textColor}`}
            style={{
              transform: `rotate(${isCardHovered ? 0 : rotation}deg) translate(${translateX}px, ${translateY}px) scale(${isCardHovered ? 1.1 : 1})`,
              zIndex: zIndex,
            }}
          >
            <div className="mb-2 p-2 border-2 border-black bg-white/20 rounded-none backdrop-blur-sm">
              {social.icon}
            </div>
            <h3 className="text-xl font-bold font-['Press_Start_2P']">{social.name}</h3>
            <p className={`text-sm mt-2 transition-opacity duration-300 ${deckHovered ? 'opacity-100' : 'opacity-0'} font-sans font-bold`}>
              {deckHovered ? "CLICK TO OPEN" : social.description}
            </p>
            
            {/* Corner decorative pixels */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-black/20"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-black/20"></div>
          </a>
        );
      })}
      <div className="absolute -bottom-10 w-full text-center text-gray-500 text-lg pointer-events-none font-['Press_Start_2P'] text-xs">
        {deckHovered ? "SELECT A CARD" : "HOVER TO REVEAL"}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Fixed height to 290px to match the compact look */}
      <PixelCard className="h-[290px] flex flex-col justify-between hover:bg-[#292e42] group pixel-shadow-hover">
        <div>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-[#7aa2f7] text-xl font-bold leading-tight font-['Press_Start_2P'] mb-1">
              {project.title}
            </h3>
            <span className="text-[#565f89] text-base font-bold">ID:0{project.id}</span>
          </div>
          <p className="text-[#a9b1d6] text-xl mb-4 leading-relaxed line-clamp-3 font-medium">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-[#414868] text-[#7dcfff] text-lg border-2 border-[#1a1b26]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <a 
          href={project.link}
          className="inline-flex items-center justify-center w-full py-2 bg-[#73daca] text-[#1a1b26] font-bold border-4 border-black hover:bg-[#9ece6a] transition-colors font-['Press_Start_2P'] text-sm"
        >
          <Github size={16} className="mr-2" />
          VIEW REPO
        </a>
      </PixelCard>
    </div>
  );
};

const Avatar = () => (
  <div className="relative w-48 h-48 mx-auto md:mx-0 mb-8 md:mb-0">
    {/* Circular Avatar Container: rounded-full */}
    <div className="w-full h-full rounded-full border-4 border-black pixel-shadow overflow-hidden bg-[#7aa2f7]">
      <img 
        src={PROFILE_PIC} 
        alt="Colin's Avatar"
        className="w-full h-full object-cover image-pixelated bg-[#1a1b26]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  </div>
);

const App = () => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(PROJECTS.length / itemsPerPage);
  
  const currentProjects = PROJECTS.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Create a fixed array of 4 items, filling with null if necessary to maintain layout size
  const paddedProjects = Array.from({ length: itemsPerPage }, (_, i) => 
    currentProjects[i] || null
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      
      {/* Navbar / Top Bar */}
      <nav className="flex justify-between items-center mb-8 border-b-4 border-[#414868] pb-4">
        <div className="text-[#7aa2f7] text-xl font-['Press_Start_2P']">
          COLIN.GITHUB
        </div>
        <div className="flex gap-4 text-sm md:text-lg">
          {/* Navigation links removed as requested */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 mb-20">
        
        {/* Left: Intro */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <Avatar />
          
          <div className="mt-8 space-y-6">
            
            <h1 className="text-4xl md:text-5xl leading-tight font-['Press_Start_2P'] text-white">
              Hi, I'm <span className="text-[#7aa2f7]">Colin</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-[#9ece6a]">
              Quantitative Developer
            </h2>
            <p className="text-xl text-[#a9b1d6] max-w-lg leading-relaxed border-l-4 border-[#414868] pl-4">
              Majoring in <span className="text-white underline decoration-[#bb9af7]">Statistics</span>. 
              Build data-driven solutions and explore markets through algorithms.
            </p>
            
            {/* Education / Badges */}
            <div className="flex gap-6 pt-4 justify-center md:justify-start">
              <a 
                href="https://www.scau.edu.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block w-16 h-16 bg-transparent p-1 border-2 border-black pixel-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200"
                title="South China Agricultural University"
              >
                <img 
                  src={SCAU_LOGO} 
                  alt="SCAU" 
                  className="w-full h-full object-contain"
                />
              </a>
              <a 
                href="https://umich.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block w-16 h-16 bg-transparent p-1 border-2 border-black pixel-shadow hover:translate-y-1 hover:shadow-none transition-all duration-200"
                title="University of Michigan"
              >
                <img 
                  src={UMICH_LOGO} 
                  alt="UMich" 
                  className="w-full h-full object-contain"
                />
              </a>
            </div>

          </div>
        </div>

        {/* Right: Social Deck */}
        <div className="w-full md:w-1/2 flex justify-center items-center min-h-[300px]">
          <SocialDeck />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center mb-12 animate-bounce">
        <div className="text-center">
          <p className="mb-2 text-[#565f89] text-xs">SCROLL FOR QUESTS</p>
          <div className="w-6 h-8 border-4 border-[#565f89] flex justify-center p-1">
             <div className="w-full h-2 bg-[#7aa2f7]"></div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-2 w-12 bg-[#7aa2f7]"></div>
           <h2 className="text-2xl font-['Press_Start_2P'] text-white">PROJECT_LOGS</h2>
           <div className="h-2 flex-grow bg-[#414868]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {paddedProjects.map((project, index) => (
            project ? (
              <ProjectCard key={project.id} project={project} index={index} />
            ) : (
              // Invisible placeholder with fixed height [290px] to maintain structure
              <div key={`placeholder-${index}`} className="h-[290px] border-4 border-transparent p-6 invisible" aria-hidden="true"></div>
            )
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-8 mt-8 font-['Press_Start_2P'] text-sm">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 border-4 border-black transition-all ${
              currentPage === 1 
              ? 'bg-[#24283b] text-[#414868] cursor-not-allowed opacity-50' 
              : 'bg-[#73daca] text-[#1a1b26] hover:bg-[#9ece6a] pixel-shadow hover:translate-y-1 hover:shadow-none'
            }`}
          >
            {"< PREV"}
          </button>
          
          <span className="text-[#7aa2f7] bg-[#24283b] px-4 py-2 border-2 border-[#414868]">
            PAGE {currentPage}/{totalPages}
          </span>

          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border-4 border-black transition-all ${
              currentPage === totalPages 
              ? 'bg-[#24283b] text-[#414868] cursor-not-allowed opacity-50' 
              : 'bg-[#73daca] text-[#1a1b26] hover:bg-[#9ece6a] pixel-shadow hover:translate-y-1 hover:shadow-none'
            }`}
          >
            {"NEXT >"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-[#414868] pt-8 pb-8 text-center text-[#565f89]">
      </footer>

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);