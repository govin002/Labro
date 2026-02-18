
import Leftsidebar from './Leftsidebar';
import { Outlet } from "react-router-dom";

const Home = () => {

  return (
    <div className='flex w-full h-screen bg-slate-50 overflow-hidden'>
      <Leftsidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
