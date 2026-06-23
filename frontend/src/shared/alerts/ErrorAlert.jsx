import { swalBase } from "./swalConfig";

export default function errorAlert({
    title = "Error!",
    text = "",
    confirmText = "Aceptar",
    timer,
    ...options
} = {}) {
    return swalBase.fire({
        icon: "error",
        iconColor: "var(--color-error)",
        title,
        text,
        confirmButtonText: confirmText,
        timer,
        timerProgressBar: Boolean(timer),
        ...options,
    });
}
