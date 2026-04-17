package com.example.inventario.api;

import com.example.inventario.application.InventoryApplicationService;
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
    public InventoryDto.InventoryResponse updateInventoryItem(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
    
        //System.out.println("ID recebido: " + id);
        //System.out.println("Payload: " + payload);  
        Long productId = Long.valueOf(payload.get("productId").toString());
        Integer quantity = Integer.valueOf(payload.get("quantity").toString());  
        
        //InventoryDto.InventoryRequest updateRequest = new InventoryDto.InventoryRequest((Long) payload.get("productId"), (Integer) payload.get("quantity"));
        InventoryDto.InventoryRequest updateRequest = new InventoryDto.InventoryRequest(productId, quantity);
        return service.updateItem(updateRequest);
    }

/*
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InventoryDto.InventoryResponse updateInventoryItem(@PathVariable("id") Long id, @RequestBody InventoryDto.InventoryRequest request) {
        if (request.productId() == null) {
            throw new IllegalArgumentException("ID do produto é obrigatório para atualização");
        }       
        
        InventoryDto.InventoryRequest updateRequest = new InventoryDto.InventoryRequest(request.productId(), request.quantity());
        return service.updateItem(updateRequest);
    }

*/
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInventoryItem(@PathVariable("id") Long id) {
        service.deleteItem(id);
    }
}
