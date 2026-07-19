import { useState } from "react";
import Stories from "../components/Stories";
import Share from "../components/Share";
import Posts from "../components/Posts";
import Feed from "../components/Feed";
import Reels from "../components/Reels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faPlay, faUser } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [
    { id: "feed", label: "Feed", icon: faThLarge },
    { id: "reels", label: "Reels", icon: faPlay },
    { id: "posts", label: "Posts", icon: faUser },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <Feed />;
      case "reels":
        return <Reels />;
      case "posts":
        return <Posts />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Content Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="text-sm" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stories */}
      <Stories />

      {/* Share Component */}
      <Share />

      {/* Content based on active tab */}
      {renderContent()}
    </div>
  );
};

export default Home;