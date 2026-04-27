FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia estrutura de poms para satisfazer o projeto multi-módulo
COPY pom.xml .
COPY catalogo-service/pom.xml ./catalogo-service/
COPY inventario-service/pom.xml ./inventario-service/

# Instala o parent e baixa dependências (Camada de Cache)
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl catalogo-service -am

# Copia o código e builda apenas o módulo necessário
COPY catalogo-service/src ./catalogo-service/src/
RUN mvn package spring-boot:repackage -DskipTests -pl catalogo-service -am

# Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# O nome do JAR segue o padrão artifactId-version.jar
COPY --from=build /app/catalogo-service/target/catalogo-service-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
