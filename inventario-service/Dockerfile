# Use Maven to build the JAR
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia apenas os arquivos de configuração primeiro
COPY pom.xml .
COPY inventario-service/pom.xml ./inventario-service/

# 2. Baixa as dependências (Camada de cache pesada)
# Se o pom.xml não mudar, o Docker reutiliza esta camada
RUN mvn dependency:go-offline -B -pl inventario-service -am

# 3. Só agora copia o código fonte
COPY inventario-service/src ./inventario-service/src/

# 4. Build (já com as dependências em cache)
WORKDIR /app/inventario-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Build the service

# Use JRE to run
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the JAR
COPY --from=build /app/inventario-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8082

CMD ["java", "-jar", "app.jar"]