package com.tfg.listacompra.controller;

import com.tfg.listacompra.model.Producto;
import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.service.ProductoService;
import com.tfg.listacompra.service.ListaCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:4200", "https://tfglistacompra-production-4550.up.railway.app"})
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ListaCompraService listaCompraService;

    // Obtener todos los productos
    @GetMapping
    public ResponseEntity<List<Producto>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    // Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerPorId(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Agregar producto a una lista
    @PostMapping("/lista/{listaId}/productos")
    public ResponseEntity<Producto> agregarProductoALista(@PathVariable Long listaId, @RequestBody Producto producto) {
        Producto nuevoProducto = productoService.agregarProductoALista(listaId, producto);
        return ResponseEntity.ok(nuevoProducto);

    }
    

    // Obtener productos por lista
    @GetMapping("/lista/{listaId}")
    public ResponseEntity<List<Producto>> listarPorLista(@PathVariable Long listaId) {
        Optional<ListaCompra> lista = listaCompraService.obtenerPorId(listaId);
        if (lista.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(productoService.listarPorLista(lista.get()));
    }

    // Crear producto
    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto producto) {
        Producto nuevo = productoService.guardar(producto);
        return ResponseEntity.ok(nuevo);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Optional<Producto> productoOpt = productoService.obtenerPorId(id);
        if (productoOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Producto producto = productoOpt.get();
        producto.setIdExterno(productoActualizado.getIdExterno());
        producto.setSupermercado(productoActualizado.getSupermercado());
        producto.setCantidad(productoActualizado.getCantidad());
        producto.setListaCompra(productoActualizado.getListaCompra());
        Producto actualizado = productoService.guardar(producto);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
