package com.example.inventario.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InventoryRepository {
    InventoryItem save(InventoryItem item);

    InventoryItem update(InventoryItem item);

    Optional<InventoryItem> findById(Long id);

    List<InventoryItem> findByProductId(Long productId);

    Page<InventoryItem> findAll(Pageable pageable);

    List<InventoryItem> findAll();

    void deleteById(Long id);
}
