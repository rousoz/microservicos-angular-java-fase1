package com.example.catalogo.api;

import com.example.catalogo.application.ProductCatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@CrossOrigin(origins = "http://localhost:4200") 
public class ProductController {

    private final ProductCatalogService service;

    public ProductController(ProductCatalogService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductDto.ProductResponse createProduct(@RequestBody ProductDto.ProductRequest request) {
        return service.createProduct(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    //public ProductDto.ProductResponse updateProduct(@PathVariable Long id, @RequestBody ProductDto.ProductRequest request) {
    public ProductDto.ProductResponse updateProduct(@PathVariable("id") Long id, @RequestBody ProductDto.ProductRequest request) {
        return service.updateProduct(id, request);
    }   

    @GetMapping
    public List<ProductDto.ProductResponse> listProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "pageSize", required = false) Integer pageSize) {
        int pageSizeValue = limit != null ? limit : (pageSize != null ? pageSize : 10);
        int effectivePage = Math.max(page - 1, 0);
        return service.listProducts(effectivePage, pageSizeValue);
    }

    @GetMapping("/{id}")
    public ProductDto.ProductResponse getProduct(@PathVariable("id") Long id) {
        return service.getProduct(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(@PathVariable("id") Long id) {
        service.deleteProduct(id);
    }
}
