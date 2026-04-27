# Use Maven to build the JAR
# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia o POM pai da raiz (obrigatório para projetos multi-módulo)
COPY pom.xml .

# 2. Copia o POM do módulo específico
COPY inventario-service/pom.xml ./inventario-service/

# 3. "Instala" o projeto pai sem rodar testes e baixa dependências
# Isso cria a camada de cache mais pesada. Se os poms não mudarem, o Docker pula isto.
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl inventario-service -am

# 4. Só agora copia o código fonte do módulo
COPY inventario-service/src ./inventario-service/src/

# 5. Gera o JAR (já com as dependências em cache)
WORKDIR /app/inventario-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Estágio de Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Busca o JAR gerado no estágio anterior
COPY --from=build /app/inventario-service/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]