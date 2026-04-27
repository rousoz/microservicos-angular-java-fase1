# Use Maven to build the JAR

FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia apenas os arquivos de configuração primeiro
COPY pom.xml .
COPY catalogo-service/pom.xml ./catalogo-service/

# 2. Baixa as dependências (Camada de cache pesada)
# Se o pom.xml não mudar, o Docker reutiliza esta camada
RUN mvn dependency:go-offline -B -pl catalogo-service -am

# 3. Só agora copia o código fonte
COPY catalogo-service/src ./catalogo-service/src/

# 4. Build (já com as dependências em cache)
WORKDIR /app/catalogo-service
RUN mvn clean package spring-boot:repackage -DskipTests


# Build the service

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the JAR
COPY --from=build /app/catalogo-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8081

CMD ["java", "-jar", "app.jar"]