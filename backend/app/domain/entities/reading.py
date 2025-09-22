# Entidad Reading ORM para SQLAlchemy
from sqlalchemy import Column, BigInteger, Float, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from app.infrastructure.database import Base

class Reading(Base):
    __tablename__ = "reading"

    id = Column(BigInteger, primary_key=True, autoincrement=True, unique=True)
    value = Column(Float, nullable=False)
    sensor_id = Column(Integer, ForeignKey("sensor.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)

    sensor = relationship("Sensor", backref="readings")
    user = relationship("User", backref="readings")
