package com.example.inventario.api;

import com.example.inventario.application.InventoryApplicationService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "http://localhost:4200")
public class InventoryController {

    private final InventoryApplicationService service;

    public InventoryController(InventoryApplicationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryDto.InventoryResponse createInventoryItem(@RequestBody InventoryDto.InventoryRequest request) {
        return service.createItem(request);
    }

    @GetMapping
    public Page<InventoryDto.InventoryResponse> listInventory(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        // Lembre-se: Frontend começa em 1, Spring Data começa em 0
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), pageSize);
        return service.listItems(pageable);
    }

    @GetMapping
    public List<InventoryDto.InventoryResponse> listInventory() {
        return service.listItems();
    }

    @GetMapping("/produto/{productId}")
    public List<InventoryDto.InventoryResponse> findByProduct(@PathVariable("productId") Long productId) {
        return service.findByProduct(productId);
    }

    @GetMapping("/{id}")
    public InventoryDto.InventoryResponse getInventoryItem(@PathVariable("id") Long id) {
        return service.getItem(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InventoryDto.InventoryResponse updateInventoryItem(@PathVariable("id") Long id,
            @RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());
        InventoryDto.InventoryRequest updateRequest = new InventoryDto.InventoryRequest(productId, quantity);
        return service.updateItem(updateRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInventoryItem(@PathVariable("id") Long id) {
        service.deleteItem(id);
    }
}
