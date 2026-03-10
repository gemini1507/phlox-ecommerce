const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Halaman {title}</h2>
        <p className="text-muted-foreground">Halaman ini sedang dibangun.</p>
        <div className="mt-8">
           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
