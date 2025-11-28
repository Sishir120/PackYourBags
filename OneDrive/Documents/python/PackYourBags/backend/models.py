from datetime import datetime
from database import db
from sqlalchemy.dialects.postgresql import JSON  # type: ignore
from slugify import slugify  # type: ignore
import bcrypt  # type: ignore
import uuid  # type: ignore

class User(db.Model):
    """User model for authentication and personalization"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255))
    name = db.Column(db.String(100))
    
    # User preferences
    preferences = db.Column(JSON, default={})
    travel_history = db.Column(JSON, default=[])
    
    # Subscription tier
    subscription_tier = db.Column(db.String(20), default='free')  # free, premium, deepseek
    subscription_expires = db.Column(db.DateTime)
    
    # AI Chat Credits
    ai_credits = db.Column(db.Integer, default=10)  # Free users get 10 credits
    total_ai_queries = db.Column(db.Integer, default=0)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    blogs = db.relationship('Blog', backref='author', lazy='dynamic')
    itineraries = db.relationship('Itinerary', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Check if password matches hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self, include_sensitive=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'email': self.email if include_sensitive else self.email.split('@')[0] + '@***',
            'name': self.name,
            'subscription_tier': self.subscription_tier,
            'created_at': self.created_at.isoformat()
        }
        if include_sensitive:
            data['preferences'] = self.preferences
            data['travel_history'] = self.travel_history
        return data
    
    def __repr__(self):
        return f'<User {self.email}>'

class Blog(db.Model):
    """Blog post model for SEO content"""
    __tablename__ = 'blogs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(250), unique=True, nullable=False, index=True)
    
    # Content
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    featured_image = db.Column(db.String(500))
    
    # Categorization
    category = db.Column(db.String(50), index=True)  # Adventure, Luxury, Family, Solo, Budget
    tags = db.Column(JSON, default=[])
    
    # SEO Fields
    meta_title = db.Column(db.String(70))
    meta_description = db.Column(db.String(160))
    meta_keywords = db.Column(db.String(255))
    
    # Publishing
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    published_at = db.Column(db.DateTime)
    featured = db.Column(db.Boolean, default=False)
    
    # AI Generation tracking
    ai_generated = db.Column(db.Boolean, default=False)
    ai_prompt = db.Column(db.Text)
    
    # Engagement metrics
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    
    # Relationships
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    destination_id = db.Column(db.String(50), db.ForeignKey('destinations.destination_id'))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super(Blog, self).__init__(**kwargs)
        if not self.slug and self.title:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.excerpt and self.content:
            self.excerpt = self.content[:200] + '...'
    
    def to_dict(self):
        """Convert blog to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'category': self.category,
            'tags': self.tags,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'status': self.status,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'featured': self.featured,
            'ai_generated': self.ai_generated,
            'views': self.views,
            'likes': self.likes,
            'author': self.author.name if self.author else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Blog {self.title}>'

class Destination(db.Model):
    """Destination model - migrated from JSON"""
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Basic Info
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    continent = db.Column(db.String(50), nullable=False, index=True)
    
    # Details
    highlights = db.Column(JSON, default=[])
    quick_fact = db.Column(db.Text)
    best_season = db.Column(db.String(100))
    budget_tier = db.Column(db.String(50), index=True)
    
    # Rich content
    description = db.Column(db.Text)
    local_tips = db.Column(JSON, default=[])
    images = db.Column(JSON, default=[])
    
    # AI-generated images
    ai_image_url = db.Column(db.String(500))  # Single AI-generated image
    ai_images = db.Column(JSON, default=[])   # Multiple AI-generated images
    
    # Geolocation
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert destination to dictionary"""
        return {
            'destination_id': self.destination_id,
            'name': self.name,
            'country': self.country,
            'continent': self.continent,
            'highlights': self.highlights,
            'quick_fact': self.quick_fact,
            'best_season': self.best_season,
            'budget_tier': self.budget_tier,
            'description': self.description,
            'local_tips': self.local_tips,
            'images': self.images,
            'ai_image_url': self.ai_image_url,
            'ai_images': self.ai_images,
            'coordinates': {
                'lat': self.latitude,
                'lng': self.longitude
            } if self.latitude and self.longitude else None
        }
    
    def __repr__(self):
        return f'<Destination {self.name}>'

class Subscriber(db.Model):
    """Newsletter subscriber model with subscription tiers"""
    __tablename__ = 'subscribers'
    
    id = db.Column(db.Integer, primary_key=True)
    subscriber_id = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    
    # Preferences
    preferences = db.Column(JSON, default={})
    
    # Subscription tier management
    tier = db.Column(db.String(20), default='free')  # free, pro, premium
    billing_cycle = db.Column(db.String(20), default='monthly')  # monthly, yearly
    subscription_status = db.Column(db.String(20), default='free')  # free, active, expired, cancelled
    subscription_start = db.Column(db.DateTime)
    subscription_end = db.Column(db.DateTime)
    cancel_at_period_end = db.Column(db.Boolean, default=False)
    
    # Email subscription
    email_subscribed = db.Column(db.Boolean, default=True)
    
    # Engagement
    engagement_score = db.Column(db.Integer, default=0)
    last_offer_sent = db.Column(db.DateTime)
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, unsubscribed
    
    # Metadata
    subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        """Convert subscriber to dictionary"""
        return {
            'subscriber_id': self.subscriber_id,
            'email': self.email,
            'tier': self.tier,
            'subscription_status': self.subscription_status,
            'preferences': self.preferences,
            'engagement_score': self.engagement_score,
            'subscribed_at': self.subscribed_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Subscriber {self.email}>'

class Itinerary(db.Model):
    """User-created travel itineraries"""
    __tablename__ = 'itineraries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.String(50), db.ForeignKey('destinations.destination_id'))
    
    # Itinerary details
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    
    # Days and activities (JSON structure)
    days = db.Column(JSON, default=[])  # [{day: 1, activities: [...], meals: {...}}]
    
    # Budget
    estimated_budget = db.Column(db.Float)
    budget_breakdown = db.Column(JSON, default={})
    
    # AI generated
    ai_generated = db.Column(db.Boolean, default=False)
    ai_prompt = db.Column(db.Text)
    
    # Additional fields
    notes = db.Column(db.Text)
    tags = db.Column(JSON, default=[])
    is_public = db.Column(db.Boolean, default=False)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    destination = db.relationship('Destination', backref=db.backref('itineraries', lazy='dynamic'))
    
    def to_dict(self):
        """Convert itinerary to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination_id': self.destination_id,
            'title': self.title,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'days': self.days,
            'estimated_budget': self.estimated_budget,
            'budget_breakdown': self.budget_breakdown,
            'ai_generated': self.ai_generated,
            'ai_prompt': self.ai_prompt,
            'notes': self.notes,
            'tags': self.tags,
            'is_public': self.is_public,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'destination': self.destination.to_dict() if self.destination else None
        }
    
    def __repr__(self):
        return f'<Itinerary {self.title}>'

class Favorite(db.Model):
    """User-favorited destinations"""
    __tablename__ = 'favorites'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.String(50), db.ForeignKey('destinations.destination_id'), nullable=False)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('favorites', lazy='dynamic'))
    destination = db.relationship('Destination', backref=db.backref('favorited_by', lazy='dynamic'))
    
    def to_dict(self):
        """Convert favorite to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination_id': self.destination_id,
            'destination': self.destination.to_dict() if self.destination else None,
            'created_at': self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Favorite User:{self.user_id} Destination:{self.destination_id}>'

class PriceWatch(db.Model):
    """Price watch model for tracking destination prices"""
    __tablename__ = 'price_watch'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination = db.Column(db.String(60), nullable=False)
    target_price = db.Column(db.Integer)
    last_price = db.Column(db.Integer)
    pct_drop = db.Column(db.SmallInteger)
    muted_until = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('price_watches', lazy='dynamic'))
    
    def to_dict(self):
        """Convert price watch to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'destination': self.destination,
            'target_price': self.target_price,
            'last_price': self.last_price,
            'pct_drop': self.pct_drop,
            'muted_until': self.muted_until.isoformat() if self.muted_until else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<PriceWatch User:{self.user_id} Destination:{self.destination}>'
