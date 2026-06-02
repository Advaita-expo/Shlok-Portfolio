import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MutableRefObject, ReactNode } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  Braces,
  ChartBar,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Server,
  Table2,
  Terminal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Page = 'home' | 'about' | 'projects' | 'playground' | 'contact' | 'race';
type RaceStatus = 'idle' | 'countdown' | 'racing';

type NavItem = {
  page: Page;
  label: string;
  path: string;
};

type Project = {
  title: string;
  type: string;
  description: string;
  link?: string;
  tags: string[];
};

type Paper = {
  title: string;
  venue: string;
  focus: string;
};

type LookState = {
  x: number;
  y: number;
  cursorX: number;
  cursorY: number;
};

type FlightBoardEntry = {
  city: string;
  timeZone: string;
  status: string;
  headline: string;
  detail: string;
};

type FlightBoardState = FlightBoardEntry & {
  time: string;
  index: number;
};

type ThankYouItem = {
  language: string;
  text: string;
  color: string;
  compact?: boolean;
  vertical?: boolean;
};

type Vec3 = [number, number, number];
type Edge = [number, number];
type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  blue: boolean;
  twinkle: number;
  speed: number;
};

const profileImage = '/assets/shlok-profile.jpg';

const navLeft: NavItem[] = [
  { page: 'projects', label: 'PROJECTS', path: '/projects' },
  { page: 'about', label: 'ABOUT', path: '/about' },
];

const navRight: NavItem[] = [
  { page: 'playground', label: 'PLAYGROUND', path: '/playground' },
  { page: 'contact', label: 'CONTACT', path: '/contact' },
];

const homeNav: NavItem = { page: 'home', label: 'HOME', path: '/' };
const raceNav: NavItem = { page: 'race', label: 'RACE', path: '/race' };
const allNav = [...navLeft, ...navRight, raceNav, homeNav];

const projects: Project[] = [
  {
    title: 'voices.somaiya.edu',
    type: 'LIVE WEB BUILD',
    description:
      'Built the public website for Somaiya Voices, giving the university media body a responsive platform for articles, updates, and public communication.',
    link: 'https://voices.somaiya.edu',
    tags: ['Frontend', 'Content', 'Responsive'],
  },
  {
    title: 'OULAD Machine Learning Framework',
    type: 'ML RESEARCH',
    description:
      'Built a student dropout risk prediction framework using OULAD behavioural learning analytics, Random Forest, XGBoost, and engineered VLE interaction features.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost'],
  },
  {
    title: 'Stock Forecasting & Trading Strategy',
    type: 'FINANCE AI',
    description:
      'Designed time-series forecasting and ML-based market prediction experiments across INFY, TCS, and HCLTECH using RMSE, MAE, and Sharpe Ratio evaluation.',
    tags: ['Machine Learning', 'Time Series', 'RMSE', 'Sharpe Ratio'],
  },
  {
    title: 'Somaiya Learning Management System',
    type: 'ACADEMIC SOFTWARE',
    description:
      'University academic software system with course management, student tracking, academic analytics, faculty dashboards, and MSSQL-backed C# application logic.',
    tags: ['C#', '.NET', 'MSSQL', 'Academic Analytics'],
  },
  {
    title: 'College Resource Management',
    type: 'SYSTEM DESIGN',
    description:
      'A Python, Tkinter, and MySQL system for scheduling resources, managing access, reporting activity, and improving college operations.',
    link: 'https://github.com/Advaita-expo/Resource-Management-.git',
    tags: ['Python', 'MySQL', 'DBMS'],
  },
];

const papers: Paper[] = [
  {
    title:
      'A Hybrid Deep Learning Framework for Stock Market Prediction in the Indian Equity Market Using Technical Indicators, Sentiment Analysis, and Machine Learning Models',
    venue: 'International Journal of Advanced Research in Science, Communication and Technology',
    focus: 'Finance AI, sentiment analysis, technical indicators, and hybrid prediction systems',
  },
  {
    title: 'Evaluating the Impact of Class Imbalance Handling in the OULAD Dataset',
    venue: 'IGNITE Pune IEEE Conference',
    focus: 'Learning analytics, student outcome prediction, and imbalanced classification',
  },
];

const roles = [
  ['Lead Developer', 'Qsentia', 'Current product and web development.'],
  ['Technical Intern', 'MyTrueMatch', 'Startup product implementation and engineering support.'],
  ['Website Developer', 'Somaiya Voices', 'Built the live public platform at voices.somaiya.edu.'],
  ['Web Development Intern', 'Global Consulting Professionals', 'Responsive web interfaces and application UI improvements in Bangalore.'],
  ['Salesforce Developer Intern', 'Kasmo Digital', 'Salesforce CRM configuration and workflow automation.'],
];

const leadership = [
  'Director of Delegate Affairs, Lokneeti MUN',
  'Head of Content and PR, Somaiya Vidyavihar',
  'Joint Head of Administration, Cultural Forum SSBSAS',
  'Hackathon Advisory, Somaiya School of Basic and Applied Science',
  'United Nations Volunteers, ITU and UNDP Kenya',
];

const technicalSkills: Array<{ label: string; Icon: LucideIcon }> = [
  { label: 'Python', Icon: Terminal },
  { label: 'Machine Learning', Icon: BrainCircuit },
  { label: 'Scikit-learn', Icon: BrainCircuit },
  { label: 'XGBoost', Icon: ChartBar },
  { label: 'SQL', Icon: Database },
  { label: 'Microsoft SQL Server', Icon: Server },
  { label: 'C#', Icon: Braces },
  { label: '.NET', Icon: Cpu },
  { label: 'Pandas', Icon: Table2 },
  { label: 'NumPy', Icon: ChartBar },
  { label: 'C++', Icon: FileCode2 },
  { label: 'HTML', Icon: FileCode2 },
  { label: 'CSS', Icon: Braces },
  { label: 'Git', Icon: GitBranch },
];

const education = {
  degree: 'B.Sc Computer Science',
  institution: 'Somaiya School of Basic and Applied Sciences, Somaiya Vidyavihar University',
  performance: '9+ GPA maintained across semesters',
  focus: 'Machine Learning Research, Data Science Projects, Technology Development',
};

const flightBoardEntries: FlightBoardEntry[] = [
  {
    city: 'MUMBAI',
    timeZone: 'Asia/Kolkata',
    status: 'WEATHER IS GOOD TODAY',
    headline: 'JAGUAR IS WATCHING YOU',
    detail: 'BAGHEERA SIGNAL LIVE',
  },
  {
    city: 'BANGALORE',
    timeZone: 'Asia/Kolkata',
    status: 'HELLO FROM BAGHEERA',
    headline: 'HELLO FROM BAGHEERA',
    detail: 'SYSTEMS LOOKING SHARP',
  },
  {
    city: 'NEW YORK',
    timeZone: 'America/New_York',
    status: 'JAGUAR IS WATCHING YOU',
    headline: 'WEATHER IS GOOD TODAY',
    detail: 'CITY CLOCK SYNCED',
  },
];

const thankYouItems: ThankYouItem[] = [
  { language: 'ENGLISH', text: 'Thank you', color: '#f3f0ea' },
  { language: 'HINDI', text: 'धन्यवाद', color: '#d7f1ff' },
  { language: 'URDU', text: 'شکریہ', color: '#9edcff' },
  { language: 'ARABIC', text: 'شكراً', color: '#d7f1ff' },
  { language: 'SPANISH', text: 'Gracias', color: '#f3f0ea' },
  { language: 'FRENCH', text: 'Merci', color: '#d7f1ff' },
  { language: 'CHINESE', text: '谢谢', color: '#22afff', vertical: true },
  { language: 'JAPANESE', text: 'ありがとう', color: '#22afff', vertical: true },
  { language: 'KOREAN', text: '감사합니다', color: '#22afff', vertical: true },
  { language: 'TAMIL', text: 'நன்றி', color: '#d7f1ff' },
  { language: 'KANNADA', text: 'ಧನ್ಯವಾದಗಳು', color: '#9edcff', compact: true },
  { language: 'MARATHI', text: 'धन्यवाद', color: '#d7f1ff' },
  { language: 'GUJARATI', text: 'આભાર', color: '#9edcff' },
  { language: 'SINDHI', text: 'مهرباني', color: '#d7f1ff' },
];

const jaguarVertices: Vec3[] = [
  [0, -178, 35],
  [-104, -150, 72],
  [0, -154, 92],
  [104, -150, 72],
  [-158, -132, -20],
  [-114, -154, 18],
  [114, -154, 18],
  [158, -132, -20],
  [-164, -213, -35],
  [164, -213, -35],
  [-134, -102, 112],
  [-66, -116, 148],
  [0, -108, 156],
  [66, -116, 148],
  [134, -102, 112],
  [-210, -20, 32],
  [-176, -10, 108],
  [176, -10, 108],
  [210, -20, 32],
  [-132, -70, 126],
  [-76, -82, 152],
  [-104, -48, 128],
  [-106, -98, 126],
  [76, -82, 152],
  [132, -70, 126],
  [104, -48, 128],
  [106, -98, 126],
  [-38, -42, 168],
  [0, -34, 180],
  [38, -42, 168],
  [-98, 28, 178],
  [-52, 12, 192],
  [0, 12, 202],
  [52, 12, 192],
  [98, 28, 178],
  [-68, 66, 172],
  [0, 74, 182],
  [68, 66, 172],
  [-82, 150, 136],
  [0, 170, 124],
  [82, 150, 136],
  [-170, 72, 72],
  [-158, 138, 42],
  [158, 138, 42],
  [170, 72, 72],
  [-98, -144, -78],
  [0, -150, -96],
  [98, -144, -78],
  [-162, -48, -84],
  [0, -62, -108],
  [162, -48, -84],
  [-146, 96, -68],
  [0, 112, -80],
  [146, 96, -68],
  [-92, 198, 24],
  [0, 210, 14],
  [92, 198, 24],
];

const jaguarEdges: Edge[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 46],
  [4, 5],
  [4, 8],
  [5, 8],
  [4, 45],
  [5, 1],
  [6, 7],
  [6, 9],
  [7, 9],
  [7, 47],
  [6, 3],
  [45, 8],
  [47, 9],
  [45, 46],
  [47, 46],
  [45, 48],
  [47, 50],
  [1, 2],
  [2, 3],
  [1, 5],
  [3, 6],
  [1, 10],
  [2, 11],
  [2, 12],
  [2, 13],
  [3, 14],
  [1, 4],
  [3, 7],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [10, 15],
  [10, 19],
  [11, 20],
  [11, 21],
  [12, 21],
  [12, 25],
  [13, 23],
  [14, 17],
  [14, 24],
  [15, 16],
  [16, 17],
  [17, 18],
  [15, 41],
  [18, 44],
  [15, 48],
  [18, 50],
  [16, 30],
  [16, 19],
  [17, 34],
  [17, 24],
  [15, 19],
  [18, 24],
  [19, 20],
  [20, 21],
  [21, 19],
  [19, 22],
  [22, 20],
  [21, 25],
  [20, 23],
  [23, 24],
  [24, 25],
  [25, 23],
  [24, 26],
  [26, 23],
  [27, 28],
  [28, 29],
  [20, 27],
  [27, 31],
  [28, 32],
  [29, 33],
  [23, 29],
  [21, 27],
  [22, 30],
  [25, 29],
  [26, 34],
  [30, 31],
  [31, 32],
  [32, 33],
  [33, 34],
  [30, 35],
  [34, 37],
  [31, 36],
  [33, 36],
  [32, 36],
  [30, 16],
  [34, 17],
  [35, 36],
  [36, 37],
  [35, 38],
  [37, 40],
  [36, 39],
  [38, 39],
  [39, 40],
  [38, 42],
  [40, 43],
  [39, 55],
  [41, 42],
  [43, 44],
  [42, 54],
  [43, 56],
  [42, 51],
  [43, 53],
  [41, 15],
  [44, 18],
  [54, 55],
  [55, 56],
  [54, 51],
  [56, 53],
  [51, 52],
  [52, 53],
  [54, 42],
  [56, 43],
  [46, 47],
  [48, 49],
  [49, 50],
  [49, 52],
  [41, 48],
  [44, 50],
  [10, 5],
  [14, 6],
  [16, 27],
  [17, 29],
  [19, 30],
  [24, 34],
  [22, 35],
  [26, 37],
  [30, 41],
  [34, 44],
  [38, 54],
  [40, 56],
  [16, 41],
  [17, 44],
  [19, 41],
  [24, 44],
  [20, 31],
  [23, 33],
];

const jaguarWhiskers: [Vec3, Vec3][] = [
  [
    [-75, 30, 165],
    [-220, 20, 130],
  ],
  [
    [-75, 30, 165],
    [-220, 32, 165],
  ],
  [
    [-75, 30, 165],
    [-210, 50, 140],
  ],
  [
    [75, 30, 165],
    [220, 20, 130],
  ],
  [
    [75, 30, 165],
    [220, 32, 165],
  ],
  [
    [75, 30, 165],
    [210, 50, 140],
  ],
];

const jaguarFaces: number[][] = [
  [8, 4, 5],
  [8, 5, 1],
  [1, 5, 0, 2],
  [2, 0, 6, 3],
  [9, 6, 7],
  [9, 3, 6],
  [1, 10, 11, 2],
  [2, 11, 12],
  [2, 12, 13],
  [2, 13, 14, 3],
  [10, 15, 19],
  [11, 20, 21],
  [13, 25, 23],
  [14, 24, 17],
  [15, 16, 30, 41],
  [18, 44, 34, 17],
  [16, 19, 20, 27, 30],
  [17, 34, 29, 23, 24],
  [27, 28, 32, 31],
  [28, 29, 33, 32],
  [30, 31, 36, 35],
  [33, 34, 37, 36],
  [31, 32, 36],
  [32, 33, 36],
  [35, 36, 39, 38],
  [36, 37, 40, 39],
  [38, 42, 54, 55, 39],
  [40, 39, 55, 56, 43],
  [4, 45, 48, 15, 10],
  [7, 14, 18, 50, 47],
  [41, 42, 51, 48],
  [44, 50, 53, 43],
  [45, 46, 49, 48],
  [46, 47, 50, 49],
  [48, 49, 52, 51],
  [49, 50, 53, 52],
  [51, 52, 55, 54],
  [52, 53, 56, 55],
];

function pathToPage(pathname: string): Page {
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  return allNav.find((item) => item.path === cleanPath)?.page ?? 'home';
}

function App() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));
  const [loading, setLoading] = useState(true);
  const [showIntroCat, setShowIntroCat] = useState(false);
  const [charged, setCharged] = useState(false);
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('idle');
  const [gear, setGear] = useState(1);
  const raceTimerRef = useRef<number | null>(null);
  const lookRef = useRef<LookState>({
    x: 0,
    y: 0,
    cursorX: window.innerWidth / 2,
    cursorY: window.innerHeight / 2,
  });
  const flightBoard = useFlightBoard();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    const startTimer = window.setTimeout(() => setShowIntroCat(true), 760);

    return () => {
      window.clearTimeout(startTimer);
    };
  }, [loading]);

  const clearRaceTimer = useCallback(() => {
    if (raceTimerRef.current === null) return;
    window.clearTimeout(raceTimerRef.current);
    raceTimerRef.current = null;
  }, []);

  useEffect(() => {
    return clearRaceTimer;
  }, [clearRaceTimer]);

  const beginRaceCountdown = useCallback(() => {
    clearRaceTimer();
    setCharged(true);
    setGear(1);
    setRaceStatus('countdown');
    raceTimerRef.current = window.setTimeout(() => {
      setRaceStatus('racing');
      raceTimerRef.current = null;
    }, 3200);
  }, [clearRaceTimer]);

  const openRacePage = useCallback(() => {
    setPage('race');
    if (window.location.pathname !== raceNav.path) {
      window.history.pushState(null, '', raceNav.path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    beginRaceCountdown();
  }, [beginRaceCountdown]);

  const exitRacePage = useCallback(() => {
    clearRaceTimer();
    setCharged(false);
    setRaceStatus('idle');
    setPage('home');
    if (window.location.pathname !== homeNav.path) {
      window.history.pushState(null, '', homeNav.path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clearRaceTimer]);

  const toggleShift = useCallback(() => {
    if (page === 'race' && charged) {
      exitRacePage();
      return;
    }

    openRacePage();
  }, [charged, exitRacePage, openRacePage, page]);

  useEffect(() => {
    if (page === 'race' && !charged && raceStatus === 'idle') {
      beginRaceCountdown();
    }
  }, [beginRaceCountdown, charged, page, raceStatus]);

  useEffect(() => {
    const handlePop = () => {
      const nextPage = pathToPage(window.location.pathname);
      setPage(nextPage);

      if (nextPage === 'race') {
        beginRaceCountdown();
        return;
      }

      clearRaceTimer();
      setCharged(false);
      setRaceStatus('idle');
    };
    const syncLookVars = (look: LookState) => {
      const root = document.documentElement;
      root.style.setProperty('--cursor-x', `${look.cursorX}px`);
      root.style.setProperty('--cursor-y', `${look.cursorY}px`);
      root.style.setProperty('--look-x', `${look.x}`);
      root.style.setProperty('--look-y', `${look.y}`);
    };

    const handlePointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      const nextLook = {
        x: Math.max(-1, Math.min(1, x * 2)),
        y: Math.max(-1, Math.min(1, y * 2)),
        cursorX: event.clientX,
        cursorY: event.clientY,
      };
      lookRef.current = nextLook;
      syncLookVars(nextLook);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && !event.repeat) {
        toggleShift();
      }
    };

    syncLookVars(lookRef.current);
    window.addEventListener('popstate', handlePop);
    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [beginRaceCountdown, clearRaceTimer, toggleShift]);

  function navigate(item: NavItem) {
    if (item.page !== 'race') {
      clearRaceTimer();
      setCharged(false);
      setRaceStatus('idle');
    }

    setPage(item.page);
    window.history.pushState(null, '', item.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (item.page === 'race') {
      beginRaceCountdown();
    }
  }

  const shiftGear = useCallback((direction: 1 | -1) => {
    setGear((current) => Math.max(1, Math.min(8, current + direction)));
  }, []);

  return (
    <div className={`site ${charged ? 'is-charged' : ''}`}>
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <AnimatePresence>{showIntroCat && <PixelCatSweep onDone={() => setShowIntroCat(false)} />}</AnimatePresence>
      <PixelField />

      <SiteNav page={page} navigate={navigate} />

      <button className="home-mark" type="button" onClick={() => navigate(homeNav)} aria-label="Home">
        <JaguarMark />
      </button>

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {page === 'home' && (
            <Home
              flightBoard={flightBoard}
              lookRef={lookRef}
            />
          )}
          {page === 'about' && <About navigate={navigate} />}
          {page === 'projects' && <Projects />}
          {page === 'playground' && <Playground charged={charged} lookRef={lookRef} />}
          {page === 'contact' && <Contact />}
          {page === 'race' && (
            <RacePage
              flightBoard={flightBoard}
              gear={gear}
              lookRef={lookRef}
              raceStatus={raceStatus}
              shiftGear={shiftGear}
            />
          )}
        </motion.main>
      </AnimatePresence>

      <button className="shift-control" type="button" onClick={toggleShift}>
        <span className="toggle-dot" />
        {page === 'race' && charged ? 'EXIT RACE' : 'SHIFT'}
      </button>
      {page === 'race' && raceStatus === 'racing' && <GearControl gear={gear} shiftGear={shiftGear} />}
    </div>
  );
}

function useFlightBoard(): FlightBoardState {
  const [now, setNow] = useState(() => new Date());
  const [index, setIndex] = useState(0);
  const formatters = useMemo(
    () =>
      flightBoardEntries.map(
        (entry) =>
          new Intl.DateTimeFormat('en-IN', {
            timeZone: entry.timeZone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
      ),
    [],
  );

  useEffect(() => {
    const clockInterval = window.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    const boardInterval = window.setInterval(() => {
      setIndex((current) => (current + 1) % flightBoardEntries.length);
    }, 3_400);

    return () => {
      window.clearInterval(clockInterval);
      window.clearInterval(boardInterval);
    };
  }, []);

  const entry = flightBoardEntries[index];

  return {
    ...entry,
    index,
    time: formatters[index].format(now).replace(' ', '  '),
  };
}

function SiteNav({ page, navigate }: { page: Page; navigate: (item: NavItem) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (item: NavItem) => {
    setMenuOpen(false);
    navigate(item);
  };

  return (
    <header className="site-nav">
      <div className="nav-cluster">
        {navLeft.map((item) => (
          <a
            className={page === item.page ? 'is-active' : ''}
            href={item.path}
            key={item.path}
            onClick={(event) => {
              event.preventDefault();
              handleNavigate(item);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
      <div className="nav-cluster nav-cluster-right">
        {navRight.map((item) => (
          <a
            className={page === item.page ? 'is-active' : ''}
            href={item.path}
            key={item.path}
            onClick={(event) => {
              event.preventDefault();
              handleNavigate(item);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>

      <button
        className="mobile-hamburger"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((s) => !s)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div
          className="mobile-nav-overlay"
          onClick={() => setMenuOpen(false)}
        >
          <nav onClick={(e) => e.stopPropagation()}>
            {[...navLeft, ...navRight, raceNav, homeNav].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={page === item.page ? 'is-active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Loader() {
  return (
    <motion.div
      className="loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.72, 0.38, 0.72] }}
        transition={{ duration: 1.25, repeat: 1, ease: 'easeInOut' }}
      >
        MEOW MEOW
      </motion.p>
    </motion.div>
  );
}

function PixelCatSweep({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="pixel-cat-sweep"
      aria-hidden="true"
      initial={{ x: '-38vw' }}
      animate={{ x: '112vw' }}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      transition={{ duration: 1.24, ease: [0.7, 0, 0.2, 1] }}
      onAnimationComplete={onDone}
    >
      <svg className="pixel-cat-sprite" viewBox="0 0 18 10">
        <rect x="1" y="4" width="1" height="1" />
        <rect x="6" y="2" width="1" height="1" />
        <rect x="7" y="1" width="2" height="1" />
        <rect x="9" y="0" width="1" height="1" />
        <rect x="7" y="2" width="3" height="1" />
        <rect x="5" y="3" width="6" height="1" />
        <rect x="4" y="4" width="9" height="1" />
        <rect x="6" y="5" width="8" height="1" />
        <rect x="7" y="6" width="7" height="1" />
        <rect x="7" y="7" width="2" height="1" />
        <rect x="11" y="7" width="1" height="1" />
        <rect x="13" y="3" width="2" height="1" />
        <rect x="14" y="2" width="1" height="1" />
        <rect x="15" y="1" width="1" height="1" />
      </svg>
    </motion.div>
  );
}

function RotatingCatMark() {
  return (
    <div className="about-neon-cat-orbit">
      <svg className="about-neon-cat" viewBox="0 0 220 220" role="img" aria-label="Rotating neon cat mark">
        <defs>
          <filter id="catGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="neon-cat-outline"
          d="M47 96C45 69 52 45 66 24L92 60C104 56 116 56 128 60L154 24C168 45 175 69 173 96C171 143 144 176 110 176C76 176 49 143 47 96Z"
        />
        <path className="neon-cat-eye left-eye" d="M75 104C91 101 101 108 104 124C91 130 78 127 68 115C69 109 71 106 75 104Z" />
        <path className="neon-cat-eye right-eye" d="M145 104C129 101 119 108 116 124C129 130 142 127 152 115C151 109 149 106 145 104Z" />
      </svg>
    </div>
  );
}

function FlightBoardText({ muted = false, value }: { muted?: boolean; value: string }) {
  return (
    <span className={`flight-board-window ${muted ? 'is-muted' : ''}`} aria-label={value}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          className="flight-board-text"
          key={value}
          initial={{ opacity: 0, rotateX: -78, y: '-115%' }}
          animate={{ opacity: 1, rotateX: 0, y: '0%' }}
          exit={{ opacity: 0, rotateX: 78, y: '115%' }}
          transition={{ duration: 0.42, ease: [0.7, 0, 0.2, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Home({
  flightBoard,
  lookRef,
}: {
  flightBoard: FlightBoardState;
  lookRef: MutableRefObject<LookState>;
}) {
  const scrollWorldRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: worldScroll } = useScroll({
    target: scrollWorldRef,
    offset: ['start end', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -56]);
  const headlineColor = useTransform(scrollYProgress, [0.14, 0.28, 0.46], ['#f3f0ea', '#f3f0ea', '#22afff']);
  const accentColor = useTransform(scrollYProgress, [0.14, 0.3, 0.48], ['#f3f0ea', '#9edcff', '#35c8ff']);
  const titleShadow = useTransform(
    scrollYProgress,
    [0.12, 0.3, 0.48],
    [
      '0 0 0 rgba(34, 175, 255, 0)',
      '0 0 32px rgba(34, 175, 255, 0.24)',
      '0 0 46px rgba(34, 175, 255, 0.34)',
    ],
  );
  const introColor = useTransform(scrollYProgress, [0.14, 0.34, 0.5], ['#f3f0ea', '#f3f0ea', '#35c8ff']);
  const layerOneY = useTransform(worldScroll, [0, 1], [-120, 420]);
  const layerOneX = useTransform(worldScroll, [0, 1], [-80, 120]);
  const layerTwoY = useTransform(worldScroll, [0, 1], [260, -240]);
  const layerTwoX = useTransform(worldScroll, [0, 1], [140, -100]);
  const layerThreeY = useTransform(worldScroll, [0, 1], [80, -360]);
  const lineOpacity = useTransform(worldScroll, [0, 0.32, 0.72, 1], [0.12, 0.42, 0.3, 0.08]);

  return (
    <>
      <section className="cat-stage">
        <JaguarCanvas charged={false} lookRef={lookRef} />

        <aside className="weather-copy flight-copy">
          <FlightBoardText value={`${flightBoard.time} ${flightBoard.city}`} />
          <FlightBoardText muted value={flightBoard.status} />
        </aside>

        <aside className="side-line flight-copy">
          <FlightBoardText value={flightBoard.headline} />
          <FlightBoardText muted value={flightBoard.detail} />
        </aside>
      </section>

      <section className="home-scroll-world" ref={scrollWorldRef}>
        <motion.div className="scroll-aurora scroll-aurora-one" style={{ x: layerOneX, y: layerOneY }} />
        <motion.div className="scroll-aurora scroll-aurora-two" style={{ x: layerTwoX, y: layerTwoY }} />
        <motion.div className="scroll-rail scroll-rail-one" style={{ opacity: lineOpacity, y: layerThreeY }} />
        <motion.div className="scroll-rail scroll-rail-two" style={{ opacity: lineOpacity, y: layerOneY }} />

        <section className="hero-type">
          <motion.div
            className="hero-type-inner"
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 80, filter: 'blur(16px)' }}
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
            viewport={{ amount: 0.32, once: false }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          >
            <motion.h1 className="scroll-color-title" style={{ color: headlineColor, textShadow: titleShadow }}>
              A web dev
              <span>
                fueled by <motion.em style={{ color: accentColor }}>code</motion.em> &{' '}
                <motion.em style={{ color: accentColor }}>research</motion.em>
              </span>
            </motion.h1>
            <motion.div className="intro-lines" style={{ color: introColor }}>
              <p>Lead Developer at Qsentia.</p>
              <p>Machine learning and data science portfolio with 9+ GPA.</p>
              <p>Builder of voices.somaiya.edu, OULAD ML research, and finance AI systems.</p>
            </motion.div>
          </motion.div>
        </section>

        <section className="split-panel">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
            viewport={{ amount: 0.35, once: false }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="eyebrow">CURRENTLY</p>
            <h2>I build professional web systems and machine learning experiments with measurable academic and product outcomes.</h2>
          </motion.div>
          <div className="role-list">
            {roles.map(([title, org, detail], index) => (
              <motion.article
                initial={{ opacity: 0, x: 48, y: 24 }}
                key={title}
                transition={{ duration: 0.62, delay: index * 0.055, ease: [0.7, 0, 0.2, 1] }}
                viewport={{ amount: 0.2, once: false }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
              >
                <span>{org}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <ThankYouSection />
      </section>
    </>
  );
}

function ThankYouSection() {
  const [activeThankIndex, setActiveThankIndex] = useState(0);
  const activeThank = thankYouItems[activeThankIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveThankIndex((current) => (current + 1) % thankYouItems.length);
    }, 1_850);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="thanks-section">
      <div
        className="thanks-stage"
        style={
          {
            '--thank-color': activeThank.color,
          } as CSSProperties
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            className={`thanks-single ${activeThank.vertical ? 'is-vertical' : ''} ${activeThank.compact ? 'is-compact' : ''}`}
            initial={{ opacity: 0, rotateX: -72, y: -34, filter: 'blur(10px)' }}
            animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, rotateX: 72, y: 34, filter: 'blur(10px)' }}
            key={activeThank.language}
            style={
              {
                '--thank-color': activeThank.color,
              } as CSSProperties
            }
            transition={{ duration: 0.58, ease: [0.7, 0, 0.2, 1] }}
          >
            <span>{activeThank.language}</span>
            <strong>{activeThank.text}</strong>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}

function RacePage({
  flightBoard,
  gear,
  lookRef,
  raceStatus,
  shiftGear,
}: {
  flightBoard: FlightBoardState;
  gear: number;
  lookRef: MutableRefObject<LookState>;
  raceStatus: RaceStatus;
  shiftGear: (direction: 1 | -1) => void;
}) {
  return (
    <section className="race-page-stage">
      {raceStatus === 'racing' ? (
        <RaceCanvas gear={gear} lookRef={lookRef} shiftGear={shiftGear} />
      ) : (
        <>
          <div className="race-blackout" aria-hidden="true" />
          <RaceStartLights />
        </>
      )}

      <aside className="weather-copy flight-copy">
        <FlightBoardText value={`${flightBoard.time} ${flightBoard.city}`} />
        <FlightBoardText muted value={raceStatus === 'racing' ? 'GRID LIVE,0%' : 'GRID READY,0%'} />
      </aside>

      <aside className="side-line flight-copy">
        <FlightBoardText value={raceStatus === 'racing' ? 'RACE MODE' : 'LIGHTS OUT'} />
        <FlightBoardText muted value={raceStatus === 'racing' ? `GEAR ${gear} / A-D STEER` : 'RACE START SEQUENCE'} />
      </aside>

      {raceStatus === 'racing' && (
        <div className="race-hud" aria-hidden="true">
          <span>SOLO RUN</span>
          <span>DRS ACTIVE</span>
        </div>
      )}
    </section>
  );
}

function About({ navigate }: { navigate: (item: NavItem) => void }) {
  return (
    <section className="about-reference-page">
      <div className="about-reference-hero">
        <div className="about-pixel-cat-wrap" aria-hidden="true">
          <RotatingCatMark />
        </div>

        <div className="about-reference-copy">
          <p className="about-reference-kicker">/ MACHINE LEARNING — WEB, DATA SCIENCE</p>
          <h1>
            A web dev
            <span>
              fueled by <em>ML</em> & <em>systems</em>
            </span>
          </h1>
          <div className="about-reference-intro">
            <p>
              I am Shlok Chauhan, a Computer Science student at Somaiya Vidyavihar University
              maintaining a 9+ GPA while building web products, applied machine learning systems,
              and campus-scale digital experiences.
            </p>
            <p>
              My work spans Python, Scikit-learn, XGBoost, C#, .NET, MSSQL, Pandas, NumPy, and frontend
              development. I have worked across Qsentia, MyTrueMatch, Global Consulting Professionals,
              Kasmo Digital, and Somaiya Voices.
            </p>
          </div>
        </div>

        <div className="about-reference-side">
          <span>ACTIVE</span>
          <strong>Qsentia</strong>
          <small>Lead Developer</small>
        </div>
      </div>

      <section className="about-reference-section">
        <p className="about-section-label">— CURRENT</p>
        <div className="about-reference-rows">
          {roles.map(([title, org, detail]) => (
            <article className="about-reference-row" key={title}>
              <span>{org}</span>
              <h2>{title}</h2>
              <p>{detail}</p>
              <small>ACTIVE</small>
            </article>
          ))}
        </div>
      </section>

      <section className="about-reference-section">
        <p className="about-section-label">— EDUCATION</p>
        <article className="about-education-block">
          <span>{education.degree}</span>
          <h2>{education.institution}</h2>
          <p>{education.performance}</p>
          <small>{education.focus}</small>
        </article>
      </section>

      <section className="about-reference-section">
        <p className="about-section-label">— TECHNICAL SKILLS</p>
        <div className="about-skill-cloud">
          {technicalSkills.map(({ Icon, label }) => (
            <span key={label}>
              <Icon size={18} strokeWidth={2.2} />
              <b>{label}</b>
            </span>
          ))}
        </div>
      </section>

      <section className="about-reference-section">
        <p className="about-section-label">— RESEARCH</p>
        <div className="about-reference-rows">
          {papers.map((paper, index) => (
            <article className="about-reference-row research-row" key={paper.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{paper.title}</h2>
              <p>{paper.venue}</p>
              <small>{paper.focus}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="about-reference-section">
        <p className="about-section-label">— LEADERSHIP</p>
        <div className="about-leadership-list">
          {leadership.map((item, index) => (
            <span key={item}>
              {String(index + 1).padStart(2, '0')} / {item}
            </span>
          ))}
        </div>
      </section>

      <section className="about-reference-contact">
        <p className="about-section-label">— GET IN TOUCH</p>
        <a href="mailto:workwithshlokc@gmail.com">workwithshlokc@gmail.com</a>
        <button className="text-button" type="button" onClick={() => navigate(navLeft[0])}>
          See projects <ArrowUpRight size={18} />
        </button>
      </section>
    </section>
  );
}

function Projects() {
  return (
    <PageShell label="PROJECTS" title="Selected builds with real outcomes.">
      <div className="project-list">
        {projects.map((project, index) => (
          <article className="project-row" key={project.title}>
            <span className="project-index">0{index + 1}</span>
            <div>
              <p className="eyebrow">{project.type}</p>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                <ArrowUpRight size={28} />
              </a>
            )}
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function Playground({ charged, lookRef }: { charged: boolean; lookRef: MutableRefObject<LookState> }) {
  return (
    <PageShell label="PLAYGROUND" title="Research, experiments, and controlled chaos.">
      <div className="playground-grid">
        <div className="mini-cat-card">
          <JaguarCanvas charged={charged} lookRef={lookRef} compact />
          <span>PRESS SHIFT</span>
        </div>
        <div className="paper-stack">
          {papers.map((paper) => (
            <article key={paper.title}>
              <p className="eyebrow">{paper.venue}</p>
              <h2>{paper.title}</h2>
              <p>{paper.focus}</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function Contact() {
  return (
    <PageShell label="CONTACT" title="Let us make something precise and memorable.">
      <div className="contact-grid">
        <a href="mailto:workwithshlokc@gmail.com">
          <Mail size={24} />
          workwithshlokc@gmail.com
        </a>
        <a href="https://github.com/Advaita-expo" target="_blank" rel="noreferrer">
          <Github size={24} />
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/shlok-pratap-chauhan-870133319/" target="_blank" rel="noreferrer">
          <Linkedin size={24} />
          LinkedIn
        </a>
        <a href="https://www.instagram.com/randombagheera/" target="_blank" rel="noreferrer">
          <Instagram size={24} />
          Instagram
        </a>
      </div>
      <div className="leadership-strip">
        {leadership.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </PageShell>
  );
}

function PageShell({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="page-shell">
      <a className="back-link" href="/">
        <ArrowLeft size={18} />
        HOME
      </a>
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function PixelField() {
  return (
    <div className="pixel-field" aria-hidden="true">
      {Array.from({ length: 74 }).map((_, index) => (
        <i key={index} style={{ '--i': index } as CSSProperties} />
      ))}
    </div>
  );
}

function JaguarMark() {
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="M9 35 13 6l9 9 9-9 4 29H9Z" fill="currentColor" />
      <path d="M17 22 21 18 25 22 21 29Z" fill="#050505" />
      <circle cx="28" cy="17" r="2.2" fill="#050505" />
    </svg>
  );
}

function GearControl({
  gear,
  shiftGear,
}: {
  gear: number;
  shiftGear: (direction: 1 | -1) => void;
}) {
  return (
    <div className="gear-control" aria-label="Manual gear control">
      <button type="button" onClick={() => shiftGear(-1)} aria-label="Shift down">
        -
      </button>
      <span>
        <small>GEAR</small>
        {gear}
      </span>
      <button type="button" onClick={() => shiftGear(1)} aria-label="Shift up">
        +
      </button>
    </div>
  );
}

function RaceStartLights() {
  return (
    <div className="race-start-lights" aria-hidden="true">
      <div className="race-light-rig">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            className="race-light"
            key={index}
            style={{ '--light-index': index } as CSSProperties}
          />
        ))}
      </div>
      <p>LIGHTS OUT</p>
    </div>
  );
}

function RaceCanvas({
  gear,
  lookRef,
  shiftGear,
}: {
  gear: number;
  lookRef: MutableRefObject<LookState>;
  shiftGear: (direction: 1 | -1) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gearRef = useRef(gear);
  const steerRef = useRef(0);
  const keyRef = useRef({ left: false, right: false });
  const streaks = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: Math.random(),
        y: Math.random(),
        length: 40 + Math.random() * 180,
        speed: 0.7 + Math.random() * 1.8,
        warm: Math.random() > 0.55,
        alpha: 0.08 + Math.random() * 0.34,
      })),
    [],
  );

  useEffect(() => {
    gearRef.current = gear;
  }, [gear]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let roadOffset = 0;
    let speed = 0.55;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keyRef.current.left = true;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keyRef.current.right = true;
      if (!event.repeat && (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w')) shiftGear(1);
      if (!event.repeat && (event.key === 'ArrowDown' || event.key.toLowerCase() === 's')) shiftGear(-1);
    };

    const keyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keyRef.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keyRef.current.right = false;
    };

    const drawBlock = (
      centerX: number,
      centerY: number,
      blockWidth: number,
      blockHeight: number,
      side: -1 | 1,
      color: string,
      lean: number,
    ) => {
      const skew = side * blockWidth * 0.35 + lean;
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(centerX - blockWidth / 2 + skew, centerY - blockHeight / 2);
      context.lineTo(centerX + blockWidth / 2 + skew, centerY - blockHeight / 2);
      context.lineTo(centerX + blockWidth / 2 - skew, centerY + blockHeight / 2);
      context.lineTo(centerX - blockWidth / 2 - skew, centerY + blockHeight / 2);
      context.closePath();
      context.fill();
    };

    const drawCar = (carX: number, time: number) => {
      const baseX = width / 2 + carX * width * 0.18;
      const baseY = height * 0.82;
      const scale = Math.min(width / 1280, height / 760);
      const wobble = Math.sin(time * 15) * 2;

      context.save();
      context.translate(baseX, baseY + wobble);
      context.scale(scale, scale);

      const blur = context.createRadialGradient(0, -60, 20, 0, -20, 290);
      blur.addColorStop(0, 'rgba(170,230,255,.2)');
      blur.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = blur;
      context.beginPath();
      context.ellipse(0, -70, 310, 170, 0, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = 'rgba(0,0,0,.94)';
      context.beginPath();
      context.ellipse(-230, 10, 100, 165, -0.22, 0, Math.PI * 2);
      context.ellipse(230, 10, 100, 165, 0.22, 0, Math.PI * 2);
      context.fill();

      const body = context.createLinearGradient(0, -250, 0, 130);
      body.addColorStop(0, '#1c2227');
      body.addColorStop(0.38, '#050607');
      body.addColorStop(0.62, '#161b1f');
      body.addColorStop(1, '#030303');
      context.fillStyle = body;
      context.beginPath();
      context.moveTo(0, -252);
      context.lineTo(145, -150);
      context.lineTo(250, 40);
      context.lineTo(120, 132);
      context.lineTo(0, 150);
      context.lineTo(-120, 132);
      context.lineTo(-250, 40);
      context.lineTo(-145, -150);
      context.closePath();
      context.fill();

      context.strokeStyle = 'rgba(230,248,255,.34)';
      context.lineWidth = 2;
      for (const side of [-1, 1]) {
        context.beginPath();
        context.moveTo(side * 18, -240);
        context.lineTo(side * 54, -70);
        context.lineTo(side * 178, 70);
        context.stroke();
      }

      context.fillStyle = '#070909';
      context.fillRect(-285, -92, 570, 34);
      context.fillStyle = 'rgba(230,248,255,.55)';
      context.fillRect(-250, -82, 500, 4);

      context.fillStyle = 'rgba(180,230,255,.22)';
      context.beginPath();
      context.moveTo(-54, -180);
      context.lineTo(0, -260);
      context.lineTo(54, -180);
      context.lineTo(34, -62);
      context.lineTo(-34, -62);
      context.closePath();
      context.fill();

      const highlights = [
        [-160, -80, -92, -30, -210, 10],
        [160, -80, 92, -30, 210, 10],
        [-116, 72, -44, 130, -170, 112],
        [116, 72, 44, 130, 170, 112],
        [-34, -34, 34, -34, 0, 50],
      ];
      context.fillStyle = 'rgba(245,250,255,.82)';
      for (const [x1, y1, x2, y2, x3, y3] of highlights) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.closePath();
        context.fill();
      }

      context.strokeStyle = 'rgba(255,220,65,.85)';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-74, -210);
      context.lineTo(-58, 118);
      context.stroke();

      context.restore();
    };

    const draw = (timestamp: number) => {
      const time = timestamp / 1000;
      const keys = keyRef.current;
      const keyboardSteer = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      const targetSteer = keyboardSteer !== 0 ? keyboardSteer : lookRef.current.x;
      steerRef.current += (targetSteer - steerRef.current) * 0.08;
      const steer = Math.max(-1, Math.min(1, steerRef.current));
      const targetSpeed = 0.32 + gearRef.current * 0.22;
      speed += (targetSpeed - speed) * 0.025;
      roadOffset += speed * 0.018;

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000';
      context.fillRect(0, 0, width, height);

      const horizon = height * 0.34;
      const centerX = width / 2 + steer * width * 0.08;

      const tunnel = context.createRadialGradient(centerX, horizon, 10, centerX, horizon, width * 0.72);
      tunnel.addColorStop(0, 'rgba(255,255,255,.07)');
      tunnel.addColorStop(0.25, 'rgba(20,80,110,.08)');
      tunnel.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = tunnel;
      context.fillRect(0, 0, width, height);

      context.save();
      context.globalCompositeOperation = 'screen';
      for (const streak of streaks) {
        const z = (streak.y + roadOffset * streak.speed) % 1;
        const spread = Math.pow(z, 1.65);
        const sx = centerX + (streak.x - 0.5) * width * (0.55 + spread * 1.35) - steer * width * 0.08;
        const sy = horizon + spread * height * 0.86;
        const len = streak.length * (0.2 + spread * 1.8);
        const gradient = context.createLinearGradient(sx, sy, sx + (streak.x - 0.5) * len, sy - len * 0.18);
        gradient.addColorStop(0, streak.warm ? `rgba(255,164,54,${streak.alpha})` : `rgba(180,235,255,${streak.alpha})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.strokeStyle = gradient;
        context.lineWidth = 2 + spread * 8;
        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(sx + (streak.x - 0.5) * len, sy - len * 0.18);
        context.stroke();
      }
      context.restore();

      context.fillStyle = '#030303';
      context.beginPath();
      context.moveTo(centerX - width * 0.09, horizon);
      context.lineTo(centerX + width * 0.09, horizon);
      context.lineTo(width * 0.95, height);
      context.lineTo(width * 0.05, height);
      context.closePath();
      context.fill();

      context.strokeStyle = 'rgba(255,255,255,.08)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(centerX, horizon);
      context.lineTo(width / 2 - steer * width * 0.14, height);
      context.stroke();

      for (let index = 0; index < 34; index += 1) {
        const p = (index / 34 + roadOffset) % 1;
        const depth = Math.pow(p, 1.9);
        const y = horizon + depth * (height - horizon + 150);
        const roadHalf = width * (0.08 + depth * 0.68);
        const blockWidth = 18 + depth * 180;
        const blockHeight = 8 + depth * 78;
        const laneCurve = Math.sin(time * 0.55 + p * 3.2) * depth * width * 0.06 - steer * depth * width * 0.22;
        const color = index % 2 === 0 ? '#c80000' : '#e8e8e8';
        const leftX = centerX + laneCurve - roadHalf;
        const rightX = centerX + laneCurve + roadHalf;
        drawBlock(leftX, y, blockWidth, blockHeight, -1, color, -depth * 34);
        drawBlock(rightX, y, blockWidth, blockHeight, 1, color, depth * 34);
      }

      context.save();
      context.globalCompositeOperation = 'screen';
      const speedGlow = context.createRadialGradient(width / 2, height * 0.72, 0, width / 2, height * 0.72, width * 0.42);
      speedGlow.addColorStop(0, 'rgba(60,180,255,.14)');
      speedGlow.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = speedGlow;
      context.fillRect(0, 0, width, height);
      context.restore();

      drawCar(steer, time);

      context.save();
      context.fillStyle = 'rgba(255,255,255,.72)';
      context.font = '700 12px "JetBrains Mono", monospace';
      context.letterSpacing = '2px';
      context.fillText(`GEAR ${gearRef.current}`, width / 2 - 26, height * 0.18);
      context.restore();
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      cancelAnimationFrame(frame);
    };
  }, [lookRef, shiftGear, streaks]);

  return <canvas ref={canvasRef} className="race-canvas" />;
}

function JaguarCanvas({
  charged,
  lookRef,
  compact = false,
}: {
  charged: boolean;
  lookRef: MutableRefObject<LookState>;
  compact?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chargedRef = useRef(charged);
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: compact ? 110 : 300 }, () => ({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 1200 - 600,
        size: Math.random() < 0.3 ? 3 : Math.random() < 0.6 ? 2 : 1,
        alpha: Math.random() * 0.35 + 0.04,
        blue: Math.random() < 0.28,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.006 + Math.random() * 0.014,
      })),
    [compact],
  );

  useEffect(() => {
    chargedRef.current = charged;
  }, [charged]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let yaw = 0;
    let pitch = 0;
    const fov = compact ? 470 : 520;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rotateY = (point: Vec3, angle: number): Vec3 => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [point[0] * cos + point[2] * sin, point[1], -point[0] * sin + point[2] * cos];
    };

    const rotateX = (point: Vec3, angle: number): Vec3 => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [point[0], point[1] * cos - point[2] * sin, point[1] * sin + point[2] * cos];
    };

    const project = (point: Vec3, centerX: number, centerY: number): [number, number, number, number] => {
      const z = point[2] + fov;
      const scale = fov / z;
      return [point[0] * scale + centerX, point[1] * scale + centerY, scale, point[2]];
    };

    const draw = (timestamp: number) => {
      const time = timestamp / 1000;
      const lookNow = lookRef.current;
      const targetYaw = lookNow.x * 0.28 + Math.sin(time * 0.32) * 0.035;
      const targetPitch = lookNow.y * 0.055 + Math.sin(time * 0.27 + 1) * 0.018;
      const chargedNow = chargedRef.current;

      yaw += (targetYaw - yaw) * 0.045;
      pitch += (targetPitch - pitch) * 0.045;

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000';
      context.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + (compact ? 8 : Math.min(92, height * 0.1));
      const floatingY = Math.sin(time * 0.58) * (compact ? 5 : 15);

      const transform = (vertex: Vec3): Vec3 => {
        let point = rotateY(vertex, yaw);
        point = rotateX(point, pitch);
        point[1] += floatingY;
        const scale = compact ? 0.74 : Math.min(width / 1040, height / 690) * 1.35;
        return [point[0] * scale, point[1] * scale, point[2] * scale];
      };

      for (const particle of particles) {
        particle.twinkle += particle.speed;
        const alpha = particle.alpha * (0.4 + 0.6 * Math.sin(particle.twinkle));
        const particleX = (particle.x + centerX * 2) * (width / 2000);
        const particleY = (particle.y + centerY * 2) * (height / 1200);
        context.fillStyle = particle.blue
          ? `rgba(60,130,230,${alpha})`
          : `rgba(210,225,255,${alpha})`;
        context.fillRect(particleX | 0, particleY | 0, particle.size, particle.size);
      }

      const projected = jaguarVertices.map((vertex) => project(transform(vertex), centerX, centerY));
      const beamY = (projected[15][1] + projected[18][1]) / 2;

      context.save();
      const faceData = jaguarFaces
        .map((face, faceIndex) => {
          const points = face.map((vertexIndex) => projected[vertexIndex]);
          const averageZ = points.reduce((total, point) => total + point[3], 0) / points.length;
          const averageY = points.reduce((total, point) => total + point[1], 0) / points.length;
          return { averageY, averageZ, faceIndex, points };
        })
        .sort((a, b) => a.averageZ - b.averageZ);

      for (const face of faceData) {
        const depth = Math.min(1, Math.max(0, (face.averageZ + 260) / 560));
        const beamPower = Math.max(0, 1 - Math.abs(face.averageY - beamY) / (compact ? 78 : 112));
        const coolShift = face.faceIndex % 3 === 0 ? 1 : 0;
        const red = Math.floor(8 + depth * 32 + beamPower * 30);
        const green = Math.floor(14 + depth * 46 + beamPower * 82);
        const blue = Math.floor(24 + depth * 76 + beamPower * 138 + coolShift * 14);
        const alpha = (compact ? 0.05 : 0.075) + depth * 0.15 + beamPower * (chargedNow ? 0.2 : 0.13);

        context.beginPath();
        face.points.forEach(([x, y], index) => {
          if (index === 0) {
            context.moveTo(x, y);
            return;
          }
          context.lineTo(x, y);
        });
        context.closePath();
        context.fillStyle = `rgba(${red},${green},${blue},${Math.min(0.42, alpha)})`;
        context.fill();
        context.strokeStyle = `rgba(225,240,255,${0.035 + depth * 0.08 + beamPower * 0.13})`;
        context.lineWidth = compact ? 0.35 : 0.55;
        context.stroke();
      }
      context.restore();

      context.save();
      context.globalCompositeOperation = 'screen';
      let gradient = context.createLinearGradient(centerX - 380, beamY, centerX + 380, beamY);
      gradient.addColorStop(0, 'rgba(0,100,255,0)');
      gradient.addColorStop(0.25, chargedNow ? 'rgba(30,150,255,.62)' : 'rgba(30,150,255,.34)');
      gradient.addColorStop(0.5, chargedNow ? 'rgba(140,225,255,.98)' : 'rgba(140,225,255,.62)');
      gradient.addColorStop(0.75, chargedNow ? 'rgba(30,150,255,.62)' : 'rgba(30,150,255,.34)');
      gradient.addColorStop(1, 'rgba(0,100,255,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(centerX, beamY, compact ? 220 : 370, compact ? 8 : 12, 0, 0, Math.PI * 2);
      context.fill();

      gradient = context.createRadialGradient(centerX, beamY, 0, centerX, beamY, compact ? 250 : 360);
      gradient.addColorStop(0, chargedNow ? 'rgba(50,160,255,.18)' : 'rgba(50,160,255,.1)');
      gradient.addColorStop(1, 'rgba(0,60,200,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(centerX, beamY, compact ? 250 : 360, compact ? 44 : 70, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();

      context.save();
      context.lineCap = 'round';
      for (const [from, to] of jaguarEdges) {
        const [ax, ay, , az] = projected[from];
        const [bx, by, , bz] = projected[to];
        const averageZ = (az + bz) / 2;
        const depth = Math.min(1, Math.max(0, (averageZ + 220) / 440));
        const middleY = (ay + by) / 2;
        const beamPower = Math.max(0, 1 - Math.abs(middleY - beamY) / 50);
        const alpha = 0.2 + depth * 0.5 + beamPower * (chargedNow ? 0.5 : 0.32);
        const red = Math.floor(110 + depth * 130 + beamPower * 40);
        const green = Math.floor(140 + depth * 95 + beamPower * 50);
        const blue = Math.floor(190 + depth * 60 + beamPower * 65);
        context.strokeStyle = `rgba(${red},${green},${blue},${Math.min(1, alpha)})`;
        context.lineWidth = compact ? 0.5 + depth * 0.55 : 0.4 + depth * 0.8 + beamPower * 0.9;
        context.beginPath();
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
      }
      context.restore();

      context.save();
      context.globalCompositeOperation = 'screen';
      for (const [start, end] of jaguarWhiskers) {
        const [ax, ay] = project(transform(start), centerX, centerY);
        const [bx, by] = project(transform(end), centerX, centerY);
        const whiskerGradient = context.createLinearGradient(ax, ay, bx, by);
        whiskerGradient.addColorStop(0, chargedNow ? 'rgba(220,235,255,.7)' : 'rgba(220,235,255,.5)');
        whiskerGradient.addColorStop(1, 'rgba(220,235,255,0)');
        context.strokeStyle = whiskerGradient;
        context.lineWidth = compact ? 0.7 : 0.9;
        context.beginPath();
        context.moveTo(ax, ay);
        context.lineTo(bx, by);
        context.stroke();
      }
      context.restore();

      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [compact, lookRef, particles]);

  return <canvas ref={canvasRef} className={compact ? 'jaguar-canvas compact-jaguar-canvas' : 'jaguar-canvas'} />;
}

function HalftoneJaguar({
  charged,
  look,
  compact = false,
}: {
  charged: boolean;
  look: LookState;
  compact?: boolean;
}) {
  const faceX = look.x * 18;
  const faceY = look.y * 10;
  const whiskerX = look.x * 10;
  const whiskerY = look.y * 4;
  const rotation = look.x * 5;

  return (
    <svg
      className={`halftone-cat ${compact ? 'compact-cat' : ''}`}
      viewBox="0 0 900 660"
      role="img"
      aria-label="Abstract halftone jaguar graphic"
    >
      <defs>
        <pattern id={compact ? 'dotsSmall' : 'dots'} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.15" fill="currentColor" />
        </pattern>
        <radialGradient id={compact ? 'blueGlowSmall' : 'blueGlow'} cx="50%" cy="42%" r="45%">
          <stop offset="0%" stopColor="#39bfff" stopOpacity="0.9" />
          <stop offset="48%" stopColor="#39bfff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#39bfff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="whiskers" transform={`translate(${whiskerX} ${whiskerY}) rotate(${rotation * 0.45} 450 430)`}>
        <path d="M118 402 C250 355 336 348 421 372" />
        <path d="M115 466 C244 428 340 420 423 432" />
        <path d="M782 402 C650 355 564 348 479 372" />
        <path d="M785 466 C656 428 560 420 477 432" />
      </g>

      {charged && <circle className="charge-glow" cx="450" cy="294" r="210" fill={`url(#${compact ? 'blueGlowSmall' : 'blueGlow'})`} />}

      <g transform={`translate(${faceX} ${faceY}) rotate(${rotation} 450 360)`}>
        <g className="cat-fill">
          <path d="M205 230 282 0 445 168 352 285Z" fill={`url(#${compact ? 'dotsSmall' : 'dots'})`} />
          <path d="M695 230 618 0 455 168 548 285Z" fill={`url(#${compact ? 'dotsSmall' : 'dots'})`} />
          <path
            d="M450 118C612 118 736 218 736 382 736 488 666 588 548 628L450 656 352 628C234 588 164 488 164 382 164 218 288 118 450 118Z"
            fill={`url(#${compact ? 'dotsSmall' : 'dots'})`}
          />
        </g>

        <g className="shadow-planes">
          <path d="M446 108 738 194 730 514 548 628 586 412 552 204Z" />
          <path d="M205 230 282 0 326 164 254 316Z" />
          <path d="M695 230 618 0 632 176 716 342Z" />
          <path d="M278 332 432 296 448 656 352 628 232 548Z" />
          <path d="M448 302 566 414 512 474 448 450Z" />
          <path d="M166 390 270 462 246 558 180 486Z" />
          <path d="M734 390 630 462 654 558 720 486Z" />
        </g>

        <g className="cat-planes">
          <path d="M626 88 648 204 592 290 558 252Z" />
          <path d="M662 208 710 304 672 438 620 344Z" />
          <path d="M276 528 354 610 286 624Z" />
          <path d="M548 526 606 590 522 574Z" />
          <path d="M472 568 520 614 450 642Z" />
          <path d="M584 396 638 426 596 454Z" />
          <path d="M314 352 380 382 320 412Z" />
          <path d="M404 258 432 338 392 370Z" />
          <path d="M276 130 314 254 248 216Z" />
        </g>

        <g className="wireframe">
          <path d="M282 0 450 118 618 0" />
          <path d="M205 230 450 118 695 230" />
          <path d="M164 382 274 244 450 456 626 244 736 382" />
          <path d="M180 486 368 512 450 656 532 512 720 486" />
          <path d="M274 244 348 354 408 430 450 456 492 430 552 354 626 244" />
          <path d="M318 366 232 310 164 382 252 456 368 512" />
          <path d="M582 366 668 310 736 382 648 456 532 512" />
          <path d="M450 118 450 656" />
        </g>
      </g>
    </svg>
  );
}

export default App;
