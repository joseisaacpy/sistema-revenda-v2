const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center h-screen w-screen">
      <div className="w-15 h-15 border-4 border-blue-500 border-t-transparent  rounded-full animate-spin"></div>
      <h1 className="mt-4 text-2xl font-bold">Carregando...</h1>
    </div>
  );
};

export default Loader;
