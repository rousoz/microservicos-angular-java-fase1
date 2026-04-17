# Microservices Fase1

Projeto com dois microserviços Spring Boot em Java 21 usando DDD e bancos de dados isolados.

- `catalogo-service` - catálogo de produtos
- `inventario-service` - controle de estoque

Cada serviço possui sua própria base de dados H2 em memória para evitar compartilhamento entre serviços.

## Execução

No diretório raiz:

```bash
mvn -pl catalogo-service spring-boot:run
mvn -pl inventario-service spring-boot:run
```
