Проект "Canvas"

Сайт для совместного рисования на холсте

Технологический стек:

Python 3.12+
Django 5.0+
SQLite 3.22+


Инструкция по настройке проекта:


Склонировать проект


Открыть проект в PyCharm с наcтройками по умолчанию


Создать виртуальное окружение (через settings -> project "simple votings" -> project interpreter)


Открыть терминал в PyCharm, проверить, что виртуальное окружение активировано.


Обновить pip:

pip install --upgrade pip




Установить в виртуальное окружение необходимые пакеты:

pip install -r requirements.txt




Создать уникальный ключ приложения.
Генерация делается в консоли Python при помощи команд:

python manage.py shell -c "from django.core.management.utils import get_random_secret_key; get_random_secret_key()"


Далее полученное значение подставляется в соответствующую переменную.
Внимание! Без выполнения этого пункта никакие команды далее не запустятся.


Синхронизировать структуру базы данных с моделями:

python manage.py migrate




Создать суперпользователя

python manage.py shell -c "from django.contrib.auth import get_user_model; get_user_model().objects.create_superuser('vasya', '1@abc.net', 'promprog')"




Создать конфигурацию запуска в PyCharm (файл manage.py, опция runserver)


Внимание! Создана отдельная модель пользователя в модуле main!
При создании ForeignKey'ев на User'а - использовать её при помощи встроенной функции get_user_model.
