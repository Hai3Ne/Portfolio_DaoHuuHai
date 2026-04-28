from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "CV" / "DaoHuuHai-GamesDeveloper.pdf"
AVATAR = ROOT / "Sources" / "images" / "image_profile.jpg"

PAGE_W, PAGE_H = A4
MARGIN_X = 16 * mm
MARGIN_Y = 11 * mm
ACCENT = colors.HexColor("#00d9ff")
DARK = colors.HexColor("#111827")
MUTED = colors.HexColor("#4b5563")
LIGHT_BG = colors.HexColor("#f3f7fb")
BORDER = colors.HexColor("#d7e2ea")


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="Name",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=DARK,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="Role",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=ACCENT,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Section",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=DARK,
        spaceBefore=7,
        spaceAfter=4,
        borderPadding=(0, 0, 4, 0),
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        fontName="Helvetica",
        fontSize=8.0,
        leading=9.6,
        textColor=DARK,
        spaceAfter=2.5,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        fontName="Helvetica",
        fontSize=7.3,
        leading=8.8,
        textColor=MUTED,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="ItemTitle",
        fontName="Helvetica-Bold",
        fontSize=8.8,
        leading=10.4,
        textColor=DARK,
        spaceBefore=2,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Meta",
        fontName="Helvetica-Oblique",
        fontSize=7.3,
        leading=8.8,
        textColor=MUTED,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Chip",
        fontName="Helvetica-Bold",
        fontSize=6.8,
        leading=8.3,
        textColor=colors.HexColor("#0b3d4a"),
        backColor=colors.HexColor("#dff8ff"),
        borderColor=colors.HexColor("#b7ebf6"),
        borderWidth=0.4,
        borderPadding=(2, 4, 2, 4),
        spaceAfter=2,
    )
)


def paragraph(text: str, style: str = "Body") -> Paragraph:
    return Paragraph(text, styles[style])


def section(title: str):
    return [paragraph(title.upper(), "Section"), hr()]


def hr():
    return Table([[""]], colWidths=[100 * mm], style=TableStyle([("LINEBELOW", (0, 0), (-1, -1), 0.6, BORDER)]))


def bullets(items: list[str]):
    return [paragraph(f"- {item}", "Body") for item in items]


def chip_flow(items: list[str], max_line: int = 78):
    lines: list[str] = []
    current = ""
    for item in items:
        token = item if not current else f"  |  {item}"
        if len(current) + len(token) > max_line:
            lines.append(current)
            current = item
        else:
            current += token
    if current:
        lines.append(current)
    return [paragraph(line, "Chip") for line in lines]


def project(title: str, meta: str, bullets_list: list[str], tags: list[str], link: str | None = None):
    title_text = f'<a href="{link}" color="#111827">{title}</a>' if link else title
    flow = [paragraph(title_text, "ItemTitle"), paragraph(meta, "Meta")]
    flow.extend(bullets(bullets_list))
    flow.extend(chip_flow(tags))
    flow.append(Spacer(1, 0.8 * mm))
    return flow


def skill_group(title: str, items: list[str]):
    flow = [paragraph(title, "ItemTitle")]
    flow.extend(chip_flow(items, max_line=76))
    return flow


def skill_summary(title: str, items: list[str]):
    return paragraph(f"<b>{title}:</b> {', '.join(items)}.", "Body")



def experience(title: str, meta: str, bullets_list: list[str], tags: list[str]):
    flow = [paragraph(title, "ItemTitle"), paragraph(meta, "Meta")]
    flow.extend(bullets(bullets_list))
    flow.extend(chip_flow(tags))
    flow.append(Spacer(1, 0.8 * mm))
    return flow


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(DARK)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(MARGIN_X, 6 * mm, "Dao Huu Hai (Ray) - Unity Game Developer")
    canvas.drawRightString(PAGE_W - MARGIN_X, 6 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_pdf():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_Y,
        bottomMargin=9 * mm,
    )
    frame = Frame(MARGIN_X, 9 * mm, PAGE_W - 2 * MARGIN_X, PAGE_H - 20 * mm, id="normal")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=on_page)])

    story = []

    header = Table(
        [
            [
                [
                    paragraph("Dao Huu Hai (Ray)", "Name"),
                    paragraph("Unity Game Developer", "Role"),
                    paragraph(
                        "Unity Game Developer with over 4 years of experience in mobile, PC, slot, casual, "
                        "hyper-casual, and indie game development, starting from August 20, 2021. Strong in C# "
                        "gameplay systems, production features, hot update workflows, optimization, release support, "
                        "and AI-assisted development with Codex and Claude.",
                        "Body",
                    ),
                ],
                [
                    Image(str(AVATAR), width=28 * mm, height=28 * mm),
                    Spacer(1, 2 * mm),
                    paragraph("Ho Chi Minh City, Vietnam", "Small"),
                    paragraph("Phone: 0387712252", "Small"),
                    paragraph('Email: <a href="mailto:daohuuhai98@gmail.com">daohuuhai98@gmail.com</a>', "Small"),
                    paragraph('LinkedIn: <a href="https://www.linkedin.com/in/hai-dao-b56b151ab/">hai-dao</a>', "Small"),
                    paragraph('GitHub: <a href="https://github.com/Hai3Ne">github.com/Hai3Ne</a>', "Small"),
                    paragraph('GitLab: <a href="https://gitlab.com/Hai3Ne">gitlab.com/Hai3Ne</a>', "Small"),
                    Spacer(1, 1.5 * mm),
                    paragraph("<b>Education</b>", "Small"),
                    paragraph("FPT Polytechnic - Web Developer Engineer", "Small"),
                    paragraph("MAAC Academy - 3D Modeling", "Small"),
                ],
            ]
        ],
        colWidths=[128 * mm, 43 * mm],
        style=TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (1, 0), (1, 0), LIGHT_BG),
                ("BOX", (1, 0), (1, 0), 0.5, BORDER),
                ("LEFTPADDING", (1, 0), (1, 0), 7),
                ("RIGHTPADDING", (1, 0), (1, 0), 7),
                ("TOPPADDING", (1, 0), (1, 0), 7),
                ("BOTTOMPADDING", (1, 0), (1, 0), 7),
            ]
        ),
    )
    story.append(header)
    story.append(Spacer(1, 3 * mm))

    story.extend(section("Career Highlights"))
    highlights = [
        "Recognized as Outstanding Programming Employee 2025 at Tamron.",
        "Contributed to Last Call, a Steam-released first-person anomaly observation horror game.",
        "Co-developed and released Kitty Puzzle on Google Play with Firebase, Google Play Console, and IronSource LevelPlay integration.",
        "Implemented HybridCLR hot update workflows for private slot game products released in the China market.",
        "Built gameplay systems across FPS, slot, roguelike card, match-3, bullet-hell survival, racing, farming, and multiplayer projects.",
        "Uses Codex and Claude project agents, custom agent skills, and AI-assisted workflows to accelerate implementation, refactoring, and documentation.",
    ]
    story.extend(bullets(highlights))

    story.extend(section("Professional Experience"))
    story.extend(
        experience(
            "Unity Game Developer - Tamron",
            "Slot game development | Private China-market products",
            [
                "Developed and maintained slot game features with a focus on production stability, fast iteration, and clean integration with existing game flows.",
                "Handled feature programming, reskin implementation, and gameplay logic updates based on direct business requirements from leadership.",
                "Used HybridCLR to support hot updates for new features and runtime logic changes without requiring full client rebuilds.",
                "Projects are private products released for the China market, so public screenshots and gameplay materials cannot be displayed.",
                "Recognized as Outstanding Programming Employee 2025 at Tamron.",
            ],
            [
                "Unity",
                "C#",
                "Slot Games",
                "HybridCLR",
                "Hot Update",
                "Reskin",
                "Private Product",
                "China Market",
                "Outstanding Employee 2025",
            ],
        )
    )
    story.extend(
        experience(
            "Game Programmer - One Universe",
            "Unity game development | FPS and Shaman King projects",
            [
                "Contributed as a Game Programmer on two game projects, working across gameplay logic, feature implementation, and player-facing systems.",
                "Worked on an FPS game built around skill-based combat inspired by tactical hero shooters such as Valorant, requiring precise ability logic, responsive interactions, and clean gameplay flow.",
                "Participated in a Shaman King game project, supporting gameplay feature development and implementation tasks within the existing production pipeline.",
            ],
            ["Unity", "C#", "Game Programming", "FPS", "Skill System", "Gameplay Logic", "Shaman King"],
        )
    )
    story.extend(
        experience(
            "Unity Game Developer - YOUNG BUFFALO STUDIO",
            "Apr 2024 - Oct 2024 | Ho Chi Minh City",
            [
                "Developed casual roguelike games using Unity, including base architecture, gameplay logic, UI, and complete project structure.",
                "Optimized mobile performance toward stable 60 FPS across diverse devices.",
                "Mentored fresher developers and collaborated with artists, designers, and testers to ship polished builds.",
            ],
            ["Unity", "C#", "OOP", "SOLID", "Odin", "Feel", "Mobile Optimization"],
        )
    )
    story.extend(
        experience(
            "Fresher / Junior / Middle Unity Game Developer - IMBA",
            "Aug 2021 - Apr 2024 | Ho Chi Minh City",
            [
                "Developed and maintained 4+ casual, hyper-casual, mid-core, and multiplayer mobile games.",
                "Implemented tutorials, ranking, skill systems, UI programming, PlayFab data/ranking, inventory storage, ads/IAP, and optimization.",
                "Collaborated with cross-functional teams and improved performance on low-end mobile devices.",
            ],
            ["Unity", "C#", "PlayFab", "Addressables", "I2 Localize", "Ads/IAP", "Optimization"],
        )
    )
    story.extend(
        experience(
            "Frontend Developer - 3F Solutions / RunTime VN",
            "2018 - 2020 | Ho Chi Minh City",
            [
                "Converted PSD/XD designs into responsive, pixel-perfect websites and integrated RESTful APIs.",
                "Built and maintained community and traffic-driven websites using HTML, CSS, JavaScript, and WordPress.",
            ],
            ["HTML", "CSS", "JavaScript", "WordPress", "REST API"],
        )
    )

    story.extend(section("Selected Projects"))
    story.extend(
        project(
            "Last Call",
            "Steam release | Two Sleepy Cats",
            [
                "Unity developer on a first-person anomaly observation horror game released on Steam.",
                "Built gameplay implementation, interactive logic, and presentation flow for an observation-driven experience.",
                "Contributed to a public PC release with a clear Steam store presence and polished player-facing flow.",
            ],
            ["Unity", "C#", "Steam", "Horror Puzzle", "Gameplay Logic"],
            "https://store.steampowered.com/app/4614040/",
        )
    )
    story.extend(
        project(
            "Kitty Puzzle",
            "Google Play release | Two Sleepy Cats",
            [
                "Co-developed a cat-themed match-3 mobile game with a compact two-person team.",
                "Handled gameplay features, Firebase integration, LevelPlay monetization, and Google Play Console release workflow.",
                "Helped ship a polished Google Play product within a short production cycle.",
            ],
            ["Unity", "C#", "Firebase", "Google Play Console", "IronSource LevelPlay"],
            "https://play.google.com/store/apps/details?id=com.twosleepycatsstudio.kittypuzzleparadise",
        )
    )
    story.extend(
        project(
            "OutCast-Sigil",
            "Personal roguelike deck-building project | WIP",
            [
                "Creator and Unity developer for a personal roguelike deck-building project.",
                "Designed and implemented core card logic, combat flow, UI feedback, and extensible content systems.",
                "Demonstrates ownership of game design, architecture, and scalable feature development.",
            ],
            ["Unity", "C#", "Deck Builder", "Roguelike", "Game Design"],
        )
    )
    story.extend(
        project(
            "Joker's Gambit",
            "Young Buffalo Studio | Gameplay video available",
            [
                "Built base code and core architecture for a casual roguelike card game.",
                "Structured card flow, gameplay systems, and reusable foundations for content expansion.",
                "Helped the team move faster with a cleaner, more maintainable project structure.",
            ],
            ["Unity", "C#", "Odin", "Feel", "OOP", "SOLID"],
            "https://www.youtube.com/shorts/jCjuUE8L6YQ",
        )
    )
    story.extend(
        project(
            "IMBA Projects",
            "MeowFarm Kawaii, Hero Survival, Overload, OverLeague",
            [
                "Implemented tutorials, skill/ranking systems, UI programming, control research, PlayFab ranking, inventory storage, reskin, ads/IAP, and optimization.",
                "Worked across casual, hyper-casual, bullet-hell survival, racing, multiplayer, and metaverse-related products.",
            ],
            ["Unity", "C#", "Mobile", "PlayFab", "Addressables", "Optimization"],
        )
    )

    story.extend(section("Technical Skills"))
    skill_groups = [
        (
            "Programming & Architecture",
            [
                "C#",
                "Object-Oriented Programming",
                "SOLID",
                "Clean Code",
                "KISS",
                "Design Patterns",
                "Singleton",
                "Observer",
                "Factory",
                "State Pattern",
                "Data Structures",
                "Algorithms",
                "Debugging",
                "Code Review",
                "Refactoring",
            ],
        ),
        (
            "Unity Gameplay Development",
            [
                "Unity",
                "Gameplay Systems",
                "Card Logic",
                "Combat Flow",
                "Skill System",
                "Tutorial System",
                "Ranking System",
                "UI/UX Programming",
                "Player Inventory",
                "Save System",
                "Animation Feedback",
                "Rapid Prototyping",
                "Game Optimization",
            ],
        ),
        (
            "Mobile, Release & LiveOps",
            [
                "Android Optimization",
                "Low-End Device Optimization",
                "Addressables",
                "Bake Lighting",
                "Occlusion Culling",
                "Firebase",
                "Google Play Console",
                "IronSource LevelPlay",
                "Ads Integration",
                "IAP",
                "Analytics",
                "PlayFab",
                "Reskin Workflow",
            ],
        ),
        (
            "Hot Update, Tools & Plugins",
            [
                "HybridCLR",
                "Hot Update Workflow",
                "Odin Inspector",
                "Feel",
                "I2 Localize",
                "Bayat Save System",
                "UHFPS",
                "Mirror Networking",
                "ObjectNet Plugin",
                "Unity Smart Merge",
            ],
        ),
        (
            "Version Control & Web Foundation",
            [
                "Git",
                "GitHub",
                "GitLab",
                "SVN",
                "Git Flow",
                "HTML",
                "CSS",
                "JavaScript",
                "REST API Integration",
                "WordPress",
                "Python",
                "Lua",
                "Roblox",
                "Blender",
            ],
        ),
        (
            "AI-Assisted Development",
            [
                "Codex",
                "Claude",
                "AI-Assisted Coding",
                "Agent Skill Setup",
                "Project Agent Workflow",
                "Prompt Engineering",
                "Context Engineering",
                "Workflow Automation",
                "Technical Documentation",
            ],
        ),
    ]
    for title, items in skill_groups:
        story.append(skill_summary(title, items))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(OUT)
