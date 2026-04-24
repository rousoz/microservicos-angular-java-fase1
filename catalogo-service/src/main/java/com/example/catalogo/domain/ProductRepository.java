package com.example.catalogo.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductRepository {
    Product save(Product product);

    Product update(Product product);

    Optional<Product> findById(Long id);

    List<Product> findAll();

    Page<Product> findAll(Pageable pageable);
    //List<Product> findAll(int page, int pageSize);

    void deleteById(Long id);
}
