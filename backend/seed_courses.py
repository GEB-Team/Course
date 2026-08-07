"""
Seed script — Course Detail Module
===================================
Populates the database with rich sample courses, instructors,
sections, lectures, and reviews for testing the public course detail page.

Usage:
    python seed_courses.py
"""
import asyncio
import json
import uuid
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select

# ── load settings
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.models.models import (
    Base, Instructor, Course, CourseSection, CourseLecture,
    CourseReview, User, CourseStatusEnum, CourseLevelEnum,
)

DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


INSTRUCTORS = [
    {
        "name": "Dr. Amina Al-Hassan",
        "bio": "Senior Government Policy Advisor with 18 years of experience in public sector digital transformation. Former Deputy Director at the National E-Governance Centre. Certified PMP and PRINCE2 Practitioner.",
        "profile_image": "https://api.dicebear.com/7.x/personas/svg?seed=amina",
        "total_courses": 6,
        "average_rating": "4.8",
    },
    {
        "name": "Eng. Khalid Mansour",
        "bio": "Cybersecurity Lead at the National ICT Authority. Over 14 years of hands-on experience in secure government digital infrastructure and public records compliance. CISSP Certified.",
        "profile_image": "https://api.dicebear.com/7.x/personas/svg?seed=khalid",
        "total_courses": 4,
        "average_rating": "4.7",
    },
    {
        "name": "Prof. Fatima Yusuf",
        "bio": "Professor of Public Administration at the National University. Author of 'Ethics in Civil Service' — the most referenced textbook in MENA government training programs.",
        "profile_image": "https://api.dicebear.com/7.x/personas/svg?seed=fatima",
        "total_courses": 8,
        "average_rating": "4.9",
    },
]

COURSES = [
    {
        "name": "Government Office Procedures & E-Governance",
        "subtitle": "Master digital workplace standards for modern civil service",
        "description": (
            "This comprehensive course equips government employees with practical skills for "
            "navigating modern e-governance systems. From e-office workflows to digital records "
            "management and secure inter-departmental communication, you will gain the knowledge "
            "to operate efficiently in a digitally transformed public service environment.\n\n"
            "The course blends policy frameworks with hands-on practical exercises and real-world "
            "case studies drawn from leading government digital transformation programmes across "
            "the region."
        ),
        "short_description": "Learn modern digital workplace standards, government e-office systems, and public records security.",
        "category": "Administration",
        "level": CourseLevelEnum.INTERMEDIATE,
        "language": "English",
        "price": 49900,          # 499.00 in currency smallest unit
        "discounted_price": 19900,
        "total_lectures": 24,
        "total_duration_minutes": 330,
        "what_you_learn": json.dumps([
            "Navigate government e-office platforms (e-Office, GEM, NIC systems)",
            "Apply digital filing and document lifecycle management",
            "Secure sensitive government records under IT Act & data protection rules",
            "Conduct e-meetings, digital approvals, and inter-department communication",
            "Understand e-governance policy frameworks and compliance requirements",
            "Use digital signatures and PKI infrastructure in office workflows",
        ]),
        "requirements": json.dumps([
            "Basic computer literacy (email, word processing)",
            "Government employee identification number",
            "No prior IT knowledge required",
        ]),
        "target_audience": json.dumps([
            "Newly appointed civil servants and government employees",
            "Administrative officers transitioning to digital workflows",
            "Department heads overseeing e-governance adoption",
        ]),
        "status": CourseStatusEnum.PUBLISHED,
        "instructor_idx": 0,
        "sections": [
            {
                "title": "Module 1 — Introduction to E-Governance",
                "lectures": [
                    ("Welcome & Course Overview", 5, True),
                    ("What is E-Governance?", 12, True),
                    ("E-Governance Policy Frameworks", 15, False),
                    ("Case Study: Digital India Initiative", 20, False),
                ],
            },
            {
                "title": "Module 2 — E-Office Systems",
                "lectures": [
                    ("Setting Up Your Government E-Office Account", 10, True),
                    ("Digital File Creation & Management", 18, False),
                    ("Workflow Automation & Approvals", 22, False),
                    ("Inter-Department Communication Protocols", 15, False),
                ],
            },
            {
                "title": "Module 3 — Digital Records & Security",
                "lectures": [
                    ("Government Data Classification Standards", 14, False),
                    ("Secure Document Handling & Encryption", 20, False),
                    ("Digital Signatures & PKI Basics", 25, False),
                    ("Records Retention & Archival Policy", 18, False),
                ],
            },
            {
                "title": "Module 4 — Compliance & Assessment",
                "lectures": [
                    ("IT Act & Data Protection Compliance", 20, False),
                    ("Audit Trails & Accountability Frameworks", 15, False),
                    ("Module Assessment Quiz", 8, False),
                    ("Final Certification Preparation", 10, False),
                ],
            },
        ],
        "reviews": [
            ("Excellent course! Transformed how our department handles digital files.", 5),
            ("Very practical content. The e-office module alone saved us hours every week.", 5),
            ("Good overview but would love more advanced topics on API integration.", 4),
            ("Clear explanations and well-structured. Recommended for all new employees.", 5),
        ],
    },
    {
        "name": "Digital File Management & Cyber Compliance",
        "subtitle": "Protect sensitive governmental records and stay compliant",
        "description": (
            "An essential training program for any government official handling digital records. "
            "This course covers classification of sensitive documents, application of cybersecurity "
            "controls, and maintaining full compliance with national and international data protection "
            "standards including GDPR, ISO 27001, and sector-specific government regulations.\n\n"
            "Real-world breach scenarios and hands-on compliance checklists ensure you can immediately "
            "apply learnings to your daily role."
        ),
        "short_description": "Guidelines for managing sensitive governmental records and compliance protocols.",
        "category": "IT & Security",
        "level": CourseLevelEnum.BEGINNER,
        "language": "English",
        "price": 39900,
        "discounted_price": None,
        "total_lectures": 18,
        "total_duration_minutes": 240,
        "what_you_learn": json.dumps([
            "Classify and handle sensitive government data at appropriate security levels",
            "Apply ISO 27001 controls to government IT environments",
            "Respond to cyber incidents under government breach protocols",
            "Maintain audit logs and compliance documentation",
            "Understand GDPR and local data protection legislation",
            "Implement secure password and access management policies",
        ]),
        "requirements": json.dumps([
            "Basic familiarity with computers and the internet",
            "Access to a government-issued workstation preferred",
        ]),
        "target_audience": json.dumps([
            "IT officers and system administrators in government",
            "Records managers and document controllers",
            "Compliance and audit officers",
        ]),
        "status": CourseStatusEnum.PUBLISHED,
        "instructor_idx": 1,
        "sections": [
            {
                "title": "Module 1 — Cyber Fundamentals for Government",
                "lectures": [
                    ("Introduction to Government Cybersecurity", 8, True),
                    ("Threat Landscape: Risks Facing Public Sector", 15, True),
                    ("Password Hygiene & Multi-Factor Authentication", 12, False),
                ],
            },
            {
                "title": "Module 2 — Data Classification & Handling",
                "lectures": [
                    ("Government Data Classification Framework", 18, False),
                    ("Handling TOP SECRET vs RESTRICTED Documents", 20, False),
                    ("Secure Email & File Sharing Protocols", 15, False),
                ],
            },
            {
                "title": "Module 3 — Compliance Standards",
                "lectures": [
                    ("ISO 27001 Overview for Public Sector", 22, False),
                    ("GDPR & National Data Protection Laws", 25, False),
                    ("Audit Trails & Compliance Checklists", 18, False),
                    ("Breach Response & Incident Reporting", 20, False),
                ],
            },
            {
                "title": "Module 4 — Practical Assessment",
                "lectures": [
                    ("Live Cyber Scenario Walkthrough", 30, False),
                    ("Compliance Audit Simulation", 25, False),
                    ("Final Assessment", 10, False),
                ],
            },
        ],
        "reviews": [
            ("The breach scenario walkthrough was eye-opening. Highly recommend.", 5),
            ("Solid content. Would benefit from more interactive labs.", 4),
            ("Finally a course that explains ISO 27001 in plain language!", 5),
            ("The compliance checklists alone are worth the enrollment.", 5),
        ],
    },
    {
        "name": "Public Service Ethics & Regulatory Frameworks",
        "subtitle": "Navigate the principles, codes, and laws that govern civil service",
        "description": (
            "Ethics is the foundation of trusted public service. This course provides a thorough "
            "grounding in the ethical principles, codes of conduct, anti-corruption frameworks, "
            "and regulatory obligations that govern government employees.\n\n"
            "Drawing on real case studies from within the region's public sector, you will develop "
            "sound judgement for navigating complex ethical dilemmas in daily official duties."
        ),
        "short_description": "Comprehensive study of public service codes, transparency rules, and ethics standard operating procedures.",
        "category": "Compliance",
        "level": CourseLevelEnum.ADVANCED,
        "language": "English",
        "price": 29900,
        "discounted_price": 14900,
        "total_lectures": 20,
        "total_duration_minutes": 280,
        "what_you_learn": json.dumps([
            "Apply the national civil service code of conduct in real situations",
            "Identify and report conflicts of interest correctly",
            "Understand anti-corruption legislation and penalties",
            "Navigate whistleblower protection frameworks",
            "Manage gifts, hospitality, and procurement ethics",
            "Write ethical decision memos and policy briefs",
        ]),
        "requirements": json.dumps([
            "Minimum 1 year in public sector employment recommended",
            "Basic knowledge of government administrative procedures",
        ]),
        "target_audience": json.dumps([
            "Senior civil servants and department heads",
            "Internal audit and compliance teams",
            "Government legal and policy officers",
        ]),
        "status": CourseStatusEnum.PUBLISHED,
        "instructor_idx": 2,
        "sections": [
            {
                "title": "Module 1 — Foundations of Public Service Ethics",
                "lectures": [
                    ("Why Ethics Matters in Public Service", 10, True),
                    ("National Civil Service Code of Conduct", 20, True),
                    ("Ethics Frameworks: A Global Comparison", 18, False),
                ],
            },
            {
                "title": "Module 2 — Anti-Corruption & Integrity",
                "lectures": [
                    ("Defining Corruption: Types and Consequences", 15, False),
                    ("Anti-Corruption Legislation Deep Dive", 25, False),
                    ("Conflict of Interest Management", 20, False),
                    ("Gifts, Hospitality & Procurement Ethics", 18, False),
                ],
            },
            {
                "title": "Module 3 — Transparency & Accountability",
                "lectures": [
                    ("Freedom of Information & Public Disclosure", 22, False),
                    ("Whistleblower Protection Laws", 20, False),
                    ("Internal Reporting Mechanisms", 15, False),
                ],
            },
            {
                "title": "Module 4 — Applied Ethics",
                "lectures": [
                    ("Ethics Case Studies: Real Dilemmas in Government", 30, False),
                    ("Writing an Ethics Decision Memo", 20, False),
                    ("Ethics Committee Simulation", 25, False),
                    ("Final Assessment & Certification", 10, False),
                ],
            },
        ],
        "reviews": [
            ("Prof. Fatima's case studies are riveting. Changed how I approach daily decisions.", 5),
            ("Every senior officer should take this course. Non-negotiable.", 5),
            ("Very thorough. The anti-corruption module was particularly eye-opening.", 4),
            ("The whistleblower protection content is something I wished I knew earlier.", 5),
        ],
    },
    {
        "name": "AI & Data-Driven Governance for Modern Civil Services",
        "subtitle": "Leverage intelligent tools to transform citizen service delivery",
        "description": (
            "The future of governance is data-driven. This cutting-edge course introduces "
            "government professionals to artificial intelligence, machine learning, predictive "
            "analytics, and intelligent automation as applied to public sector service delivery.\n\n"
            "You will explore how leading governments are using AI to detect fraud, optimise "
            "resource allocation, and personalise citizen services — while navigating the "
            "ethical and regulatory challenges these technologies introduce."
        ),
        "short_description": "Leveraging AI tools, analytics, and intelligent automation for citizen service delivery.",
        "category": "Technology",
        "level": CourseLevelEnum.INTERMEDIATE,
        "language": "English",
        "price": 59900,
        "discounted_price": 39900,
        "total_lectures": 28,
        "total_duration_minutes": 390,
        "what_you_learn": json.dumps([
            "Understand AI and machine learning fundamentals without coding",
            "Identify AI use cases applicable to your government department",
            "Evaluate and procure AI tools using government frameworks",
            "Apply data analytics to improve public service KPIs",
            "Navigate AI ethics, bias, and fairness in government decisions",
            "Implement intelligent document processing for back-office automation",
        ]),
        "requirements": json.dumps([
            "Basic digital literacy (spreadsheets, email)",
            "No programming experience required",
            "Curiosity and openness to digital innovation",
        ]),
        "target_audience": json.dumps([
            "Government officers interested in digital transformation",
            "Department heads evaluating AI procurement",
            "Public sector policy analysts and data teams",
        ]),
        "status": CourseStatusEnum.PUBLISHED,
        "instructor_idx": 0,
        "sections": [
            {
                "title": "Module 1 — AI Demystified for Government",
                "lectures": [
                    ("What is AI? Plain-Language Introduction", 10, True),
                    ("How Machine Learning Works (No Code Required)", 15, True),
                    ("AI in Government: Global Case Studies", 20, False),
                    ("AI vs Automation vs Robotics: What's the Difference?", 12, False),
                ],
            },
            {
                "title": "Module 2 — Data Analytics for Public Sector",
                "lectures": [
                    ("Introduction to Government Data Ecosystems", 18, False),
                    ("Key Performance Indicators & Data Dashboards", 20, False),
                    ("Predictive Analytics for Policy Planning", 25, False),
                    ("Open Data Initiatives and Citizen Engagement", 15, False),
                ],
            },
            {
                "title": "Module 3 — Implementing AI in Government",
                "lectures": [
                    ("AI Readiness Assessment for Departments", 20, False),
                    ("Procuring AI: Frameworks & Due Diligence", 22, False),
                    ("Intelligent Document Processing (IDP)", 25, False),
                    ("Chatbots & Virtual Assistants for Citizen Services", 18, False),
                    ("AI-Powered Fraud Detection in Public Finance", 20, False),
                ],
            },
            {
                "title": "Module 4 — AI Ethics & Governance",
                "lectures": [
                    ("Algorithmic Bias and Fairness in Government AI", 22, False),
                    ("Regulatory Landscape: AI Laws & Standards", 20, False),
                    ("Building an Ethical AI Framework for Your Department", 18, False),
                    ("Capstone: Design an AI Strategy for Your Agency", 30, False),
                ],
            },
        ],
        "reviews": [
            ("Finally a course that makes AI accessible for non-technical people like me!", 5),
            ("The fraud detection module is directly applicable to my role in public finance.", 5),
            ("Very well structured. Would love a hands-on lab component in future.", 4),
            ("Completed this as part of our department's digital upskilling. Excellent ROI.", 5),
        ],
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if we already have instructors seeded
        existing = await db.execute(select(Instructor).limit(1))
        if existing.scalars().first():
            print("✅ Seed data already exists. Skipping.")
            return

        print("🌱 Seeding Course Detail module data...")

        # 1. Create instructors
        instructor_objs = []
        for inst in INSTRUCTORS:
            obj = Instructor(
                id=str(uuid.uuid4()),
                name=inst["name"],
                bio=inst["bio"],
                profile_image=inst["profile_image"],
                total_courses=inst["total_courses"],
                average_rating=inst["average_rating"],
                created_at=datetime.utcnow(),
            )
            db.add(obj)
            instructor_objs.append(obj)

        await db.flush()

        # 2. Get an existing user for reviews (or use None)
        user_res = await db.execute(select(User).limit(1))
        sample_user = user_res.scalars().first()

        # 3. Create courses with sections, lectures, reviews
        for i, cd in enumerate(COURSES):
            course = Course(
                id=str(uuid.uuid4()),
                name=cd["name"],
                subtitle=cd["subtitle"],
                description=cd["description"],
                short_description=cd["short_description"],
                category=cd["category"],
                level=cd["level"],
                language=cd["language"],
                price=cd["price"],
                discounted_price=cd.get("discounted_price"),
                total_lectures=cd["total_lectures"],
                total_duration_minutes=cd["total_duration_minutes"],
                what_you_learn=cd["what_you_learn"],
                requirements=cd["requirements"],
                target_audience=cd["target_audience"],
                status=cd["status"],
                instructor_id=instructor_objs[cd["instructor_idx"]].id,
                created_at=datetime.utcnow() - timedelta(days=30 * (i + 1)),
                last_updated=datetime.utcnow() - timedelta(days=i * 3),
            )
            db.add(course)
            await db.flush()

            # Sections & lectures
            for s_idx, section_data in enumerate(cd["sections"]):
                section = CourseSection(
                    id=str(uuid.uuid4()),
                    course_id=course.id,
                    title=section_data["title"],
                    order_index=s_idx,
                )
                db.add(section)
                await db.flush()

                for l_idx, (lec_title, duration, is_preview) in enumerate(section_data["lectures"]):
                    lecture = CourseLecture(
                        id=str(uuid.uuid4()),
                        section_id=section.id,
                        title=lec_title,
                        duration_minutes=duration,
                        is_preview=is_preview,
                        order_index=l_idx,
                    )
                    db.add(lecture)

            # Reviews
            if sample_user:
                for j, (comment, rating) in enumerate(cd.get("reviews", [])):
                    review = CourseReview(
                        id=str(uuid.uuid4()),
                        course_id=course.id,
                        user_id=sample_user.id,
                        rating=rating,
                        comment=comment,
                        created_at=datetime.utcnow() - timedelta(days=j * 7),
                    )
                    db.add(review)

        await db.commit()
        print(f"✅ Seeded {len(COURSES)} courses, {len(INSTRUCTORS)} instructors, sections, lectures, and reviews!")
        print("\n📌 Sample course URLs to test:")
        print("   GET http://localhost:8000/api/v1/courses")
        print("   GET http://localhost:8000/api/v1/courses/<id>")


if __name__ == "__main__":
    asyncio.run(seed())
