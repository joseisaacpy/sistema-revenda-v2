import { ToastContainer, toast } from "react-toastify";
const ConfirmDeleteToast = ({
  onConfirm,
  onCancel,
  mensagem = "Deseja realmente deletar?",
}) => (
  <div>
    <p>{mensagem}</p>
    <div className="mt-2.5 text-right">
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2.5"
        onClick={() => {
          onConfirm();
          toast.dismiss();
        }}
      >
        Confirmar
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          onCancel();
          toast.dismiss();
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
);

export default ConfirmDeleteToast;
