import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProductList.module.css";
import { Button } from "./ClickButton";
import Input from "./InputValue";

interface Produto {
    _id: string;
    produto: string;
    tamanho: number;
    quantidade: number;
    image: File | string | null;
}

const baseUrl = "http://localhost:5000/uploads/";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<Produto | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [newProduct, setNewProduct] = useState<Produto | null>(null);

    useEffect(() => {
        axios.get<Produto[]>("http://localhost:5000/estoque")
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erro ao buscar produtos.");
                setLoading(false);
            });
    }, [products]);

    const handleAdd = () => {
        setShowAddForm(true); // Exibe o formulário de adicionar novo produto
    };

    const handleAddNewProduct = () => {

        if (!newProduct) return;

        const formData = new FormData();
        formData.append("produto", newProduct.produto);
        formData.append("tamanho", newProduct.tamanho.toString());
        formData.append("quantidade", newProduct.quantidade.toString());

        if (newProduct.image instanceof File) {
            formData.append("image", newProduct.image);
        }

        axios.post("http://localhost:5000/estoque", formData,{
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                setShowAddForm(false);
                setNewProduct({
                    _id: "",
                    produto: "",
                    tamanho: 0,
                    quantidade: 0,
                    image: null
                }); // Limpa os campos
            })
            .catch(() => alert("Erro ao adicionar produto"));
    };

    const handleEdit = (product: Produto) => {
        setEditingId(product._id);
        setEditValue({ ...product });
    };

    const handleSaveEdit = (id: string) => {
        if (!editValue) return;

        axios.put(`http://localhost:5000/estoque/${id}`, editValue)
            .then(() => {
                setProducts(products.map(p => p._id === id ? editValue : p));
                setEditingId(null);
                setEditValue(null);
            })
            .catch(() => alert("Erro ao editar produto"));
    };

    const handleDelete = (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir?")) return;

        axios.delete(`http://localhost:5000/estoque/${id}`)
            .then(() => setProducts(products.filter(p => p._id !== id)))
            .catch(() => alert("Erro ao excluir produto"));
    };

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.listContainer}>
            <h2>Lista de Produtos</h2>
            <Button
                text="➕ Novo"
                onClick={handleAdd}
                className={`${styles.button} ${styles.save}`}
            />

            {showAddForm && (
                <div className={styles.addForm}>
                    <h3>Adicionar Novo Produto</h3>
                    <Input
                        type="text"
                        value={newProduct?.produto}
                        onChange={e => setNewProduct({ ...newProduct!, produto: e.target.value })}
                        placeholder="Produto"
                        label="Produto"
                        className={styles.input}
                    />
                    <Input
                        type="number"
                        value={newProduct?.tamanho}
                        onChange={e => setNewProduct({ ...newProduct!, tamanho: Number(e.target.value) })}
                        placeholder="Tamanho"
                        label="Tamanho"
                        className={styles.input}
                    />
                    <Input
                        type="number"
                        value={newProduct?.quantidade}
                        onChange={e => setNewProduct({ ...newProduct!, quantidade: Number(e.target.value) })}
                        placeholder="Quantidade"
                        label="Quantidade"
                        className={styles.input}
                    />

                    <Input
                        type="file"
                        value={undefined}
                        onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                                setNewProduct({ ...newProduct!, image: e.target.files[0] })
                            }
                        }
                        }
                        placeholder="Imagem"
                        label="Imagem"
                        className={styles.input}
                    />
                    <Button
                        text="💾 Salvar"
                        onClick={handleAddNewProduct}
                        className={`${styles.button} ${styles.save}`}
                    />
                    <Button
                        text="❌ Cancelar"
                        onClick={() => setShowAddForm(false)}
                        className={`${styles.button} ${styles.cancel}`}
                    />
                </div>
            )}

            <ul className={styles.list}>
                {products.map(product => (
                    <li key={product._id} className={`${styles.listItem} ${editingId === product._id ? styles.editing : ""}`}>
                        {editingId === product._id ? (
                            <>
                                <Input
                                    type="text"
                                    value={editValue?.produto || ""}
                                    onChange={e => setEditValue({ ...editValue!, produto: e.target.value })}
                                    placeholder="Produto"
                                    label="Produto"
                                    className={styles.input}
                                />
                                <Input
                                    type="number"
                                    value={editValue?.tamanho || ""}
                                    onChange={e => setEditValue({ ...editValue!, tamanho: Number(e.target.value) })}
                                    placeholder="Tamanho"
                                    label="Tamanho"
                                    className={styles.input}
                                />
                                <Input
                                    type="number"
                                    value={editValue?.quantidade || ""}
                                    onChange={e => setEditValue({ ...editValue!, quantidade: Number(e.target.value) })}
                                    placeholder="Quantidade"
                                    label="Quantidade"
                                    className={styles.input}
                                />
                                <Input
                                    type="file"
                                    value={undefined}
                                    onChange={e => setEditValue({ ...editValue!, image: String(e.target.files) })}
                                    placeholder="Imagem"
                                    label="Imagem"
                                    className={styles.input}
                                />

                                <Button
                                    text="💾 Salvar"
                                    onClick={() => handleSaveEdit(product._id)}
                                    className={`${styles.button} ${styles.save}`}
                                />
                                <Button
                                    text="❌ Cancelar"
                                    onClick={() => setEditingId(null)}
                                    className={`${styles.button} ${styles.cancel}`}
                                />
                            </>
                        ) : (
                            <>
                                <div>
                                    <span>{product.image && <img src={baseUrl + product.image} alt={product.produto} width="150" />}                               </span>
                                </div>
                                <div className={styles.productInfo}>
                                    <span className={styles.productName}>{product.produto}</span>
                                    <span className={styles.productSize}>Tamanho: {product.tamanho}</span>
                                    <span className={styles.productQuantity}>Quantidade: {product.quantidade}</span>
                                </div>
                                <div className={styles.buttons}>
                                    <Button
                                        text="✏️ Editar"
                                        onClick={() => handleEdit(product)}
                                        className={`${styles.button} ${styles.edit}`}
                                    />

                                    <Button
                                        text="🗑️ Excluir"
                                        onClick={() => handleDelete(product._id)}
                                        className={`${styles.button} ${styles.delete}`}
                                    />
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
