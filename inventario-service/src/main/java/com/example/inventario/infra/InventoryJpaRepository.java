package com.example.inventario.infra;

import com.example.inventario.domain.InventoryItem;
import com.example.inventario.domain.InventoryRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

interface SpringDataInventoryRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByProductId(Long productId);
}

@Repository
public class InventoryJpaRepository implements InventoryRepository {

    private final SpringDataInventoryRepository repository;

    public InventoryJpaRepository(SpringDataInventoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public InventoryItem save(InventoryItem item) {
        return repository.save(item);
    }

    @Override
    public Optional<InventoryItem> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<InventoryItem> findByProductId(Long productId) {
        return repository.findByProductId(productId);
    }

    // O novo método paginado
    @Override
    public Page<InventoryItem> findAll(Pageable pageable) {
        // O JpaRepository já entende Pageable nativamente
        return repository.findAll(pageable);
    }
    
    @Override
    public List<InventoryItem> findAll() {
        return repository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public InventoryItem update(InventoryItem inventoryItem) {
        // TODO Auto-generated method stub
        return repository.save(inventoryItem);
    }    
}
