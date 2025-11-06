package com.tfg.listacompra.service;

import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.repository.ListaCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListaCompraService {

    @Autowired
    private ListaCompraRepository listaCompraRepository;

    // Listar todas las listas
    public List<ListaCompra> listarTodas() {
        return listaCompraRepository.findAll();
    }

    // Listar las listas de un usuario
    public List<ListaCompra> listarPorUsuario(Usuario usuario) {
        return listaCompraRepository.findByUsuario(usuario);
    }

    // Buscar lista por ID
    public Optional<ListaCompra> obtenerPorId(Long id) {
        return listaCompraRepository.findById(id);
    }

    // Guardar (crear o actualizar)
    public ListaCompra guardar(ListaCompra listaCompra) {
        return listaCompraRepository.save(listaCompra);
    }

    // Eliminar
    public void eliminar(Long id) {
        listaCompraRepository.deleteById(id);
    }
    
}
