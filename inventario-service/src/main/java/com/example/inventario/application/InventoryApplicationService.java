package com.example.inventario.application;

import com.example.inventario.api.InventoryDto;
import com.example.inventario.domain.InventoryItem;
import com.example.inventario.domain.InventoryRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryApplicationService {

    private final InventoryRepository repository;

    public InventoryApplicationService(InventoryRepository repository) {
        this.repository = repository;
    }

    public InventoryDto.InventoryResponse createItem(InventoryDto.InventoryRequest request) {
        InventoryItem item = new InventoryItem(request.productId(), request.quantity());
        InventoryItem saved = repository.save(item);
        return toResponse(saved);
    }

    public InventoryDto.InventoryResponse updateItem(InventoryDto.InventoryRequest request) {
        if (request.productId() == null) {
            throw new IllegalArgumentException("ID do produto é obrigatório para atualização");
        }

        InventoryItem item = repository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Inventário não encontrado: " + request.productId()));
        item.setQuantity(request.quantity());

        InventoryItem saved = repository.update(item);
        return toResponse(saved);
    }

    public Page<InventoryDto.InventoryResponse> listItems(Pageable pageable) {
        // Buscamos os itens paginados e mapeamos para DTO
        return repository.findAll(pageable).map(this::toResponse);
    }

    public List<InventoryDto.InventoryResponse> listItems() {
        return repository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<InventoryDto.InventoryResponse> findByProduct(Long productId) {
        return repository.findByProductId(productId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InventoryDto.InventoryResponse getItem(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Inventário não encontrado: " + id));
    }

    public void deleteItem(Long id) {
        repository.deleteById(id);
    }

    private InventoryDto.InventoryResponse toResponse(InventoryItem item) {
        return new InventoryDto.InventoryResponse(item.getId(), item.getProductId(), item.getQuantity());
    }
}
