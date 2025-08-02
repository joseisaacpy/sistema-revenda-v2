// Detecta se o CapsLock está ativado
export const detectarCapsLock = (event) =>
  event.getModifierState && event.getModifierState("CapsLock");

// Fecha um modal ao pressionar a tecla ESC
// export const fecharModalComEsc = (event) => {
  
// };
