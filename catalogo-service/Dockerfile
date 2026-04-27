FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia estrutura de poms
COPY pom.xml .
RUN mkdir catalogo-service inventario-service
COPY catalogo-service/pom.xml ./catalogo-service/
COPY inventario-service/pom.xml ./inventario-service/

# Instala o parent e baixa dependências
RUN mvn install -N -DskipTests
RUN mvn dependency:go-offline -B -pl catalogo-service -am

# Copia o código e builda
COPY catalogo-service/src ./catalogo-service/src/
# Comando simplificado: o 'repackage' já está no seu POM
RUN mvn package -DskipTests -pl catalogo-service -am

# Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/catalogo-service/target/catalogo-service-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
