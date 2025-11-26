package com.tfg.listacompra.service;

import com.tfg.listacompra.model.ListaCompra;
import com.tfg.listacompra.model.Usuario;
import com.tfg.listacompra.repository.ListaCompraRepository;
import com.tfg.listacompra.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListaCompraService {

    @Autowired
    private ListaCompraRepository listaCompraRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar las listas de un usuario
    public List<ListaCompra> listarPorUsuarioId(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return listaCompraRepository.findByUsuario(usuario);
    }

    //Crear lista para usuario concreto
    public ListaCompra crearListaParaUsuario(String nombre, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        ListaCompra listaCompra = new ListaCompra();
        listaCompra.setNombre(nombre);
        listaCompra.setUsuario(usuario);
        return listaCompraRepository.save(listaCompra);
    }

    // Eliminar
    public void eliminarLista(Long id, Long usuarioId) {
       ListaCompra listaCompra = listaCompraRepository.findById(id).orElseThrow(() -> new RuntimeException("Lista no encontrada"));
       if (!listaCompra.getUsuario().getId().equals(usuarioId)) {
           throw new RuntimeException("No autorizado para eliminar esta lista");
       }
       listaCompraRepository.delete(listaCompra);
    }

    // Obtener lista por id
    public Optional<ListaCompra> obtenerPorId(Long id) {
        return listaCompraRepository.findById(id);
    }
    
}
