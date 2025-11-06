package com.tfg.listacompra.repository;

import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ListaCompraRepository extends JpaRepository<ListaCompra, Long> {

    // Buscar listas por usuario
    List<ListaCompra> findByUsuario(Usuario usuario);

    // Buscar listas por usuario y nombre
    List<ListaCompra> findByUsuarioAndNombreContainingIgnoreCase(Usuario usuario, String nombre);
}
