import { useEffect, useState } from 'react'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')


const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  type_document: '',
  number_document: '',
  role: '',
  date_start: '',
  date_end: '',
  email: '',
  phone_number: '',
  direction: '',
  status: true,
  second_phonenumber: '',
  institutional_email: '',
}

const DOCUMENT_TYPES = [
  { value: 'CC', label: 'CC' },
  { value: 'TI', label: 'TI' },
  { value: 'CE', label: 'CE' },
  { value: 'PPT', label: 'PPT' },
  { value: 'PPE', label: 'PPE' },
]

const MATERIAL_STATES = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'No Disponible', label: 'No Disponible' },
  { value: 'Mantenimiento', label: 'Mantenimiento' },
  { value: 'En prÃ©stamo', label: 'En prestamo' },
  { value: 'Baja', label: 'Baja' },
]

const EMPTY_BRAND_FORM = { name: '' }
const EMPTY_CATEGORY_FORM = { name: '' }
const EMPTY_CONSUMABLE_FORM = {
  user: '',
  id_brand: '',
  plate_sena: '',
  material_name: '',
  quantity: '',
  unit_price: '',
  total_price: '',
  state: '',
  description: '',
  date_of_purchase: '',
  ubication: '',
}
const EMPTY_RETURNABLE_FORM = {
  id_material: '',
  id_category: '',
  model: '',
  serial: '',
  dimensions: '',
}

const isEmpty = (value) => !value || value.trim() === ''

const parseOptionalNumber = (value) => {
  if (isEmpty(value)) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const parseRequiredNumber = (value) => {
  if (isEmpty(value)) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const readResponse = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const formatErrorPayload = (payload) => {
  if (!payload) return 'Error desconocido'
  if (typeof payload === 'string') return payload
  if (Array.isArray(payload)) return payload.join(', ')
  if (typeof payload === 'object') {
    return Object.entries(payload)
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join(' | ')
  }
  return String(payload)
}

export default function App() {
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [listError, setListError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState(null)
  const [formNotice, setFormNotice] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [brands, setBrands] = useState([])
  const [brandForm, setBrandForm] = useState(EMPTY_BRAND_FORM)
  const [brandEditingId, setBrandEditingId] = useState(null)
  const [brandLoading, setBrandLoading] = useState(false)
  const [brandSaving, setBrandSaving] = useState(false)
  const [brandDeletingId, setBrandDeletingId] = useState(null)
  const [brandError, setBrandError] = useState(null)
  const [brandNotice, setBrandNotice] = useState(null)

  const [categories, setCategories] = useState([])
  const [categoryForm, setCategoryForm] = useState(EMPTY_CATEGORY_FORM)
  const [categoryEditingId, setCategoryEditingId] = useState(null)
  const [categoryLoading, setCategoryLoading] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)
  const [categoryDeletingId, setCategoryDeletingId] = useState(null)
  const [categoryError, setCategoryError] = useState(null)
  const [categoryNotice, setCategoryNotice] = useState(null)

  const [consumables, setConsumables] = useState([])
  const [consumableForm, setConsumableForm] = useState(EMPTY_CONSUMABLE_FORM)
  const [consumableEditingId, setConsumableEditingId] = useState(null)
  const [consumableLoading, setConsumableLoading] = useState(false)
  const [consumableSaving, setConsumableSaving] = useState(false)
  const [consumableDeletingId, setConsumableDeletingId] = useState(null)
  const [consumableError, setConsumableError] = useState(null)
  const [consumableNotice, setConsumableNotice] = useState(null)

  const [returnables, setReturnables] = useState([])
  const [returnableForm, setReturnableForm] = useState(EMPTY_RETURNABLE_FORM)
  const [returnableEditingId, setReturnableEditingId] = useState(null)
  const [returnableLoading, setReturnableLoading] = useState(false)
  const [returnableSaving, setReturnableSaving] = useState(false)
  const [returnableDeletingId, setReturnableDeletingId] = useState(null)
  const [returnableError, setReturnableError] = useState(null)
  const [returnableNotice, setReturnableNotice] = useState(null)

  const fetchUsers = async () => {
    setLoadingUsers(true)
    setListError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
        headers: { Accept: 'application/json' },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setUsers(Array.isArray(data) ? data : [])
      setLastUpdated(new Date())
    } catch (error) {
      setListError(error?.message || 'No se pudo cargar la lista.')
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchBrands = async () => {
    setBrandLoading(true)
    setBrandError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/brands/`, {
        headers: { Accept: 'application/json' },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setBrands(Array.isArray(data) ? data : [])
    } catch (error) {
      setBrandError(error?.message || 'No se pudo cargar marcas.')
    } finally {
      setBrandLoading(false)
    }
  }

  const fetchCategories = async () => {
    setCategoryLoading(true)
    setCategoryError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories/`, {
        headers: { Accept: 'application/json' },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      setCategoryError(error?.message || 'No se pudo cargar categorias.')
    } finally {
      setCategoryLoading(false)
    }
  }

  const fetchConsumables = async () => {
    setConsumableLoading(true)
    setConsumableError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/consumables/`, {
        headers: { Accept: 'application/json' },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setConsumables(Array.isArray(data) ? data : [])
    } catch (error) {
      setConsumableError(error?.message || 'No se pudo cargar consumibles.')
    } finally {
      setConsumableLoading(false)
    }
  }

  const fetchReturnables = async () => {
    setReturnableLoading(true)
    setReturnableError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/returnables/`, {
        headers: { Accept: 'application/json' },
      })
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setReturnables(Array.isArray(data) ? data : [])
    } catch (error) {
      setReturnableError(error?.message || 'No se pudo cargar retornables.')
    } finally {
      setReturnableLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchBrands()
    fetchCategories()
    fetchConsumables()
    fetchReturnables()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError(null)
  }

  const buildPayload = () => {
    const requiredFields = [
      'first_name',
      'last_name',
      'type_document',
      'number_document',
      'date_start',
      'date_end',
      'email',
      'phone_number',
      'direction',
    ]
    const missing = requiredFields.filter((field) => isEmpty(form[field]))
    if (missing.length) {
      return { error: 'Completa los campos obligatorios.' }
    }

    const requiredNumbers = {
      number_document: parseRequiredNumber(form.number_document),
      phone_number: parseRequiredNumber(form.phone_number),
    }

    if (Object.values(requiredNumbers).some((value) => value === null)) {
      return { error: 'Verifica los campos numericos.' }
    }

    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      type_document: form.type_document,
      number_document: requiredNumbers.number_document,
      role: parseOptionalNumber(form.role),
      date_start: form.date_start,
      date_end: form.date_end,
      email: form.email.trim(),
      phone_number: requiredNumbers.phone_number,
      direction: form.direction.trim(),
      status: Boolean(form.status),
      second_phonenumber: parseOptionalNumber(form.second_phonenumber),
      institutional_email: isEmpty(form.institutional_email)
        ? null
        : form.institutional_email.trim(),
    }

    return { payload, error: null }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError(null)
    setFormNotice(null)

    const { payload, error } = buildPayload()
    if (error) {
      setFormError(error)
      return
    }

    setSaving(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${editingId ? `${editingId}/` : ''}`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setFormNotice(editingId ? 'Usuario actualizado.' : 'Usuario creado.')
      resetForm()
      fetchUsers()
    } catch (error) {
      setFormError(error?.message || 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setForm({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      type_document: user.type_document ?? '',
      number_document: user.number_document?.toString() ?? '',
      role: user.role?.toString() ?? '',
      date_start: user.date_start ?? '',
      date_end: user.date_end ?? '',
      email: user.email ?? '',
      phone_number: user.phone_number?.toString() ?? '',
      direction: user.direction ?? '',
      status: Boolean(user.status),
      second_phonenumber: user.second_phonenumber?.toString() ?? '',
      institutional_email: user.institutional_email ?? '',
    })
    setFormError(null)
    setFormNotice(null)
  }

  const handleDelete = async (userId) => {
    const approved = window.confirm('Seguro que deseas eliminar este usuario?')
    if (!approved) return
    setDeletingId(userId)
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await readResponse(response)
        throw new Error(formatErrorPayload(data) || 'No se pudo eliminar.')
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (error) {
      setListError(error?.message || 'No se pudo eliminar.')
    } finally {
      setDeletingId(null)
    }
  }

  const resetBrandForm = () => {
    setBrandForm(EMPTY_BRAND_FORM)
    setBrandEditingId(null)
    setBrandError(null)
  }

  const handleBrandSubmit = async (event) => {
    event.preventDefault()
    setBrandError(null)
    setBrandNotice(null)
    if (isEmpty(brandForm.name)) {
      setBrandError('El nombre de la marca es obligatorio.')
      return
    }

    setBrandSaving(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/brands/${brandEditingId ? `${brandEditingId}/` : ''}`,
        {
          method: brandEditingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ name: brandForm.name.trim() }),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setBrandNotice(brandEditingId ? 'Marca actualizada.' : 'Marca creada.')
      resetBrandForm()
      fetchBrands()
    } catch (error) {
      setBrandError(error?.message || 'No se pudo guardar la marca.')
    } finally {
      setBrandSaving(false)
    }
  }

  const handleBrandEdit = (brand) => {
    setBrandEditingId(brand.id)
    setBrandForm({ name: brand.name ?? '' })
    setBrandError(null)
    setBrandNotice(null)
  }

  const handleBrandDelete = async (brandId) => {
    const approved = window.confirm('Seguro que deseas eliminar esta marca?')
    if (!approved) return
    setBrandDeletingId(brandId)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/brands/${brandId}/`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await readResponse(response)
        throw new Error(formatErrorPayload(data) || 'No se pudo eliminar.')
      }
      setBrands((prev) => prev.filter((item) => item.id !== brandId))
    } catch (error) {
      setBrandError(error?.message || 'No se pudo eliminar la marca.')
    } finally {
      setBrandDeletingId(null)
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm(EMPTY_CATEGORY_FORM)
    setCategoryEditingId(null)
    setCategoryError(null)
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    setCategoryError(null)
    setCategoryNotice(null)
    if (isEmpty(categoryForm.name)) {
      setCategoryError('El nombre de la categoria es obligatorio.')
      return
    }

    setCategorySaving(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/categories/${categoryEditingId ? `${categoryEditingId}/` : ''}`,
        {
          method: categoryEditingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ name: categoryForm.name.trim() }),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setCategoryNotice(categoryEditingId ? 'Categoria actualizada.' : 'Categoria creada.')
      resetCategoryForm()
      fetchCategories()
    } catch (error) {
      setCategoryError(error?.message || 'No se pudo guardar la categoria.')
    } finally {
      setCategorySaving(false)
    }
  }

  const handleCategoryEdit = (category) => {
    setCategoryEditingId(category.id)
    setCategoryForm({ name: category.name ?? '' })
    setCategoryError(null)
    setCategoryNotice(null)
  }

  const handleCategoryDelete = async (categoryId) => {
    const approved = window.confirm('Seguro que deseas eliminar esta categoria?')
    if (!approved) return
    setCategoryDeletingId(categoryId)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories/${categoryId}/`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const data = await readResponse(response)
        throw new Error(formatErrorPayload(data) || 'No se pudo eliminar.')
      }
      setCategories((prev) => prev.filter((item) => item.id !== categoryId))
    } catch (error) {
      setCategoryError(error?.message || 'No se pudo eliminar la categoria.')
    } finally {
      setCategoryDeletingId(null)
    }
  }

  const resetConsumableForm = () => {
    setConsumableForm(EMPTY_CONSUMABLE_FORM)
    setConsumableEditingId(null)
    setConsumableError(null)
  }

  const buildConsumablePayload = () => {
    if (isEmpty(consumableForm.material_name)) {
      return { error: 'El nombre del material es obligatorio.' }
    }

    return {
      payload: {
        material_name: consumableForm.material_name.trim(),
        user: parseOptionalNumber(consumableForm.user),
        id_brand: parseOptionalNumber(consumableForm.id_brand),
        plate_sena: isEmpty(consumableForm.plate_sena)
          ? null
          : consumableForm.plate_sena.trim(),
        quantity: parseOptionalNumber(consumableForm.quantity),
        unit_price: parseOptionalNumber(consumableForm.unit_price),
        total_price: parseOptionalNumber(consumableForm.total_price),
        state: isEmpty(consumableForm.state) ? null : consumableForm.state,
        description: isEmpty(consumableForm.description)
          ? null
          : consumableForm.description.trim(),
        date_of_purchase: isEmpty(consumableForm.date_of_purchase)
          ? null
          : consumableForm.date_of_purchase,
        ubication: isEmpty(consumableForm.ubication)
          ? null
          : consumableForm.ubication.trim(),
      },
      error: null,
    }
  }

  const handleConsumableSubmit = async (event) => {
    event.preventDefault()
    setConsumableError(null)
    setConsumableNotice(null)

    const { payload, error } = buildConsumablePayload()
    if (error) {
      setConsumableError(error)
      return
    }

    setConsumableSaving(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/consumables/${consumableEditingId ? `${consumableEditingId}/` : ''}`,
        {
          method: consumableEditingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setConsumableNotice(
        consumableEditingId ? 'Material actualizado.' : 'Material creado.',
      )
      resetConsumableForm()
      fetchConsumables()
    } catch (error) {
      setConsumableError(error?.message || 'No se pudo guardar el material.')
    } finally {
      setConsumableSaving(false)
    }
  }

  const handleConsumableEdit = (material) => {
    setConsumableEditingId(material.id)
    setConsumableForm({
      user: material.user?.toString() ?? '',
      id_brand: material.id_brand?.toString() ?? '',
      plate_sena: material.plate_sena ?? '',
      material_name: material.material_name ?? '',
      quantity: material.quantity?.toString() ?? '',
      unit_price: material.unit_price?.toString() ?? '',
      total_price: material.total_price?.toString() ?? '',
      state: material.state ?? '',
      description: material.description ?? '',
      date_of_purchase: material.date_of_purchase ?? '',
      ubication: material.ubication ?? '',
    })
    setConsumableError(null)
    setConsumableNotice(null)
  }

  const handleConsumableDelete = async (materialId) => {
    const approved = window.confirm('Seguro que deseas eliminar este material?')
    if (!approved) return
    setConsumableDeletingId(materialId)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/consumables/${materialId}/`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const data = await readResponse(response)
        throw new Error(formatErrorPayload(data) || 'No se pudo eliminar.')
      }
      setConsumables((prev) => prev.filter((item) => item.id !== materialId))
    } catch (error) {
      setConsumableError(error?.message || 'No se pudo eliminar el material.')
    } finally {
      setConsumableDeletingId(null)
    }
  }

  const resetReturnableForm = () => {
    setReturnableForm(EMPTY_RETURNABLE_FORM)
    setReturnableEditingId(null)
    setReturnableError(null)
  }

  const buildReturnablePayload = () => {
    const idMaterial = parseRequiredNumber(returnableForm.id_material)
    if (idMaterial === null) {
      return { error: 'El ID del material consumible es obligatorio.' }
    }

    return {
      payload: {
        id_material: idMaterial,
        id_category: parseOptionalNumber(returnableForm.id_category),
        model: isEmpty(returnableForm.model) ? null : returnableForm.model.trim(),
        serial: isEmpty(returnableForm.serial) ? null : returnableForm.serial.trim(),
        technical_specifications: null,
        dimensions: isEmpty(returnableForm.dimensions)
          ? null
          : returnableForm.dimensions.trim(),
      },
      error: null,
    }
  }

  const handleReturnableSubmit = async (event) => {
    event.preventDefault()
    setReturnableError(null)
    setReturnableNotice(null)

    const { payload, error } = buildReturnablePayload()
    if (error) {
      setReturnableError(error)
      return
    }

    setReturnableSaving(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/returnables/${returnableEditingId ? `${returnableEditingId}/` : ''}`,
        {
          method: returnableEditingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      const data = await readResponse(response)
      if (!response.ok) {
        throw new Error(formatErrorPayload(data))
      }
      setReturnableNotice(
        returnableEditingId ? 'Retornable actualizado.' : 'Retornable creado.',
      )
      resetReturnableForm()
      fetchReturnables()
    } catch (error) {
      setReturnableError(error?.message || 'No se pudo guardar el retornable.')
    } finally {
      setReturnableSaving(false)
    }
  }

  const handleReturnableEdit = (material) => {
    setReturnableEditingId(material.id_material)
    setReturnableForm({
      id_material: material.id_material?.toString() ?? '',
      id_category: material.id_category?.toString() ?? '',
      model: material.model ?? '',
      serial: material.serial ?? '',
      dimensions: material.dimensions ?? '',
    })
    setReturnableError(null)
    setReturnableNotice(null)
  }

  const handleReturnableDelete = async (materialId) => {
    const approved = window.confirm('Seguro que deseas eliminar este retornable?')
    if (!approved) return
    setReturnableDeletingId(materialId)
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/returnables/${materialId}/`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        const data = await readResponse(response)
        throw new Error(formatErrorPayload(data) || 'No se pudo eliminar.')
      }
      setReturnables((prev) => prev.filter((item) => item.id_material !== materialId))
    } catch (error) {
      setReturnableError(error?.message || 'No se pudo eliminar el retornable.')
    } finally {
      setReturnableDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#fdecc8,_transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_#d6e6ff,_transparent_55%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3">
          <span className="w-fit rounded-full border border-slate-300/60 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            SIA Panel
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            CRUD de usuarios
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Administra usuarios desde un panel simple y directo.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId ? 'Editar usuario' : 'Crear usuario'}
                </h2>
                <p className="text-xs text-slate-500">
                  Campos con * son obligatorios. El rol se ingresa por ID.
                </p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Nombre *
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, first_name: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Juan"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Apellido *
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, last_name: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Perez"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Tipo documento *
                  <select
                    name="type_document"
                    value={form.type_document}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, type_document: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Selecciona</option>
                    {DOCUMENT_TYPES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Numero documento *
                  <input
                    name="number_document"
                    value={form.number_document}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, number_document: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="1234456789"
                  />
                </label>  
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  ID Rol (opcional)
                  <input
                    name="role"
                    value={form.role}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, role: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="1"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Estado
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.status}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, status: event.target.checked }))
                      }
                    />
                    <span className="text-xs text-slate-500">
                      {form.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Fecha inicio *
                  <input
                    type="date"
                    name="date_start"
                    value={form.date_start}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, date_start: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Fecha fin *
                  <input
                    type="date"
                    name="date_end"
                    value={form.date_end}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, date_end: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Email *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="correo@dominio.com"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Telefono *
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone_number: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="3001234567"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs font-semibold text-slate-600">
                Direccion *
                <input
                  name="direction"
                  value={form.direction}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, direction: event.target.value }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Calle 1"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Segundo telefono
                  <input
                    name="second_phonenumber"
                    value={form.second_phonenumber}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        second_phonenumber: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Email institucional
                  <input
                    type="email"
                    name="institutional_email"
                    value={form.institutional_email}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        institutional_email: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              {formError && <p className="text-sm font-semibold text-rose-500">{formError}</p>}
              {formNotice && (
                <p className="text-sm font-semibold text-emerald-600">{formNotice}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="mt-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Guardando...' : editingId ? 'Actualizar usuario' : 'Crear usuario'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Lista de usuarios</h2>
                <p className="text-xs text-slate-500">
                  {loadingUsers
                    ? 'Cargando...'
                    : `Total: ${users.length} usuarios`}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Refrescar
              </button>
            </div>

            {lastUpdated && (
              <p className="mt-2 text-[11px] text-slate-400">
                Ultima actualizacion: {lastUpdated.toLocaleString()}
              </p>
            )}

            {listError && <p className="mt-3 text-sm font-semibold text-rose-500">{listError}</p>}

            <div className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-slate-200/70">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/80 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Rol</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white/80">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-3 py-2 font-semibold text-slate-700">{user.id}</td>
                      <td className="px-3 py-2 text-slate-700">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-3 py-2 text-slate-500">{user.email}</td>
                      <td className="px-3 py-2 text-slate-500">{user.role}</td>
                      <td className="px-3 py-2 text-slate-500">
                        {user.status ? 'Activo' : 'Inactivo'}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="rounded-full border border-slate-300/80 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === user.id}
                            onClick={() => handleDelete(user.id)}
                            className="rounded-full border border-rose-200/80 px-3 py-1 text-[11px] font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                          >
                            {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!users.length && !loadingUsers && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">CRUD de materiales</h2>
          <p className="text-sm text-slate-600">
            Gestiona marcas, categorias y materiales consumibles/retornables.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Marcas</h3>
                <p className="text-xs text-slate-500">
                  {brandLoading ? 'Cargando...' : `Total: ${brands.length}`}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchBrands}
                className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Refrescar
              </button>
            </div>

            <form onSubmit={handleBrandSubmit} className="mt-4 flex flex-wrap gap-2">
              <input
                value={brandForm.name}
                onChange={(event) => setBrandForm({ name: event.target.value })}
                placeholder="Nombre de marca"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={brandSaving}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
              >
                {brandSaving ? 'Guardando...' : brandEditingId ? 'Actualizar' : 'Crear'}
              </button>
              {brandEditingId && (
                <button
                  type="button"
                  onClick={resetBrandForm}
                  className="rounded-full border border-slate-300/80 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
              )}
            </form>

            {brandError && <p className="mt-2 text-xs font-semibold text-rose-500">{brandError}</p>}
            {brandNotice && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">{brandNotice}</p>
            )}

            <div className="mt-4 max-h-60 overflow-auto rounded-xl border border-slate-200/70">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/80 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white/80">
                  {brands.map((brand) => (
                    <tr key={brand.id}>
                      <td className="px-3 py-2 font-semibold text-slate-700">{brand.id}</td>
                      <td className="px-3 py-2 text-slate-700">{brand.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleBrandEdit(brand)}
                            className="rounded-full border border-slate-300/80 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={brandDeletingId === brand.id}
                            onClick={() => handleBrandDelete(brand.id)}
                            className="rounded-full border border-rose-200/80 px-3 py-1 text-[11px] font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                          >
                            {brandDeletingId === brand.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!brands.length && !brandLoading && (
                    <tr>
                      <td colSpan={3} className="px-3 py-5 text-center text-slate-400">
                        No hay marcas registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Categorias</h3>
                <p className="text-xs text-slate-500">
                  {categoryLoading ? 'Cargando...' : `Total: ${categories.length}`}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchCategories}
                className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Refrescar
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="mt-4 flex flex-wrap gap-2">
              <input
                value={categoryForm.name}
                onChange={(event) => setCategoryForm({ name: event.target.value })}
                placeholder="Nombre de categoria"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={categorySaving}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
              >
                {categorySaving ? 'Guardando...' : categoryEditingId ? 'Actualizar' : 'Crear'}
              </button>
              {categoryEditingId && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="rounded-full border border-slate-300/80 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
              )}
            </form>

            {categoryError && (
              <p className="mt-2 text-xs font-semibold text-rose-500">{categoryError}</p>
            )}
            {categoryNotice && (
              <p className="mt-2 text-xs font-semibold text-emerald-600">{categoryNotice}</p>
            )}

            <div className="mt-4 max-h-60 overflow-auto rounded-xl border border-slate-200/70">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/80 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white/80">
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-3 py-2 font-semibold text-slate-700">{category.id}</td>
                      <td className="px-3 py-2 text-slate-700">{category.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCategoryEdit(category)}
                            className="rounded-full border border-slate-300/80 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={categoryDeletingId === category.id}
                            onClick={() => handleCategoryDelete(category.id)}
                            className="rounded-full border border-rose-200/80 px-3 py-1 text-[11px] font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                          >
                            {categoryDeletingId === category.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!categories.length && !categoryLoading && (
                    <tr>
                      <td colSpan={3} className="px-3 py-5 text-center text-slate-400">
                        No hay categorias registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {consumableEditingId ? 'Editar consumible' : 'Crear consumible'}
                </h3>
                <p className="text-xs text-slate-500">Solo el nombre es obligatorio.</p>
              </div>
              {consumableEditingId && (
                <button
                  type="button"
                  onClick={resetConsumableForm}
                  className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleConsumableSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Nombre del material *
                  <input
                    value={consumableForm.material_name}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({
                        ...prev,
                        material_name: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Cable HDMI"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Placa SENA
                  <input
                    value={consumableForm.plate_sena}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, plate_sena: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  ID Marca
                  <input
                    value={consumableForm.id_brand}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, id_brand: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="1"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  ID Usuario
                  <input
                    value={consumableForm.user}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, user: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Cantidad
                  <input
                    value={consumableForm.quantity}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, quantity: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="10"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Estado
                  <select
                    value={consumableForm.state}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, state: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Selecciona</option>
                    {MATERIAL_STATES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Precio unitario
                  <input
                    value={consumableForm.unit_price}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, unit_price: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="25000"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Precio total
                  <input
                    value={consumableForm.total_price}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, total_price: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="250000"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs font-semibold text-slate-600">
                Descripcion
                <input
                  value={consumableForm.description}
                  onChange={(event) =>
                    setConsumableForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Opcional"
                />
              </label>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Fecha de compra
                  <input
                    type="date"
                    value={consumableForm.date_of_purchase}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({
                        ...prev,
                        date_of_purchase: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Ubicacion
                  <input
                    value={consumableForm.ubication}
                    onChange={(event) =>
                      setConsumableForm((prev) => ({ ...prev, ubication: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Bodega 1"
                  />
                </label>
              </div>

              {consumableError && (
                <p className="text-sm font-semibold text-rose-500">{consumableError}</p>
              )}
              {consumableNotice && (
                <p className="text-sm font-semibold text-emerald-600">{consumableNotice}</p>
              )}

              <button
                type="submit"
                disabled={consumableSaving}
                className="mt-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70"
              >
                {consumableSaving
                  ? 'Guardando...'
                  : consumableEditingId
                    ? 'Actualizar material'
                    : 'Crear material'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Consumibles</h3>
                <p className="text-xs text-slate-500">
                  {consumableLoading ? 'Cargando...' : `Total: ${consumables.length}`}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchConsumables}
                className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Refrescar
              </button>
            </div>

            {consumableError && (
              <p className="mt-3 text-sm font-semibold text-rose-500">{consumableError}</p>
            )}

            <div className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-slate-200/70">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/80 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2">Marca</th>
                    <th className="px-3 py-2">Cantidad</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white/80">
                  {consumables.map((material) => (
                    <tr key={material.id}>
                      <td className="px-3 py-2 font-semibold text-slate-700">{material.id}</td>
                      <td className="px-3 py-2 text-slate-700">{material.material_name}</td>
                      <td className="px-3 py-2 text-slate-500">{material.id_brand}</td>
                      <td className="px-3 py-2 text-slate-500">{material.quantity}</td>
                      <td className="px-3 py-2 text-slate-500">{material.state}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleConsumableEdit(material)}
                            className="rounded-full border border-slate-300/80 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={consumableDeletingId === material.id}
                            onClick={() => handleConsumableDelete(material.id)}
                            className="rounded-full border border-rose-200/80 px-3 py-1 text-[11px] font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                          >
                            {consumableDeletingId === material.id ? 'Eliminando...' : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!consumables.length && !consumableLoading && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                        No hay consumibles registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {returnableEditingId ? 'Editar retornable' : 'Crear retornable'}
                </h3>
                <p className="text-xs text-slate-500">
                  El ID del material consumible es obligatorio.
                </p>
              </div>
              {returnableEditingId && (
                <button
                  type="button"
                  onClick={resetReturnableForm}
                  className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                >
                  Cancelar
                </button>
              )}
            </div>

            <form onSubmit={handleReturnableSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  ID Material *
                  <input
                    value={returnableForm.id_material}
                    onChange={(event) =>
                      setReturnableForm((prev) => ({
                        ...prev,
                        id_material: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="1"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  ID Categoria
                  <input
                    value={returnableForm.id_category}
                    onChange={(event) =>
                      setReturnableForm((prev) => ({
                        ...prev,
                        id_category: event.target.value,
                      }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Modelo
                  <input
                    value={returnableForm.model}
                    onChange={(event) =>
                      setReturnableForm((prev) => ({ ...prev, model: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
                <label className="grid gap-1 text-xs font-semibold text-slate-600">
                  Serial
                  <input
                    value={returnableForm.serial}
                    onChange={(event) =>
                      setReturnableForm((prev) => ({ ...prev, serial: event.target.value }))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    placeholder="Opcional"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs font-semibold text-slate-600">
                Dimensiones
                <input
                  value={returnableForm.dimensions}
                  onChange={(event) =>
                    setReturnableForm((prev) => ({ ...prev, dimensions: event.target.value }))
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="Opcional"
                />
              </label>

              {returnableError && (
                <p className="text-sm font-semibold text-rose-500">{returnableError}</p>
              )}
              {returnableNotice && (
                <p className="text-sm font-semibold text-emerald-600">{returnableNotice}</p>
              )}

              <button
                type="submit"
                disabled={returnableSaving}
                className="mt-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70"
              >
                {returnableSaving
                  ? 'Guardando...'
                  : returnableEditingId
                    ? 'Actualizar retornable'
                    : 'Crear retornable'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Retornables</h3>
                <p className="text-xs text-slate-500">
                  {returnableLoading ? 'Cargando...' : `Total: ${returnables.length}`}
                </p>
              </div>
              <button
                type="button"
                onClick={fetchReturnables}
                className="rounded-full border border-slate-300/80 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
              >
                Refrescar
              </button>
            </div>

            {returnableError && (
              <p className="mt-3 text-sm font-semibold text-rose-500">{returnableError}</p>
            )}

            <div className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-slate-200/70">
              <table className="min-w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/80 text-[11px] uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">ID Material</th>
                    <th className="px-3 py-2">Modelo</th>
                    <th className="px-3 py-2">Serial</th>
                    <th className="px-3 py-2">Categoria</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 bg-white/80">
                  {returnables.map((material) => (
                    <tr key={material.id_material}>
                      <td className="px-3 py-2 font-semibold text-slate-700">
                        {material.id_material}
                      </td>
                      <td className="px-3 py-2 text-slate-700">{material.model}</td>
                      <td className="px-3 py-2 text-slate-500">{material.serial}</td>
                      <td className="px-3 py-2 text-slate-500">{material.id_category}</td>
                      <td className="px-3 py-2">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleReturnableEdit(material)}
                            className="rounded-full border border-slate-300/80 px-3 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-slate-400"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={returnableDeletingId === material.id_material}
                            onClick={() => handleReturnableDelete(material.id_material)}
                            className="rounded-full border border-rose-200/80 px-3 py-1 text-[11px] font-semibold text-rose-600 transition hover:border-rose-300 disabled:opacity-60"
                          >
                            {returnableDeletingId === material.id_material
                              ? 'Eliminando...'
                              : 'Eliminar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!returnables.length && !returnableLoading && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                        No hay retornables registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
