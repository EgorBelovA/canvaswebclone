//header for dashboard with invute buttin, notifications, user photo, and logout button

import { useState } from 'react';

const DashboardHeader = (props: any) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [, setShowInviteModal] = useState(false);
  const [, setShowLogoutModal] = useState(false);
  //   const [notifications, setNotifications] = useState([]);
  const [notificationsLogo, _] = useState(
    '/static/icons/notifications-bell.svg'
  );
  return (
    <div>
      <div className='dashboard-header'>
        <div className='dashboard-header-left'>
          <div className='dashboard-header-logo'>
            <object
              className='logo'
              type='image/svg+xml'
              data='/static/icons/logo_wings.svg'
            />
          </div>
          <div className='dashboard-header-title'>
            <h1>Canvas</h1>
          </div>
        </div>
        <div className='dashboard-header-right'>
          <div className='dashboard-header-notifications'>
            <div
              className='dashboard-header-notifications-icon'
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
            >
              <object
                style={{ width: '20px' }}
                type='image/svg+xml'
                data={notificationsLogo}
              />
            </div>
            <div
              className='dashboard-header-notifications-dropdown'
              style={{
                display: showNotifications ? 'block' : 'none',
              }}
            >
              <div
                className='dashboard-header-notifications-dropdown-item'
                onClick={() => {
                  setShowInviteModal(true);
                }}
              >
                Invite
              </div>
              <div
                className='dashboard-header-notifications-dropdown-item'
                onClick={() => {
                  setShowLogoutModal(true);
                }}
              >
                Logout
              </div>
            </div>
          </div>
          <div className='dashboard-header-user-avatar'>
            <img
              src={props.avatar}
              alt='user'
              className='dashboard-header-user-img'
            />
          </div>
        </div>
      </div>
      {/* <InviteModal
                showInviteModal={showInviteModal}
                setShowInviteModal={setShowInviteModal}
            />
            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
            /> */}
    </div>
  );
};
export default DashboardHeader;
