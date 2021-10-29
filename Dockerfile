FROM registry.il2.dso.mil/platform-one/devops/pipeline-templates/base-image/harden-nodejs14:14.16.1

WORKDIR /app
COPY . .

USER appuser

EXPOSE 8080

CMD ["npm", "run", "start"]
