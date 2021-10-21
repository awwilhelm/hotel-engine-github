// router
import { BrowserRouter as Router} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import '../css/main.css'
import 'react-toastify/dist/ReactToastify.css';
import 'react-dropdown/style.css';

// components

const Layout = ({ children }) => {
  return (
    <Router>
      <main>{children}</main>

      <ToastContainer />  
    </Router>
  )
}

export default Layout
