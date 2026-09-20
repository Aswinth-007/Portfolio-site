using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PortfolioSite.Models;

namespace PortfolioSite.Pages;

public class IndexModel : PageModel
{
    public string Name => "Aswinth A.";

    public string Role => "Software Engineer";

    public string Location => "Chennai, India";

    public bool OpenToWork => true;

    public string Thesis =>
        "I build the systems businesses run on — and then I automate the parts nobody should have to do by hand.";

    public string About =>
        "I'm a software engineer working mainly in ASP.NET and SQL Server, building the kind of applications a " +
        "business actually runs on day to day — invoice systems with partial-billing logic, dashboards that track " +
        "project and financial status in real time, PDF generation, and the plumbing that connects all of it.";

    public string About2 =>
        "Outside of work I lean toward automation and security — teaching software to notice things on its own, " +
        "and slowly picking apart how systems break so I can build ones that don't.";

    // ---------------------------------------------------------------
    // TODO: replace these placeholders with your real details.
    // ---------------------------------------------------------------
    public List<ContactLink> Links { get; } = new()
    {
        new() { Label = "Email",    Value = "your.email@example.com",      Href = "mailto:your.email@example.com" },
        new() { Label = "Phone",    Value = "+91 00000 00000",             Href = "tel:+910000000000" },
        new() { Label = "LinkedIn", Value = "linkedin.com/in/your-handle", Href = "https://linkedin.com/in/your-handle" },
        new() { Label = "GitHub",   Value = "github.com/your-handle",      Href = "https://github.com/your-handle" }
    };

    // TODO: set this to your real GitHub username to activate the live activity feed.
    public string GitHubUsername => "your-handle";

    public string ResumePath => "/files/aswinth-resume.pdf";

    public List<ExperienceEntry> Experience { get; } = new()
    {
        new ExperienceEntry
        {
            Period = "Dec 2024 — Present",
            Role = "Software Engineer",
            Company = "Ecosoft Zolutions Pvt Ltd",
            Location = "Chennai, India",
            Current = true,
            Summary = "Engineering and maintaining critical modules inside an ERP system built on ASP.NET Web Forms and SQL Server.",
            Bullets = new()
            {
                "Designed an invoice management system with dynamic line-item processing and RDLC-based PDF generation",
                "Built partial-invoicing logic to accurately track invoiced vs. pending items across projects",
                "Optimised complex SQL queries and stored procedures for significantly faster data retrieval",
                "Built interactive dashboards for invoice status, project progress and financial data",
                "Integrated PDF viewing and document handling with PDF.js",
                "Contributed to frontend/backend integration using React.js and ASP.NET Web API",
                "Diagnosed and resolved production issues, keeping the system stable under real usage"
            }
        }
    };

    public List<WorkItem> Work { get; } = new()
    {
        new WorkItem
        {
            Feature = true,
            Label = "Platform",
            Title = "BizFlow",
            Lede = "An enterprise ERP platform covering the full commercial workflow of an organisation — " +
                   "from the first quotation through delivery, invoicing and cashflow. My main work since late 2024.",
            Highlights = new()
            {
                "Invoice management with dynamic line items and partial-invoicing logic",
                "RDLC-based PDF generation, viewed in-app through PDF.js",
                "Project tracking, status monitoring and progress visualisation",
                "Dashboards for sales, finance and operations",
                "User management, roles and access control",
                "Automated email notifications and scheduled reminders",
                "Query and stored-procedure optimisation for large datasets",
                "Frontend/backend integration across Web Forms, React.js and Web API"
            },
            Stack = new() { "C#", "ASP.NET", "SQL Server", "JavaScript", "React.js", "Bootstrap", "RDLC" }
        },
        new WorkItem
        {
            Label = "Concept",
            Title = "Command Engine",
            Lede = "A note field that reads what you wrote. Type a sentence the way you'd say it out loud, and " +
                   "the engine resolves the project, the event and the date on its own — no form, no dropdowns.",
            Highlights = new()
            {
                "Natural-language parsing into structured records",
                "Command syntax for people who want it — @user, #event, shorthand keys",
                "Automatic project association from free text",
                "Rule-based categorisation of entries"
            },
            Stack = new() { "C#", "SQL Server", "JavaScript" }
        },
        new WorkItem
        {
            Label = "Systems",
            Title = "Workflow automation",
            Lede = "The quieter half of the job: making the application chase people instead of the other way round. " +
                   "Scheduled tasks, database triggers and rule engines that keep work moving without anyone opening a screen.",
            Highlights = new()
            {
                "Scheduled background jobs and automated reminders",
                "Database-driven triggers on state change",
                "User activity monitoring",
                "Intelligent categorisation of incoming data"
            },
            Stack = new() { "C#", "SQL Server", "Schedulers" }
        }
    };

    public List<PersonalProject> Personal { get; } = new()
    {
        new PersonalProject
        {
            Title = "Project ARC",
            Kicker = "Voice assistant",
            Summary = "The childhood dream, built for real. A JARVIS-style assistant that wakes on a spoken " +
                      "keyword, runs system commands through a rule-based engine, and falls back to an LLM for " +
                      "everything conversational. The interface is a Three.js neuron orb driven over a local " +
                      "WebSocket, with hand-gesture control for zoom, rotate and select.",
            Stack = new() { "Python", "Three.js", "WebSocket", "MediaPipe", "LLM API" }
        },
        new PersonalProject
        {
            Title = "Civic Tracker",
            Kicker = "Automotive",
            Summary = "A tracker for a specific car generation — built around the Honda Civic. Scrapes listings " +
                      "for pricing and model details, filters by budget and generation, and recommends compatible " +
                      "mods and upgrades with cross-generation price comparisons.",
            Stack = new() { "Python", "Web scraping", "SQL" }
        },
        new PersonalProject
        {
            Title = "VoltLink",
            Kicker = "Android",
            Summary = "An EV charging station finder, now being rebuilt as a native Android app after starting " +
                      "life as a prototype elsewhere.",
            Stack = new() { "Kotlin", "Android" }
        },
        new PersonalProject
        {
            Title = "Game dev sprints",
            Kicker = "Android games",
            Summary = "A handful of small games built end to end and shipped as Android apps — mostly an excuse " +
                      "to work outside business software for a while.",
            Stack = new() { "MONSOON", "Neon Rift", "Stick Riot", "Tycoon" }
        }
    };

    public List<CapabilityGroup> Capabilities { get; } = new()
    {
        new CapabilityGroup
        {
            Name = "Day to day",
            Note = "What I ship with",
            Items = new() { "C#", "ASP.NET Web Forms", "SQL Server", "JavaScript", "HTML / CSS", "Bootstrap", "RDLC", "Git", "SSMS" }
        },
        new CapabilityGroup
        {
            Name = "Building toward",
            Note = "Actively learning",
            Items = new() { "ASP.NET Web API", "React.js", "Cybersecurity", "Docker", "AWS", "DevOps", "Networking" }
        },
        new CapabilityGroup
        {
            Name = "Exploring",
            Note = "Curiosity, not claims",
            Items = new() { "Java", "Python", "Kotlin", "Android", "Unity", "AI", "Quantum computing", "Bioinformatics" }
        }
    };

    public List<Certification> Certifications { get; } = new()
    {
        new() { Name = "Introduction to Cybersecurity", Issuer = "Cisco" },
        new() { Name = "Advent of Cyber 2023", Issuer = "TryHackMe" },
        new() { Name = "Mastercard Cybersecurity Virtual Experience", Issuer = "Forage" },
        new() { Name = "Salesforce Developer Training", Issuer = "Salesforce" },
        new() { Name = "Java, Beginner to Advanced", Issuer = "Udemy" },
        new() { Name = "JavaScript", Issuer = "SoloLearn" },
        new() { Name = "2D / 3D CAD Modeling", Issuer = "Bentley Institute" },
        new() { Name = "Digital 101", Issuer = "Future Skills Prime" }
    };

    public void OnGet()
    {
    }

    public IActionResult OnPost(string name, string email, string message)
    {
        // TODO: wire to SMTP / SendGrid, or write to a table.
        return RedirectToPage(new { sent = "true" });
    }
}
