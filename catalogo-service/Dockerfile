# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY catalogo-service/pom.xml ./catalogo-service/
COPY inventario-service/pom.xml ./inventario-service/

RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl catalogo-service -am

COPY catalogo-service/src ./catalogo-service/src/
RUN mvn package spring-boot:repackage -DskipTests -pl catalogo-service -am

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/catalogo-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
