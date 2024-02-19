# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.10-slim

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY ./requirements.txt /code/requirements.txt
COPY . ./

# Install production dependencies.
RUN pip install -r requirements.txt

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# EXPOSE 80

CMD ["uvicorn", "--proxy-headers", "--host", "0.0.0.0", "--port", "8080", "server:app"]