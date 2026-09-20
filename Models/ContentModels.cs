namespace PortfolioSite.Models;

public class WorkItem
{
    public string Label { get; set; } = "";
    public string Title { get; set; } = "";
    public string Lede { get; set; } = "";
    public List<string> Highlights { get; set; } = new();
    public List<string> Stack { get; set; } = new();
    public bool Feature { get; set; }
}

public class CapabilityGroup
{
    public string Name { get; set; } = "";
    public string Note { get; set; } = "";
    public List<string> Items { get; set; } = new();
}

public class ExperienceEntry
{
    public string Period { get; set; } = "";
    public string Role { get; set; } = "";
    public string Company { get; set; } = "";
    public string Location { get; set; } = "";
    public string Summary { get; set; } = "";
    public List<string> Bullets { get; set; } = new();
    public bool Current { get; set; }
}

public class ContactLink
{
    public string Label { get; set; } = "";
    public string Value { get; set; } = "";
    public string Href { get; set; } = "";
}

public class PersonalProject
{
    public string Title { get; set; } = "";
    public string Kicker { get; set; } = "";
    public string Summary { get; set; } = "";
    public List<string> Stack { get; set; } = new();
    public string Href { get; set; } = "";
}

public class Certification
{
    public string Name { get; set; } = "";
    public string Issuer { get; set; } = "";
}
