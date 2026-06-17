import { useNavigate, useParams } from "react-router-dom";
import { Button, IconButton } from "@/shared";
import DetailCard from "../components/detail/DetailCard";
import DetailField from "../components/detail/DetailField";
import { Undo2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getBrandById } from "../services/brandService";
import { TailChase } from "ldrs/react";

export default function BrandDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const data = await getBrandById(id);
        setBrand(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <TailChase size="40" speed="1.75" color="var(--semantic-text-primary)" />
      </div>
    );

  if (error)
    return <p className="text-error text-center p-6">Error al cargar marca: {error.message}</p>;

  if (!brand) return <p className="text-center p-6">Marca no encontrada</p>;

  return (
    <div className="h-full p-6 text-text-primary flex flex-col gap-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <IconButton onClick={() => navigate(-1)} variant="ghost">
          <Undo2 />
        </IconButton>
        <div>
          <h2 className="text-h3">Visualizar Marca</h2>
          <p className="text-small text-text-muted">Información completa en modo solo lectura.</p>
        </div>
      </div>

      {/* Card de información */}
      <DetailCard title="Información General">
        <DetailField label="Nombre" value={brand.name} />
        <DetailField
          label="Estado"
          value={brand.is_active ? "Activo" : "Inactivo"}
        />
      </DetailCard>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-end">
        <Button variant="secondary" size="md" onClick={() => navigate("/marcas")}>
          Volver al listado
        </Button>
        <Button variant="primary" size="md" onClick={() => navigate(`/marcas/editar/${brand.id}`)}>
          Editar
        </Button>
      </div>
    </div>
  );
}
