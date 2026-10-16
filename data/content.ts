export const profile = {
  name: "Shabdarth",
  email: "shabdarthbindel@gmail.com",
  phone: "+91 79834 34126",
  phoneHref: "+917983434126",
  location: "Dehradun, Uttarakhand, India",
  github: "https://github.com/shabdarth13",
  linkedin: "https://linkedin.com/in/shabdarth",
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  repo: string;
};

export const projects: Project[] = [
  {
    slug: "javaredis",
    title: "JavaRedis",
    summary:
      "A Redis-compatible in-memory database written from scratch in Java 17. It speaks RESP2 over raw TCP sockets, so a real Redis client can talk to it.",
    points: [
      "30+ commands across strings, lists, sets, hashes and key expiry, including atomic INCR and DECR.",
      "Thread-safe through ConcurrentHashMap with striped per-key locking, replacing a global lock while keeping compound mutations atomic.",
      "Append-only-file persistence with startup replay, plus lazy and scheduled TTL eviction.",
      "Bounded client executor, graceful shutdown, and JUnit 5 unit and integration tests.",
    ],
    stack: ["Java 17", "Maven", "JUnit 5"],
    repo: "https://github.com/shabdarth13/JavaRedis",
  },
  {
    slug: "smart-compiler",
    title: "Smart Compiler",
    summary:
      "A web-based compiler and execution engine for a custom language, with a browser IDE that draws the syntax tree as a graph.",
    points: [
      "Lexer, recursive-descent parser, AST generator, semantic analyser and interpreter behind a Flask REST API.",
      "Constant-folding optimiser, a security checker for unsafe constructs, and an infinite-loop guard capped at 1,000 iterations.",
      "Deployed on Render with Gunicorn and Flask-CORS, with a documented language reference and API contract.",
    ],
    stack: ["Python", "Flask", "JavaScript"],
    repo: "https://github.com/shabdarth13/smart-compiler",
  },
  {
    slug: "threat-detection",
    title: "AI-Powered Threat Detection Platform",
    summary:
      "One dashboard that runs four analysis engines in a single scan: phishing, IP intelligence, domain reputation and security posture.",
    points: [
      "Fine-tuned DistilBERT to classify phishing emails, returning a prediction, confidence score and verdict.",
      "VirusTotal and Shodan integration for detections, reputation, ASN data, exposed services and geolocation.",
      "Weighted engine that normalises 9 signals into a 0 to 100 risk score, and audits 6 OWASP-recommended security headers.",
    ],
    stack: ["Python", "PyTorch", "DistilBERT", "Flask"],
    repo: "https://github.com/shabdarth13/AI_Powered_Threat_Detection",
  },
  {
    slug: "lost-and-found",
    title: "AI-Powered Lost & Found Portal",
    summary:
      "A two-person full-stack project that matches lost and found reports by meaning instead of keywords, using transformer embeddings that run in the browser.",
    points: [
      "Type-safe data access with Prisma, and credential login with NextAuth and bcrypt.",
      "Continuous deployment to Vercel on every push to main.",
    ],
    stack: ["Next.js", "React", "Prisma", "NextAuth"],
    repo: "https://github.com/Akhilcrab/AI--Powered-Lost-and-Found-Web-Portal",
  },
  {
    slug: "vocalshell",
    title: "VocalShell",
    summary:
      "A voice-controlled command line for Windows, Linux and macOS. spaCy works out the intent of what you say and runs the matching shell command.",
    points: [
      "Online speech recognition through Google Speech and offline through Vosk, so it still works without a network.",
      "Confirmation layer for destructive commands, timestamped history and batch-script generation from voice.",
    ],
    stack: ["Python", "spaCy", "Vosk"],
    repo: "https://github.com/shabdarth13/VocalShell",
  },
  {
    slug: "plagcheck",
    title: "PlagCheck",
    summary:
      "A plagiarism and AI-text detector that finds verbatim and paraphrased copying and reports the matched percentage and probable sources.",
    points: ["Combines TF-IDF vectorisation, cosine similarity and Jaccard index scoring."],
    stack: ["Python", "NLP", "Flask"],
    repo: "https://github.com/shabdarth13/PLAG_AI_CHECKER",
  },
];

export const experience = [
  {
    when: "Jun 2026",
    role: "Cybersecurity Intern",
    org: "Amroha Police, Uttar Pradesh Police (APCSIP-2026)",
    text: "Law-enforcement-led training in digital forensics, cybercrime investigation workflows and cyber law. Practised mobile and malware forensics: artifact extraction, device-level analysis and identifying malicious code on compromised systems.",
  },
  {
    when: "Jul to Aug 2025",
    role: "Software Engineering Intern, Cybersecurity",
    org: "Graphic Era Hill University",
    text: "Ran vulnerability assessments across 20+ network endpoints with Nmap and Wireshark, mapped to OWASP Top 10 and NIST CSF severity levels. Hardened firewall and access-control rules from the findings, cutting the measured attack surface by about 30%. Wrote a report for every issue covering severity, evidence, remediation and ownership.",
  },
];

export const skills = [
  { label: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL"] },
  { label: "Backend", items: ["Node.js", "Express", "Flask", "REST APIs", "JWT and RBAC", "TCP sockets", "RESP2"] },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "React Query"] },
  { label: "Data", items: ["PostgreSQL", "MySQL", "SQLite", "Redis", "Prisma", "Schema design", "Indexing"] },
  { label: "Fundamentals", items: ["Data structures and algorithms", "OOP", "Operating systems", "Networks", "DBMS", "Compiler design", "Concurrency", "System design"] },
  { label: "AI and ML", items: ["PyTorch", "Transformers", "spaCy", "NLP", "Semantic search", "LLM APIs"] },
  { label: "Tooling", items: ["Git", "GitHub Actions", "Docker", "Linux", "Maven", "JUnit 5", "Postman", "Vercel", "Render"] },
  { label: "Security", items: ["AWS IAM", "Application security", "OWASP", "Nmap", "Wireshark", "Threat intelligence APIs"] },
];

export const credentials = [
  "TCS National Qualifier Test (IT): 72.16, August 2026",
  "AWS Certified AI Practitioner (2026)",
  "AWS Security Learning Plan: Identity and Access Management (2026)",
  "Sharda University: Advanced Certificate in Cyber Security and Digital Forensics (2026)",
  "Cisco Networking Academy: Junior Cybersecurity Analyst Career Path and Network Defense (2025)",
  "NPTEL: Computer Networks and Internet Protocol; Privacy and Security in Online Social Media (2026); Introduction to IoT (2025)",
];

// Data-flow stages for each project, taken from the architecture described in the CV.
export const pipelines: Record<string, string[]> = {
  javaredis: ["Client", "RESP2 codec", "Bounded executor", "Command engine", "Striped key locks", "Store + AOF log"],
  "smart-compiler": ["Source", "Lexer", "Parser", "AST", "Semantic analysis", "Optimiser", "Interpreter"],
  "threat-detection": ["Input", "Phishing model", "IP intel", "Domain reputation", "Header audit", "Risk score 0-100"],
  "lost-and-found": ["Report", "Browser embeddings", "Semantic match", "Result"],
  vocalshell: ["Speech", "Google or Vosk", "spaCy intent", "Confirm if risky", "Shell command"],
  plagcheck: ["Text", "TF-IDF", "Cosine + Jaccard", "Originality report"],
};
