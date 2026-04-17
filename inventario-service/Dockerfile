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
# COPY inventario-service/pom.xml inventario-service/
# COPY inventario-service/src inventario-service/src/
COPY inventario-service/ ./inventario-service/

# 4. Executa o build apenas no módulo desejado
WORKDIR /app/inventario-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Build the service
# RUN mvn clean package -DskipTests -pl inventario-service -am
# RUN mvn clean package -DskipTests inventario-service -am
# RUN mvn clean package -DskipTests inventario-service -am
# RUN mvn clean package -DskipTests -pl inventario-service -am

# Use JRE to run
# FROM openjdk:21-jre-slim
# FROM eclipse-temurin:21-jre-jammy
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the JAR
COPY --from=build /app/inventario-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8082

CMD ["java", "-jar", "app.jar"]