import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from '@mui/material/Divider';
import DoneIcon from '@mui/icons-material/Done';
import { Avatar, ListItemIcon, Modal, TextField, Typography, Box, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import CustomeLink from "./CustomeLink";
import SidebarOptions from "./SidebarOptions";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import './Sidebar.css';

function Sidebar({ handleLogout, user }) {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const openLanguageMenu = Boolean(languageAnchorEl);
  const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const getUserInfo = async (email) => {
      try {
        const response = await fetch(`http://localhost:5000/loggedInUser?email=${email}`);
        const result = await response.json();
        const user = result[0]; // Assuming the response is an array with one user object
        console.log('User info:', user);
        console.log('Language preference:', user.language);
        i18n.changeLanguage(user.language);
      } catch (error) {
        console.error('Error retrieving user info:', error);
      }
    };

    if (user && user[0].email) {
      getUserInfo(user[0].email);
    }
  }, [user]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageClick = (e) => {
    setLanguageAnchorEl(e.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const updateLanguagePreference = async (email, language) => {
    try {
      const response = await fetch('http://localhost:5000/updateLanguage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, language }),
      });
  
      const result = await response.json();
      console.log('Language preference updated:', result);
    } catch (error) {
      console.error('Error updating language preference:', error);
    }
  };

  const sendOtp = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setOtpModalOpen(true);
      } else {
        console.error('Error sending OTP:', result.error);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user[0]?.email, otp }),
      });

      const result = await response.json();
      if (response.ok) {
        updateLanguagePreference(user[0]?.email, selectedLanguage);
        setOtpModalOpen(false);
      } else {
        setOtpError(result.error);
      }
    } catch (error) {
      setOtpError('Error verifying OTP');
      console.error('Error verifying OTP:', error);
    }
  };

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    sendOtp(user[0]?.email);
    handleLanguageClose();
  };

  const result = user?.email?.split('@')[0];

  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />
      <CustomeLink to='/home/feed'>
        <SidebarOptions active Icon={HomeIcon} text={t('home')} />
      </CustomeLink>
      <CustomeLink to='/home/explore'>
        <SidebarOptions Icon={SearchIcon} text={t('explore')} />
      </CustomeLink>
      <CustomeLink to='/home/notifications'>
        <SidebarOptions Icon={NotificationsNoneIcon} text={t('notifications')} />
      </CustomeLink>
      <CustomeLink to='/home/messages'>
        <SidebarOptions Icon={MailOutlineIcon} text={t('messages')} />
      </CustomeLink>
      <CustomeLink to='/home/bookmarks'>
        <SidebarOptions Icon={BookmarkBorderIcon} text={t('bookmarks')} />
      </CustomeLink>
      <CustomeLink to='/home/lists'>
        <SidebarOptions Icon={ListAltIcon} text={t('lists')} />
      </CustomeLink>
      <CustomeLink to='/home/profile'>
        <SidebarOptions Icon={PermIdentityIcon} text={t('profile')} />
      </CustomeLink>
      <CustomeLink to='/home/more'>
        <SidebarOptions Icon={MoreIcon} text={t('more')} />
      </CustomeLink>
      <Button variant="outlined" className="sidebar__tweet" fullWidth>
        {t('tweet')}
      </Button>
      <div className="Profile__info">
        <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
        <div className="user__info">
          <h4>
            {loggedInUser[0]?.name ? loggedInUser[0].name : user && user.displayName}
          </h4>
          <h5>@{result}</h5>
        </div>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
        >
          <MenuItem className="Profile__info1" onClick={() => navigate('/home/profile')}>
            <Avatar src={loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"} />
            <div className="user__info subUser__info">
              <div>
                <h4>
                  {loggedInUser[0]?.name ? loggedInUser[0].name : user && user.displayName}
                </h4>
                <h5>@{result}</h5>
              </div>
              <ListItemIcon className="done__icon" color="blue"><DoneIcon /></ListItemIcon>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLanguageClick}>
            {t('change_language')}
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            {t('logout')} @{result}
          </MenuItem>
        </Menu>
        <Menu
          id="language-menu"
          anchorEl={languageAnchorEl}
          open={openLanguageMenu}
          onClose={handleLanguageClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            English {i18n.language === 'en' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('fr')}>
            Français {i18n.language === 'fr' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('hi')}>
            हिंदी {i18n.language === 'hi' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('es')}>
            Español {i18n.language === 'es' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('ta')}>
            தமிழ் {i18n.language === 'ta' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('te')}>
            తెలుగు {i18n.language === 'te' && <DoneIcon fontSize="small" />}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('bn')}>
            বাংলা {i18n.language === 'bn' && <DoneIcon fontSize="small" />}
          </MenuItem>
        </Menu>
      </div>

      {/* OTP Modal */}
      <Modal
        open={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        aria-labelledby="otp-modal-title"
        aria-describedby="otp-modal-description"
      >
        <Box className="otp-modal-box">
          <Typography id="otp-modal-title" variant="h6" component="h2">
            {t('enter_otp')}
          </Typography>
          <TextField
            id="otp-input"
            label={t('otp')}
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          {otpError && <Typography color="error">{otpError}</Typography>}
          <Button onClick={verifyOtp} variant="contained" color="primary" fullWidth>
            {t('verify')}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Sidebar;
