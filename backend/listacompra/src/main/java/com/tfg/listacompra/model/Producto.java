package com.tfg.listacompra.model;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo", nullable = false)
    private String idExterno;

    @Column(nullable = false)
    private String supermercado;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    //Relación con ListaCompra
    @ManyToOne
    @JoinColumn(name = "lista_id", nullable = false)
    private ListaCompra listaCompra;

    //Constructores
    public Producto() {
    }

    // Getters y Setters

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getIdExterno() {
        return idExterno;
    }
    public void setIdExterno(String idExterno) {
        this.idExterno = idExterno;
    }

    public Integer getCantidad() {
        return cantidad;
    }
    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
    
    public String getSupermercado() {
        return supermercado;
    }
    public void setSupermercado(String supermercado) {
        this.supermercado = supermercado;
    }

    public ListaCompra getListaCompra() {
        return listaCompra;
    }
    public void setListaCompra(ListaCompra listaCompra) {
        this.listaCompra = listaCompra;
    }
}
