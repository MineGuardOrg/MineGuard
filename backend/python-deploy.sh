#!/bin/bash

cd /home/site/wwwroot

pip install --no-cache-dir -r requirements.txt

exec gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    --timeout 300 \
    --log-level debug \
    --bind 0.0.0.0:8000
