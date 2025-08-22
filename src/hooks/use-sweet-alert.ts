import Swal from "sweetalert2";

export const useSweetAlert = () => {
  const showSuccess = (message: string) => {
    return Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      toast: true,
      position: "top-end",
    });
  };

  const showError = (message: string) => {
    return Swal.fire({
      icon: "error",
      title: "Error!",
      text: message,
      showConfirmButton: true,
      confirmButtonColor: "#ef4444",
    });
  };

  const showWarning = (message: string) => {
    return Swal.fire({
      icon: "warning",
      title: "Warning!",
      text: message,
      showConfirmButton: true,
      confirmButtonColor: "#f59e0b",
    });
  };

  const showConfirmation = (
    title: string,
    text: string,
    confirmButtonText: string = "Yes, delete it!"
  ) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText,
      cancelButtonText: "Cancel",
    });
  };

  const showLoading = (message: string = "Please wait...") => {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const hideLoading = () => {
    Swal.close();
  };

  const showInfo = (title: string, message: string) => {
    return Swal.fire({
      icon: "info",
      title,
      text: message,
      showConfirmButton: true,
      confirmButtonColor: "#3b82f6",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
    showLoading,
    hideLoading,
    showInfo,
  };
};
