package com.example.catalogo.domain;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    Product save(Product product);

    Product update(Product product);

    Optional<Product> findById(Long id);

    List<Product> findAll();

    List<Product> findAll(int page, int pageSize);

    void deleteById(Long id);
}
