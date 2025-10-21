# backend/app/tasks/celery.py

from celery import Celery
from app.config import settings

# Create Celery instance
celery_app = Celery(
    "callcenter_saas",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.email_tasks",
        "app.tasks.sms_tasks",
        "app.tasks.automation_tasks"
    ]
)

# Configure Celery
celery_app.conf.update(
    task_serializer=settings.CELERY_TASK_SERIALIZER,
    result_serializer=settings.CELERY_RESULT_SERIALIZER,
    accept_content=settings.CELERY_ACCEPT_CONTENT,
    timezone=settings.CELERY_TIMEZONE,
    enable_utc=settings.CELERY_ENABLE_UTC,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
    worker_prefetch_multiplier=1,
    worker_max_tasks_per_child=1000,
)

# Task routes
celery_app.conf.task_routes = {
    "app.tasks.email_tasks.*": {"queue": "email"},
    "app.tasks.sms_tasks.*": {"queue": "sms"},
    "app.tasks.automation_tasks.*": {"queue": "automation"},
}

# Beat schedule for periodic tasks
celery_app.conf.beat_schedule = {
    "process-scheduled-campaigns": {
        "task": "app.tasks.email_tasks.process_scheduled_campaigns",
        "schedule": 60.0,  # Every minute
    },
    "cleanup-old-logs": {
        "task": "app.tasks.automation_tasks.cleanup_old_logs",
        "schedule": 86400.0,  # Daily
    },
}