FROM python:3.12.2-slim

WORKDIR /app

COPY . /app/
RUN apt-get update && apt-get install -y curl && apt-get clean
RUN pip install -r requirements/requirements.txt

CMD python3 manage.py makemigrations account_app \
    && python3 manage.py migrate account_app \
    && python3 manage.py makemigrations api \
    && python3 manage.py migrate api \
    && python3 manage.py makemigrations \
    && python3 manage.py migrate \
    && python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(email='admin@gmail.com').exists() or User.objects.create_superuser('admin@gmail.com', 'admin')" \
    && python3 manage.py collectstatic --no-input \
    && daphne canvas.asgi:application -p 8000 -b 0.0.0.0
