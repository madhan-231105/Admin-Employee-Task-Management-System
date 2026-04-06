import { useEffect, useState } from 'react';
import API from '../services/api';
import { UserCheck, PlusCircle, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [task, setTask] = useState({ title: '', description: '', assignedTo: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await API.get('/admin/employees');
    setEmployees(data);
  };

  const handleApprove = async (id) => {
    await API.patch(`/admin/approve/${id}`);
    fetchEmployees();
  };

  const assignTask = async (e) => {
    e.preventDefault();
    if(!task.assignedTo) return alert("Select an employee");
    await API.post('/admin/tasks', task);
    alert("Task Assigned!");
    setTask({ title: '', description: '', assignedTo: '' });
  };

  return (
    <div className="min-h-screen bg-slate p-6 text-whitish">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-lightgrey/20 pb-4">
          <h1 className="text-4xl font-extrabold text-accent">Admin Portal</h1>
          <button 
            onClick={() => { localStorage.clear(); window.location.href='/'; }}
            className="flex items-center gap-2 text-lightgrey hover:text-whitish"
          >
            <LogOut size={18}/> Logout
          </button>
        </header>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Employee Approvals */}
          <section className="bg-secondhand p-6 rounded-xl border border-lightgrey/10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <UserCheck className="text-accent" /> Pending Approvals
            </h2>
            <div className="space-y-4">
              {employees.filter(e => !e.isApproved).map(emp => (
                <div key={emp._id} className="flex justify-between items-center bg-slate p-4 rounded-lg">
                  <div>
                    <p className="font-bold">{emp.name}</p>
                    <p className="text-sm text-lightgrey">{emp.email}</p>
                  </div>
                  <button 
                    onClick={() => handleApprove(emp._id)}
                    className="bg-accent text-slate px-4 py-1 rounded text-sm font-bold hover:bg-whitish"
                  >
                    Approve
                  </button>
                </div>
              ))}
              {employees.filter(e => !e.isApproved).length === 0 && <p className="text-lightgrey italic text-sm">No pending approvals.</p>}
            </div>
          </section>

          {/* Task Assignment */}
          <section className="bg-secondhand p-6 rounded-xl border border-lightgrey/10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <PlusCircle className="text-accent" /> Assign New Task
            </h2>
            <form onSubmit={assignTask} className="space-y-4">
              <input 
                className="w-full p-3 rounded bg-slate border border-lightgrey text-whitish"
                placeholder="Task Title"
                value={task.title}
                onChange={e => setTask({...task, title: e.target.value})}
                required
              />
              <textarea 
                className="w-full p-3 rounded bg-slate border border-lightgrey text-whitish"
                placeholder="Description"
                value={task.description}
                onChange={e => setTask({...task, description: e.target.value})}
              />
              <select 
                className="w-full p-3 rounded bg-slate border border-lightgrey text-whitish"
                onChange={e => setTask({...task, assignedTo: e.target.value})}
                value={task.assignedTo}
                required
              >
                <option value="">Choose Employee</option>
                {employees.filter(e => e.isApproved).map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
              <button className="w-full bg-whitish text-slate font-bold py-3 rounded hover:bg-accent transition-all">
                Create & Assign Task
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}