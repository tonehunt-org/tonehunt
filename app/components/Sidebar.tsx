const Sidebar = () => {
  return (
    <div className="w-full p-4">
      <div className="w-full text-white rounded-xl p-2 mb-8 border border-gray-600">
        <span className="block p-20 text-center">USER AREA</span>
      </div>
      <div className="w-full text-white rounded-xl p-2 mb-8 border border-gray-600">
        <span className="block p-20 text-center">TAGS AREA</span>
      </div>
      <div className="w-full text-white rounded-xl p-2 mb-8 border border-gray-600">
        <span className="block p-20 text-center">ARTICLES</span>
      </div>
    </div>
  );
};

export default Sidebar;
