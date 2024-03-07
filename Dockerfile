FROM python:3.12.2-alpine


WORKDIR /usr/src/app
RUN mkdir -p $WORKDIR/static
RUN mkdir -p $WORKDIR/media


ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip


COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . .