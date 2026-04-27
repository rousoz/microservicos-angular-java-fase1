# Use Maven to build the JAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia o POM pai E o POM do módulo para resolver dependências
COPY pom.xml .
COPY inventario-service/pom.xml ./inventario-service/

# 2. Instala o POM pai e baixa dependências do módulo (Cache pesado)
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl inventario-service -am

# 3. Copia o código fonte do módulo
COPY inventario-service/src ./inventario-service/src/

# 4. Build final
WORKDIR /app/inventario-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/inventario-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]