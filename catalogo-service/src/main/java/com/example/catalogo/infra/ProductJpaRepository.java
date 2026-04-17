package com.example.catalogo.infra;

import com.example.catalogo.domain.Product;
import com.example.catalogo.domain.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

interface SpringDataProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAll();
}

@Repository
public class ProductJpaRepository implements ProductRepository {

    private final SpringDataProductRepository repository;

    public ProductJpaRepository(SpringDataProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product save(Product product) {
        return repository.save(product);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Product> findAll() {
        return repository.findAll();
    }

    @Override
    public List<Product> findAll(int page, int pageSize) {
        return repository.findAll(PageRequest.of(page, pageSize)).getContent();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Product update(Product product) {
        return repository.save(product);
    }
}
