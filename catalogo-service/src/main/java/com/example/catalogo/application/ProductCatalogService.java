package com.example.catalogo.application;

import com.example.catalogo.api.ProductDto;
import com.example.catalogo.domain.Product;
import com.example.catalogo.domain.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductCatalogService {

    private final ProductRepository repository;

    public ProductCatalogService(ProductRepository repository) {
        this.repository = repository;
    }

    public ProductDto.ProductResponse createProduct(ProductDto.ProductRequest request) {
        Product product = new Product(request.name(), request.description(), request.price());
        Product saved = repository.save(product);
        return toResponse(saved);
    }

    //public ProductDto.ProductResponse updateProduct(ProductDto.ProductRequest request) {
    public ProductDto.ProductResponse updateProduct(Long id, ProductDto.ProductRequest request) {       
        if (id == null) {
            throw new IllegalArgumentException("ID do produto é obrigatório para atualização");
        }

        Product product = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());  

        //Product product = new Product(request.name(), request.description(), request.price());
        

        Product saved = repository.update(product);
        return toResponse(saved);
    }
    public List<ProductDto.ProductResponse> listProducts() {
        return listProducts(0, 10);
    }

    public List<ProductDto.ProductResponse> listProducts(int page, int pageSize) {
        if (page < 0) {
            throw new IllegalArgumentException("Página deve ser maior ou igual a zero");
        }
        if (pageSize <= 0) {
            throw new IllegalArgumentException("pageSize deve ser maior que zero");
        }
        return repository.findAll(page, pageSize).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductDto.ProductResponse getProduct(Long id) {
        return repository.findById(id).map(this::toResponse).orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
    }

    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    private ProductDto.ProductResponse toResponse(Product product) {
        return new ProductDto.ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getPrice());
    }
}
