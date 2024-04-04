FROM python:3.12.2-slim

WORKDIR /app

COPY . /app/
RUN apt-get update && apt-get install -y curl && apt-get clean
RUN pip install -r requirements.txt

CMD python manage.py migrate \
    # && python manage.py runserver 0.0.0.0:8000 \
    && python manage.py collectstatic --no-input \
    && gunicorn canvas.wsgi:application --bind 0.0.0.0:8000 --log-level info