import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./studyGroups.scss";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import MailIcon from "@mui/icons-material/Mail";
import CreateGroupModal from "../../components/modals/CreateGroupModal";
import { studyGroupService } from "../../services/studyGroupService";
import { useDebounce } from "../../hooks/useDebounce";

const StudyGroups = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(null);
  
  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch groups based on active tab
  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", activeTab, searchQuery, filter],
    queryFn: () => {
      if (searchQuery) {
        return studyGroupService.searchGroups(searchQuery, filter);
      }
      switch (activeTab) {
        case "discover":
          return studyGroupService.getDiscoverableGroups();
        case "my-groups":
          return studyGroupService.getMyGroups();
        case "invites":
          return studyGroupService.getInvites();
        default:
          return studyGroupService.getDiscoverableGroups();
      }
    },
  });

  // Create group mutation
  const createGroupMutation = useMutation({
    mutationFn: (groupData) => studyGroupService.createGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setShowCreateModal(false);
    },
  });

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: (groupId) => studyGroupService.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  // Leave group mutation
  const leaveGroupMutation = useMutation({
    mutationFn: (groupId) => studyGroupService.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  // Handle invite mutation
  const handleInviteMutation = useMutation({
    mutationFn: ({ inviteId, status }) => studyGroupService.handleInvite(inviteId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });

  const handleCreateGroup = (groupData) => {
    createGroupMutation.mutate(groupData);
  };

  const handleJoinGroup = (groupId) => {
    joinGroupMutation.mutate(groupId);
  };

  const handleLeaveGroup = (groupId) => {
    leaveGroupMutation.mutate(groupId);
  };

  const handleInviteResponse = (inviteId, status) => {
    handleInviteMutation.mutate({ inviteId, status });
  };

  return (
    <div className="studyGroups">
      <div className="header">
        <h1>Study Groups</h1>
        <button className="createBtn" onClick={() => setShowCreateModal(true)}>
          <span>Create Group</span>
        </button>
      </div>

      <div className="searchAndFilter">
        <div className="search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter">
          <FilterListIcon />
          <select value={filter || ""} onChange={(e) => setFilter(e.target.value || null)}>
            <option value="">All Groups</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </div>
        <div
          className={`tab ${activeTab === "my-groups" ? "active" : ""}`}
          onClick={() => setActiveTab("my-groups")}
        >
          My Groups
        </div>
        <div
          className={`tab ${activeTab === "invites" ? "active" : ""}`}
          onClick={() => setActiveTab("invites")}
        >
          Invites
        </div>
      </div>

      <div className="groupsList">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : groups?.length === 0 ? (
          <div className="noGroups">No groups found</div>
        ) : (
          groups?.map((group) => (
            <div key={group.id} className="groupCard">
              <div className="groupInfo">
                <img src={group.image || "/default-group.png"} alt="" className="groupImg" />
                <div className="details">
                  <h3>{group.name}</h3>
                  <p>{group.description}</p>
                  <div className="meta">
                    <span>
                      <GroupIcon /> {group.member_count} members
                    </span>
                    <span>
                      {group.type === "private" ? <LockIcon /> : <PublicIcon />}{" "}
                      {group.type}
                    </span>
                  </div>
                </div>
              </div>
              <div className="actions">
                {activeTab === "discover" && !group.is_member && (
                  <button
                    className="joinBtn"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    Join Group
                  </button>
                )}
                {activeTab === "my-groups" && (
                  <button
                    className="leaveBtn"
                    onClick={() => handleLeaveGroup(group.id)}
                  >
                    Leave Group
                  </button>
                )}
                {activeTab === "invites" && (
                  <div className="inviteActions">
                    <button
                      className="acceptBtn"
                      onClick={() => handleInviteResponse(group.id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="rejectBtn"
                      onClick={() => handleInviteResponse(group.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
};

export default StudyGroups; 