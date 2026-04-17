package com.example.inventario.domain;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository {
    InventoryItem save(InventoryItem item);

    InventoryItem update(InventoryItem item);

    Optional<InventoryItem> findById(Long id);

    List<InventoryItem> findByProductId(Long productId);

    List<InventoryItem> findAll();

    void deleteById(Long id);
}
