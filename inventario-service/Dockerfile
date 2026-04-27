# Use Maven to build the JAR
# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY catalogo-service/pom.xml ./catalogo-service/
COPY inventario-service/pom.xml ./inventario-service/

RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl inventario-service -am

COPY inventario-service/src ./inventario-service/src/
RUN mvn package spring-boot:repackage -DskipTests -pl inventario-service -am

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/inventario-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
