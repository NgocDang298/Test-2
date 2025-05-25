FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY thitn-0.0.1-SNAPSHOT.jar app.jar
COPY .env /app/.env
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
