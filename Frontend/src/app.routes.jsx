import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MockSimulator from "./features/interview/pages/MockSimulator";
import MockResult from "./features/interview/pages/MockResult";
import PracticePage from "./features/practice/pages/PracticePage";
import PracticeResultPage from "./features/practice/pages/PracticeResultPage";



export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>

  },
  {
    path: "/mock-interview",
    element:
    <Protected>
        <MockSimulator />
    </Protected>
  },
  {
    path: "/mock-result/:resultId",
    element:
    <Protected>
        <MockResult />
    </Protected>
  },
  {
    path: "/practice",
    element:
    <Protected>
        <PracticePage />
    </Protected>
  },
  {
    path: "/practice-result/:sessionId",
    element:
    <Protected>
        <PracticeResultPage />
    </Protected>
  }


])