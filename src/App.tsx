import { useState } from 'react';
import { Chat } from './components/Chat';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box, 
  IconButton, 
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Search as SearchIcon,
  Chat as ChatIcon,
  Explore as ExploreIcon,
  Collections as CollectionsIcon,
  Add as AddIcon,
} from '@mui/icons-material';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7B66FF',
        light: '#9D8DFF',
        dark: '#5B3FFF',
      },
      secondary: {
        main: '#F5F5FF',
        light: '#FFFFFF',
        dark: '#EEEEFF',
      },
      background: {
        default: darkMode ? '#1A1A1A' : '#FFFFFF',
        paper: darkMode ? '#2D2D2D' : '#FFFFFF',
      },
      text: {
        primary: darkMode ? '#FFFFFF' : '#1A1A1A',
        secondary: darkMode ? '#A0A0A0' : '#666666',
      },
    },
    typography: {
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '4px 8px',
            padding: '10px 16px',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('dark_mode', JSON.stringify(!darkMode));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          bgcolor: 'background.default',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            bgcolor: theme => theme.palette.mode === 'dark' ? '#2D2D2D' : '#F5F5FF',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo area */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{
                width: 32,
                height: 32,
              }}
            />
            <Box
              sx={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              AI Chat
            </Box>
          </Box>

          {/* New chat button */}
          <Box sx={{ p: 2 }}>
            <ListItemButton
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="新建对话" />
            </ListItemButton>
          </Box>

          {/* Navigation */}
          <List sx={{ flex: 1 }}>
            <ListItemButton selected>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="对话" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="发现" />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <CollectionsIcon />
              </ListItemIcon>
              <ListItemText primary="我保存的" />
            </ListItemButton>
          </List>

          {/* Bottom actions */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <ListItemButton onClick={toggleDarkMode}>
              <ListItemIcon>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </ListItemIcon>
              <ListItemText primary={darkMode ? "浅色模式" : "深色模式"} />
            </ListItemButton>
          </Box>
        </Box>

        {/* Main content */}
        <Box 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 0,
          }}
        >
          {/* Search bar */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              width: '100%',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="搜索..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#F5F5FF',
                  '&:hover': {
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#EEEEFF',
                  },
                }
              }}
            />
          </Box>

          {/* Chat area */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Chat />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;