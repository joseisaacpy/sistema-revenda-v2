export function detectarCapsLock(event) {
  return event.getModifierState && event.getModifierState("CapsLock");
}
