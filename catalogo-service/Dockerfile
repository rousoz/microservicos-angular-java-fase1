# Use Maven to build the JAR
#FROM maven:3.9.4-openjdk-21 AS build
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy parent pom
# COPY ../pom.xml ./
COPY pom.xml . 

# 2. Truque: Instala o POM pai no repositório local do container 
# ignorando os módulos que não existem com o comando 'install -N'
RUN mvn install -N -DskipTests

# Copy modules
# COPY catalogo-service/pom.xml catalogo-service/
# COPY catalogo-service/src catalogo-service/src/
COPY catalogo-service/ ./catalogo-service/

# 4. Executa o build apenas no módulo desejado
WORKDIR /app/catalogo-service
# RUN mvn clean package -DskipTests
# Força o repackage para garantir que a Main-Class seja incluída
RUN mvn clean package spring-boot:repackage -DskipTests

# Build the service
# RUN mvn clean package -DskipTests -pl catalogo-service -am
# RUN mvn clean package -DskipTests catalogo-service -am
# RUN mvn clean package -DskipTests
# RUN mvn clean package -DskipTests -N
# RUN mvn clean package -DskipTests -pl catalogo-service -am

# Use JRE to run
# FROM openjdk:21-jre-slim
#FROM eclipse-temurin:21-jre-jammy
FROM eclipse-temurin:21-jre-jammy


WORKDIR /app

# Copy the JAR
# COPY --from=build /app/catalogo-service/target/catalogo-service-*.jar app.jar
COPY --from=build /app/catalogo-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8081

CMD ["java", "-jar", "app.jar"]