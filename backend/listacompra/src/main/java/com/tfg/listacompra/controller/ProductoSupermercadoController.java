package com.tfg.listacompra.controller;

import com.tfg.listacompra.dto.ProductoSupermercado;
import com.tfg.listacompra.service.ProductoSupermercadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos-supermercados")
@CrossOrigin(origins = "*")
public class ProductoSupermercadoController {
    private final ProductoSupermercadoService productoSupermercadoService;

    public ProductoSupermercadoController(ProductoSupermercadoService productoSupermercadoService) {
        this.productoSupermercadoService = productoSupermercadoService;
    }

    @GetMapping("/supermanolo")
    public List<ProductoSupermercado> getProductosSuperManolo() {
        return productoSupermercadoService.getProductosSuperManolo();
    }
    @GetMapping("/superpepe")
    public List<ProductoSupermercado> getProductosSuperPepe() {
        return productoSupermercadoService.getProductosSuperPepe();
    }
}
    
