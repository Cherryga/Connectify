// import Friends from "../assets/icons/1.png";
// import Groups from "../assets/icons/2.png";
// import Market from "../assets/icons/3.png";
// import Watch from "../assets/icons/4.png";
// import Memories from "../assets/icons/5.png";
// import Events from "../assets/icons/6.png";
// import Gaming from "../assets/icons/7.png";
// import Gallery from "../assets/icons/8.png";
// import Videos from "../assets/icons/9.png";
// import Messages from "../assets/icons/10.png";
// import Tutorials from "../assets/icons/11.png";
// import Courses from "../assets/icons/12.png";
// import Fund from "../assets/icons/13.png";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { Link } from "react-router-dom";

// const Leftbar = () => {

//   const { currentUser } = useContext(AuthContext);

//   return (
//     <div id="responsive" className="sticky top-0 z-30">
//       <div  className="drawer lg:drawer-open">
//         <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content flex flex-col items-center justify-center">
//           <label
//             htmlFor="my-drawer-2"
//             className="btn btn-primary drawer-button lg:hidden"
//           >
//             Open drawer
//           </label>
//         </div>
//         <div  className="drawer-side" >
//           <label
//             htmlFor="my-drawer-2"
//             aria-label="close sidebar"
//             className="drawer-overlay"
//           ></label>
//           <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            
            
//             <Link
//                   to={`/profile/${currentUser.id}`}
//                   style={{ textDecoration: "none", color: "inherit" }}
//                 >

            
//             <div className="w-10 mb-3 avatar">
//               <img
//                 alt=""
//                 className="rounded-full"
//                 src={currentUser.profilePic ? `http://localhost:5173/uploads/posts/${currentUser.profilePic}` : "http://localhost:5173/default/default_profile.png"}
//                 />
//               <li>
//                 <span>{currentUser.username}</span>
//               </li>
//             </div>
//                 </Link>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Friends} />
//               <li>
//                 <span>Friends</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Groups} />
//               <li>
//                 <span>Groups</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Market} />
//               <li>
//                 <span>Marketplace</span>
//               </li>
//             </div>

//             <div className="divider"></div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Watch} />
//               <li>
//                 <span>Watch</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Memories} />
//               <li>
//                 <span>Memories</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Events} />
//               <li>
//                 <span>Evenets</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Gaming} />
//               <li>
//                 <span>Gaming</span>
//               </li>
//             </div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Gallery} />
//               <li>
//                 <span>Gallery</span>
//               </li>
//             </div>

//             <div className="divider"></div>

//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Videos} />
//               <li>
//                 <span>Videos</span>
//               </li>
//             </div>
//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Messages} />
//               <li>
//                 <span>Messages</span>
//               </li>
//             </div>
//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Fund} />
//               <li>
//                 <span>Fundraiser</span>
//               </li>
//             </div>
//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Tutorials} />
//               <li>
//                 <span>Tutorials</span>
//               </li>
//             </div>
//             <div className="w-10 mb-3 avatar">
//               <img alt="" className="rounded-full" src={Courses} />
//               <li>
//                 <span>Courses</span>
//               </li>
//             </div>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Leftbar;


import Friends from "../assets/icons/1.png";
import Groups from "../assets/icons/2.png";
import Market from "../assets/icons/3.png";
import Watch from "../assets/icons/4.png";
import Memories from "../assets/icons/5.png";
import Events from "../assets/icons/6.png";
import Gaming from "../assets/icons/7.png";
import Gallery from "../assets/icons/8.png";
import Videos from "../assets/icons/9.png";
import Messages from "../assets/icons/10.png";
import Tutorials from "../assets/icons/11.png";
import Courses from "../assets/icons/12.png";
import Fund from "../assets/icons/13.png";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Leftbar = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { icon: Friends, label: "Friends", path: "/friends" },
    { icon: Groups, label: "Groups", path: "/groups" },
    { icon: Market, label: "Marketplace", path: "/marketplace" },
    { icon: Watch, label: "Watch", path: "/watch" },
    { icon: Memories, label: "Memories", path: "/memories" },
    { icon: Events, label: "Events", path: "/events" },
    { icon: Gaming, label: "Gaming", path: "/gaming" },
    { icon: Gallery, label: "Gallery", path: "/gallery" },
    { icon: Videos, label: "Videos", path: "/videos" },
    { icon: Messages, label: "Messages", path: "/messages" },
    { icon: Fund, label: "Fundraiser", path: "/fundraiser" },
    { icon: Tutorials, label: "Tutorials", path: "/tutorials" },
    { icon: Courses, label: "Courses", path: "/courses" },
  ];

  return (
    <div className="sticky top-0 z-30 h-screen">
      <div className="drawer lg:drawer-open">
        <input id="leftbar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-start pt-4">
          <label
            htmlFor="leftbar-drawer"
            className="btn btn-ghost drawer-button lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="leftbar-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Profile Link */}
            <li className="mb-4">
              <Link
                to={`/profile/${currentUser.id}`}
                className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 ${
                  location.pathname === `/profile/${currentUser.id}`
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
              >
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Profile"
                      src={
                        currentUser.profilePic
                          ? `http://localhost:5173/uploads/posts/${currentUser.profilePic}`
                          : "http://localhost:5173/default/default_profile.png"
                      }
                    />
                  </div>
                </div>
                <span>{currentUser.username}</span>
              </Link>
            </li>

            <div className="divider my-2"></div>

            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 ${
                    location.pathname === item.path
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-6 h-6 object-contain"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;