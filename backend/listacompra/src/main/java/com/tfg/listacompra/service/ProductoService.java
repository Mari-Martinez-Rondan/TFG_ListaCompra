package com.tfg.listacompra.service;

import com.tfg.listacompra.model.Producto;
import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Listar todos los productos
    public List<Producto> listarTodos() {
        return productoRepository.findAll();
    }

    @Autowired
    private ListaCompraService listaCompraService;
    // Agregar producto a una lista de compra
    public Producto agregarProductoALista(Long listaId, Producto producto) {
        ListaCompra listaCompra = listaCompraService.obtenerPorId(listaId)
                .orElseThrow(() -> new RuntimeException("Lista de compra no encontrada"));
        producto.setListaCompra(listaCompra);
        return productoRepository.save(producto);
    }

    // Listar productos de una lista específica
    public List<Producto> listarPorLista(ListaCompra listaCompra) {
        return productoRepository.findByListaCompra(listaCompra);
    }

    // Buscar por ID
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    // Guardar (crear o actualizar)
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    // Eliminar
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }
}
