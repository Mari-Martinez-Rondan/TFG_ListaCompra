package com.tfg.listacompra.repository;

import com.tfg.listacompra.model.Producto;
import com.tfg.listacompra.model.ListaCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos por lista
    List<Producto> findByListaCompra(ListaCompra listaCompra);

    // Buscar productos por supermercado dentro de una lista
    List<Producto> findByListaCompraAndSupermercadoIgnoreCase(ListaCompra listaCompra, String supermercado);

    // Contar productos por lista
    long countByListaCompra(ListaCompra listaCompra);
}
