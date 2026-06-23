import { swalBase } from "./swalConfig";

export default function successAlert({
    title = "¡Listo!",
    text = "",
    confirmText = "Aceptar",
    timer,
    ...options
} = {}) {
    return swalBase.fire({
        icon: "success",
        iconColor: "var(--color-success)",
        title,
        text,
        confirmButtonText: confirmText,
        timer,
        timerProgressBar: Boolean(timer),
        ...options,
    });
}
