import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NoticeBoard from "./Notice/NoticeBoard";
import AssignTask from "./AssignTask";
import Worklist from "./Worklist";
import About from "./About";
import Office from "./Office";
import Hall from "./Hall";
import Department from "./Department";
import AssignCourse from "./AssignCourse";
import Registrar from "./Registrar";
import ViceChancellor from "./ViceChancellor";
import ProViceChancellor from "./ProViceChancellor";
import StaffDetails from "./StaffDetails";
import CSE from "./CSE";
import EEE from "./EEE";
import { WorklistProvider } from "./WorklistContext";
import DescriptionPage from "./DescriptionPage";
import Information from "./Information";
import LoginPage from "./LoginPage";
import ExamController from "./ExamController";

function App() {
  return (
    <WorklistProvider>
      <Router>
        <div>
          <Navbar />
          <Sidebar />
          <Switch>
            <Route path="/" exact component={Information} />
            <Route path="/login" exact component={LoginPage} />

            <Route path="/noticeboard" exact component={NoticeBoard} />
            <Route path="/assigncourse" exact component={AssignCourse} />
            <Route path="/assigntask" exact component={AssignTask} />
            <Route path="/worklist" exact component={Worklist} />
            <Route path="/about" exact component={About} />
            <Route path="/hall" exact component={Hall} />
            <Route path="/office" exact component={Office} />
            <Route path="/office/register" exact component={Registrar} />
            <Route
              path="/office/register/:staffId"
              exact
              component={StaffDetails}
            />
            <Route
              path="/office/examcontroller"
              exact
              component={ExamController}
            />
            <Route
              path="/office/examcontroller/:staffId"
              exact
              component={StaffDetails}
            />
            <Route
              path="/office/vicechancellor"
              exact
              component={ViceChancellor}
            />
            <Route
              path="/office/vicechancellor/:staffId"
              exact
              component={StaffDetails}
            />
            <Route
              path="/office/provicechancellor"
              exact
              component={ProViceChancellor}
            />
            <Route path="/department" exact component={Department} />
            <Route path="/department/cse" exact component={CSE} />
            <Route path="/department/eee" exact component={EEE} />
            <Route
              path="/department/cse/:staffId"
              exact
              component={StaffDetails}
            />
            <Route
              path="/department/eee/:staffId"
              exact
              component={StaffDetails}
            />
            <Route path="/description/:id" component={DescriptionPage} />
          </Switch>
        </div>
      </Router>
    </WorklistProvider>
  );
}

export default App;
