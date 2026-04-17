package com.example.catalogo.api;

import java.math.BigDecimal;

public class ProductDto {

    public record ProductRequest(String name, String description, BigDecimal price) {
    }

    public record ProductResponse(Long id, String name, String description, BigDecimal price) {
    }
}
