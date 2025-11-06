package com.tfg.listacompra.repository;

import com.tfg.listacompra.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //Buscar usuario por nombre de usuario
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    //Buscar usuario por email
    Optional<Usuario> findByEmail(String email);

    // Verificar si ya existe un usuario con un email o nombre de usuario
    boolean existsByEmail(String email);
    boolean existsByNombreUsuario(String nombreUsuario);
    
} 
