import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "@/lib/userSlice";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (!user) {
      axios
        .get(`${BASE_URL}/user_details`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.user) {
            dispatch(addUser(res.data.user));
          }
        })
        .catch((err) => {
          console.log("User not authenticated", err);
        });
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/logout`, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-semibold bg-gradient-to-r from-amber-400 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 md:mb-0">
              Mood-Sync
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <div className="relative group">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap  text-gray-500 text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {user.username}
                    </div>
                    <Button
                      variant="ghost"
                      className="cursor-default bg-purple-600 hover:bg-purple-700 rounded-full text-white hover:text-white"
                    >
                      {user.username[0]}
                    </Button>
                  </div>
                <Button variant="outline" onClick={handleLogout} className="bg-green-500 hover:bg-green-600 text-white hover:text-white">
                  Logout
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {user && (
            <>
              <Button variant="ghost" className="w-full text-left cursor-default">
                {user.username}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="w-full text-left">
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
