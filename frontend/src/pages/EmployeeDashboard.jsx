import { useEffect, useState } from 'react';
import API from '../services/api';
import { CheckCircle, Clock, ListChecks, LogOut } from 'lucide-react';

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/${user.id}`);
      setTasks(data);
    } catch (err) { console.log(err); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, { status });
      fetchTasks(); // Refresh list
    } catch (err) { console.log(err); }
  };

  return (
    <div className="min-h-screen bg-slate p-6 text-whitish">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-lightgrey/20 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-accent">Work Desk</h1>
            <p className="text-lightgrey text-sm">Welcome, {user.name}</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href='/'; }}
            className="flex items-center gap-2 text-lightgrey hover:text-whitish transition-colors"
          >
            <LogOut size={18}/> Logout
          </button>
        </header>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ListChecks className="text-accent" /> Your Assigned Tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-secondhand p-10 rounded-xl text-center border border-dashed border-lightgrey/30">
              <p className="text-lightgrey italic">No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map(task => (
                <div key={task._id} className="bg-secondhand p-6 rounded-xl border border-lightgrey/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-whitish mb-1">{task.title}</h3>
                    <p className="text-lightgrey text-sm leading-relaxed">{task.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                        task.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    {['Pending', 'In Progress', 'Completed'].map(s => (
                      <button 
                        key={s}
                        onClick={() => updateStatus(task._id, s)}
                        disabled={task.status === s}
                        className={`flex-1 md:flex-none px-3 py-2 rounded text-xs font-bold transition-all ${
                          task.status === s 
                          ? 'bg-accent text-slate' 
                          : 'bg-slate text-lightgrey hover:bg-lightgrey hover:text-slate'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}