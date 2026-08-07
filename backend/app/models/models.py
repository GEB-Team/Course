import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class RoleEnum(str, enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    ADMIN = "ADMIN"

class ApplicantTypeEnum(str, enum.Enum):
    CITIZEN = "CITIZEN"
    NON_CITIZEN = "NON_CITIZEN"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    role = Column(Enum(RoleEnum), nullable=False)
    
    # Common Fields
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True) # Optional for Google SSO
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=True) # Null for Google SSO users without password
    
    # Google SSO specific
    google_id = Column(String, unique=True, nullable=True, index=True)
    profile_picture = Column(String, nullable=True)
    
    # Employee Specific Fields
    applicant_type = Column(Enum(ApplicantTypeEnum), nullable=True)
    experience_years = Column(Integer, nullable=True)
    experience_months = Column(Integer, nullable=True)
    group = Column(String, nullable=True)
    sub_category = Column(String, nullable=True)
    
    # Non-Citizen Specific Fields
    residence_number = Column(String, nullable=True)
    residence_expiry_date = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Document Verification Module Fields
    employee_id = Column(String, unique=True, index=True, nullable=True)
    employee_category = Column(String, nullable=True)
    qualification = Column(String, nullable=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    verification_status = Column(String, default="Pending")
    verification_confidence = Column(Integer, nullable=True)
    recommended_courses = Column(String, nullable=True) # JSON String

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    login_history = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("EmployeeDocument", back_populates="user", cascade="all, delete-orphan")
    course_reviews = relationship("CourseReview", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")

class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)

    user = relationship("User", back_populates="login_history")

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    extracted_text = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")

# ─────────────────────────────────────────────────────────────────────────────
# Course Detail Module — New Models
# ─────────────────────────────────────────────────────────────────────────────

class CourseStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"

class CourseLevelEnum(str, enum.Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    ALL_LEVELS = "All Levels"

class Instructor(Base):
    """Course instructor / trainer profile."""
    __tablename__ = "instructors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    total_courses = Column(Integer, default=0)
    average_rating = Column(String, nullable=True)  # stored as "4.5"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    courses = relationship("Course", back_populates="instructor")

class Course(Base):
    """Extended course table with full detail-page fields."""
    __tablename__ = "courses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    # Basic info
    name = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    description = Column(String, nullable=True)        # long description
    short_description = Column(String, nullable=True)  # card blurb
    category = Column(String, nullable=True)
    level = Column(Enum(CourseLevelEnum), nullable=True, default=CourseLevelEnum.ALL_LEVELS)
    language = Column(String, nullable=True, default="English")
    difficulty_level = Column(String, nullable=True)   # legacy field kept for compatibility
    estimated_duration = Column(String, nullable=True) # legacy field kept for compatibility

    # Media
    thumbnail_url = Column(String, nullable=True)
    intro_video_url = Column(String, nullable=True)

    # Pricing
    price = Column(Integer, nullable=True, default=0)           # in smallest currency unit (e.g. paise / cents)
    discounted_price = Column(Integer, nullable=True)

    # Curriculum stats (denormalized for performance)
    total_lectures = Column(Integer, nullable=True, default=0)
    total_duration_minutes = Column(Integer, nullable=True, default=0)

    # Rich content (stored as JSON strings)
    what_you_learn = Column(String, nullable=True)   # JSON list of strings
    requirements = Column(String, nullable=True)     # JSON list of strings
    target_audience = Column(String, nullable=True)  # JSON list of strings

    # Status & visibility
    status = Column(Enum(CourseStatusEnum), nullable=False, default=CourseStatusEnum.DRAFT)

    # Instructor FK
    instructor_id = Column(String, ForeignKey("instructors.id", ondelete="SET NULL"), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    instructor = relationship("Instructor", back_populates="courses")
    sections = relationship("CourseSection", back_populates="course",
                            cascade="all, delete-orphan", order_by="CourseSection.order_index")
    reviews = relationship("CourseReview", back_populates="course", cascade="all, delete-orphan")

class CourseSection(Base):
    """A named section inside a course (e.g., 'Module 1 — Introduction')."""
    __tablename__ = "course_sections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    order_index = Column(Integer, nullable=False, default=0)

    # Relationships
    course = relationship("Course", back_populates="sections")
    lectures = relationship("CourseLecture", back_populates="section",
                            cascade="all, delete-orphan", order_by="CourseLecture.order_index")

class CourseLecture(Base):
    """A single lecture / lesson inside a section."""
    __tablename__ = "course_lectures"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    section_id = Column(String, ForeignKey("course_sections.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=True, default=0)  # duration in minutes
    is_preview = Column(Boolean, default=False)  # free preview lecture
    order_index = Column(Integer, nullable=False, default=0)

    # Relationship
    section = relationship("CourseSection", back_populates="lectures")

class CourseReview(Base):
    """User rating & review for a published course."""
    __tablename__ = "course_reviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)   # 1-5
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    course = relationship("Course", back_populates="reviews")
    user = relationship("User", back_populates="course_reviews")

# ─────────────────────────────────────────────────────────────────────────────
# Existing models below (unchanged)
# ─────────────────────────────────────────────────────────────────────────────

class CourseRegistration(Base):
    __tablename__ = "course_registrations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    completion_percentage = Column(Integer, default=0)
    estimated_completion_date = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="course_registrations")
    course = relationship("Course")

class TrainingSession(Base):
    __tablename__ = "training_sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    trainer = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=False)
    venue = Column(String, nullable=False)

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    certificate_number = Column(String, unique=True, index=True, nullable=False)
    
    user = relationship("User", backref="certificates")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String, default="Pending") # Pending, Completed
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="payments")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="notifications")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="activity_logs")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
