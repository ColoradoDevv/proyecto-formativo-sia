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

  useEffect(() => {
    fetchUsers()
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

      </div>
    </div>
  )
}
