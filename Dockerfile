FROM registry1.dso.mil/ironbank/opensource/nodejs/nodejs14:14.17.6

WORKDIR /app
COPY . .

# USER appuser

EXPOSE 8080

CMD ["npm", "run", "start"]
