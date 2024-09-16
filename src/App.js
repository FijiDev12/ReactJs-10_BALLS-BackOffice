import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './UserContext';
import {  useState, useEffect, lazy } from 'react';

const Login = lazy(() => import("./pages/Login"))
const LoginCashiers = lazy(() => import("./pages/LoginCashiers"))
const LoginAgents = lazy(() => import("./pages/LoginAgents"))
const GameInfo = lazy(() => import("./pages/GameInfo"))
const SystemAdminPage = lazy(() => import("./pages/SystemAdminPage"))
const TableOne = lazy(() => import("./pages/TableOne"))
const TableOneHistory = lazy(() => import("./pages/TableOneHistory"))
const GameHistoryForOP = lazy(() => import("./pages/GameHistoryForOP"))
const UserListings = lazy(() => import("./pages/UserListings"))
const TestSomething = lazy(() => import("./pages/TestSomething"))
const CashierManagement = lazy(() => import("./pages/CashierManagement"))
const CashierList = lazy(() => import("./pages/CashierList"))
const CashierListForOP = lazy(() => import("./pages/CashierListForOP"))
const AgentList = lazy(() => import("./pages/AgentList"))
const AgentListForOP = lazy(() => import("./pages/AgentListForOP"))
const PlayerList = lazy(() => import("./pages/PlayerList"))
const PlayerListForOP = lazy(() => import("./pages/PlayerListForOP"))
const CashReports = lazy(() => import("./pages/CashReports"))
const CashReportsForOP = lazy(() => import("./pages/CashReportsForOP"))
const MasterAgentPage = lazy(() => import("./pages/MasterAgentPage"))
const CommissionOfAgents = lazy(() => import("./pages/CommissionOfAgents"))
const SubAgentListing = lazy(() => import("./pages/SubAgentListing"))
const Signout = lazy(() => import("./pages/Signout"))
const LogOut = lazy(() => import("./pages/LogOut"))

function App() {

  const [user, setUser] = useState({
    RoleIdx: sessionStorage.getItem("role"),
  })


  const unsetUser = () => {
  sessionStorage.clear();
  }

  return (
    <UserProvider value={{user, setUser, unsetUser}}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/login/cashier" element={<LoginCashiers/>}/>
            <Route path="/login/agent" element={<LoginAgents/>}/>
            <Route path="/gameInfo" element={<GameInfo/>}/>
            <Route path="/systemAdminpage" element={<SystemAdminPage/>}/>
            <Route path="/gameTableOne" element={<TableOne/>}/>
            <Route path="/historyTableOne" element={<TableOneHistory/>}/>
            <Route path="/OPhistorytable" element={<GameHistoryForOP/>}/>
            <Route path="/admin-Users" element={<UserListings/>}/>
            <Route path="/cashierManagement" element={<CashierManagement/>}/>
            <Route path="/user/cashier" element={<CashierList/>}/>
            <Route path="/user/cashierOP" element={<CashierListForOP/>}/>
            <Route path="/user/agent" element={<AgentList/>}/>
            <Route path="/user/agentOP" element={<AgentListForOP/>}/>
            <Route path="/user/player" element={<PlayerList/>}/>
            <Route path="/user/playerOP" element={<PlayerListForOP/>}/>
            <Route path="/transcReports" element={<CashReports/>}/>
            <Route path="/transcReportsOP" element={<CashReportsForOP/>}/>
            <Route path="/agentspage" element={<MasterAgentPage/>}/>
            <Route path="/commissions" element={<CommissionOfAgents/>}/>
            <Route path="/user/subAgentList" element={<SubAgentListing/>}/>
            <Route path="/sign-out" element={<Signout />} />
            <Route path="/log-out" element={<LogOut />} />
            <Route path="/test" element={<TestSomething/>}/>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
