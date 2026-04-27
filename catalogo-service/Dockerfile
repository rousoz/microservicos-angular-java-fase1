# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copia o POM pai da raiz (obrigatório para projetos multi-módulo)
COPY pom.xml .

# 2. Copia o POM do módulo específico
COPY catalogo-service/pom.xml ./catalogo-service/

# 3. "Instala" o projeto pai sem rodar testes e baixa dependências
# Isso cria a camada de cache mais pesada. Se os poms não mudarem, o Docker pula isto.
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl catalogo-service -am

# 4. Só agora copia o código fonte do módulo
COPY catalogo-service/src ./catalogo-service/src/

# 5. Gera o JAR (já com as dependências em cache)
WORKDIR /app/catalogo-service
RUN mvn clean package spring-boot:repackage -DskipTests

# Estágio de Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Busca o JAR gerado no estágio anterior
COPY --from=build /app/catalogo-service/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
