FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia o POM pai E o POM do módulo para resolver dependências
COPY pom.xml .
COPY catalogo-service/pom.xml ./catalogo-service/

# 2. Instala o POM pai e baixa dependências do módulo (Cache pesado)
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl catalogo-service -am

# 3. Copia o código fonte do módulo
COPY catalogo-service/src ./catalogo-service/src/

# 4. Build final
WORKDIR /app/catalogo-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/catalogo-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
