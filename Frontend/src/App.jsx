import {useState,useEffect} from 'react'
import axios from 'axios'
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";

const App = () => {
  const [todo, settodo] = useState("")
  const [alltodo, setalltodo] = useState([])
  const [editingtodo, seteditingtodo] = useState(null)
  const [editedtext, seteditedtext] = useState("")

  const addTodo = async (e) => {
    e.preventDefault();
  if(!todo.trim()) return;
  try {
    const response = await axios.post('/api/todos', {text: todo});
    setalltodo([...alltodo, response.data]);
    settodo("");
  } catch (error) {
    console.error("Error adding todo:", error);
  }
  }

  const startEdidting = (todo) => {
    seteditingtodo(todo._id);
    seteditedtext(todo.text);
  };

  useEffect(() => {
  const fetchtodo = async () => {
    try {
      const response = await axios.get("/api/todos");
       console.log("Todos from backend:", response.data);
      setalltodo(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  fetchtodo();
}, []);

const saveEdit = async (id) => {
  try {
      const response = await axios.patch(`/api/todos/${id}`, { text: editedtext });
      setalltodo(alltodo.map(todo => todo._id === id ? response.data : todo));
      seteditingtodo(null);
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

const deleteTodo = async (id) => {
  try {
     await axios.delete(`/api/todos/${id}`);
    setalltodo(alltodo.filter(t => t._id !== id));

  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

const toggleTodo = async (id) => {
  try {
    const todo = alltodo.find(t => t._id === id);
    const response = await axios.patch(`/api/todos/${id}`, { completed: !todo.completed });
    setalltodo(alltodo.map(t => t._id === id ? response.data : t));
  } catch (error) {
    console.error("Error toggling todo:", error);
  }
}

  return (
    <div className="min-h-screen bg-linear-to-br from gray-50 to-gray-100
     flex items-center justify-center  p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8
      ">
        <h1 className='text-4xl font-bold text-gray-800 mb-8 text-center'>Task Manager</h1>
      <form onSubmit={addTodo} className='flex items-center gap-2 shadow-sm border border-gray-300
      p-2 rounded-lg'>
        <input className='flex-1 outline-none px-3 py-2
        text-gray-700 placeholder-gray-400'
        type='text' value={todo} onChange={(e) => settodo(e.target.value)} 
        placeholder='What needs to be done?'
        required/>

        <button className='bg-blue-400 hover:bg-blue-600 
        hover:shadow-lg hover:shadow-blue-500 rounded-md p-2 text-white font-medium
        cursor-pointer'>Add Task</button>
      </form>
      <div className='mt-4'>
        {alltodo.length === 0 ? 
        (<div></div>):
        (<div className='flex flex-col gap-4'>
          {alltodo.map((t) => (
            <div key={t._id}>
            {editingtodo === t._id ?
              (<div className='flex items-center gap-x-3'>
                <input className='flex-1 p-3 border rounded-lg border-gray-200 outline-none
                focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner' type='text' value={editedtext} 
                onChange={(e) => seteditedtext(e.target.value)}
                />
                <div className='flex gap-x-2'>
                  <button onClick={() => saveEdit(t._id)} className='px-4 py-2  bg-green-500 text-white rounded-lg  hover:bg-green-700 cursor-pointer'>
                  <MdOutlineDone/>
                  </button>
                  <button onClick={()=>seteditingtodo(null)} className='px-4 py-2  bg-red-500 text-white rounded-lg  hover:bg-red-700 cursor-pointer'>
                  <IoClose />
                  </button>
                  </div>
                
              </div>):
              (<div className='flex items-center justify-between'> 
              <div className='flex items-center gap-x-4 overflow-hidden'>
                <button  onClick={()=>toggleTodo(t._id)}className={`flex-shrink-0 h-6 w-6 border rounded-full flex items-center justify-center ${
                              t.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300 hover:border-blue-400"
                            }`}>
                  {t.completed && 
                <MdOutlineDone/>}
                </button>
                <span className='text-gray-700 font-medium truncate'>{t.text}</span>
                </div>
                                
                <div className='float-right flex gap-x-3'>
                  <button onClick={() => startEdidting(t)} className='p-2 text-blue-500 hover:text-blue-700 cursor-pointer rounded-lg hover:bg-blue-50 duration-200'>
                  <MdModeEditOutline/>
                </button>
                <button onClick={() => deleteTodo(t._id)} className='p-2 text-red-500 hover:text-red-700 cursor-pointer rounded-lg hover:bg-red-50 duration-200'>
                  <FaTrash/>
                </button>
                </div>
              </div>)
            }
            </div>))}
        </div>)}
      </div>
      </div>
    </div>
  )
}

export default App
