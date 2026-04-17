package com.example.inventario.api;

public class InventoryDto {

    //public record InventoryRequest(Object object, Object object2) {
    //        //TODO Auto-generated constructor stub
    //}

    public record InventoryRequest(Long productId, Integer quantity) {
    }

    public record InventoryResponse(Long id, Long productId, Integer quantity) {
    }
}
