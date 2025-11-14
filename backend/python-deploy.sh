#!/bin/bash

chmod +x python-deploy.sh
cd /home/site/wwwroot

pip install -r requirements.txt

gunicorn -k uvicorn.workers.UvicornWorker app.main:app --timeout 300 --log-level debug
