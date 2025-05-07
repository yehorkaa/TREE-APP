import "./App.css";
import { TreeView } from "@/features/tree-view/tree-view";
import { treeData } from "@/features/tree-view/model/tree-view.const";

function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-amber-100 to-amber-300">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-amber-700">
          Project Tree View
        </h1>
        <TreeView data={treeData} />
      </div>
    </div>
  );
}

export default App;
