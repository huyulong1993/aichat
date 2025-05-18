import { Box, Avatar, Typography, Paper, TextField, CircularProgress, IconButton } from '@mui/material';
import { Person as UserIcon, SmartToy as BotIcon, Send as SendIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '@mui/material/styles';
import { useState, useRef } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  format: 'text' | 'markdown';
}

export const Chat: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: Date.now(),
      format: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: Date.now(),
        format: 'markdown',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(input);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme => theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
            borderRadius: 3,
          },
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              color: 'text.secondary',
              p: 3,
              width: '100%',
            }}
          >
            <BotIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              开始新的对话
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              我是通义，你的实用AI助手
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            width: '100%',
          }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: message.isUser ? 'row-reverse' : 'row',
                  gap: 2,
                  maxWidth: '80%',
                  width: '100%',
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                  opacity: 0,
                  animation: 'fadeSlideIn 0.3s ease forwards',
                  '@keyframes fadeSlideIn': {
                    from: {
                      opacity: 0,
                      transform: message.isUser 
                        ? 'translateX(20px)' 
                        : 'translateX(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: message.isUser ? 'primary.main' : '#F5F5FF',
                    color: message.isUser ? 'white' : 'primary.main',
                  }}
                >
                  {message.isUser ? <UserIcon /> : <BotIcon />}
                </Avatar>
                <Box sx={{ flex: 1, maxWidth: 'calc(100% - 48px)' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: message.isUser 
                        ? 'primary.main'
                        : theme => theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : '#F5F5FF',
                      color: message.isUser ? 'white' : 'text.primary',
                      borderRadius: 2,
                      width: 'fit-content',
                      maxWidth: '100%',
                      '& pre': {
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: theme => theme.palette.mode === 'dark'
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(0, 0, 0, 0.04)',
                        overflowX: 'auto',
                        maxWidth: '100%',
                      },
                      '& code': {
                        p: 0.5,
                        borderRadius: 0.5,
                        bgcolor: theme => theme.palette.mode === 'dark'
                          ? 'rgba(0, 0, 0, 0.2)'
                          : 'rgba(0, 0, 0, 0.04)',
                        color: message.isUser ? 'inherit' : 'primary.main',
                      },
                    }}
                  >
                    {message.format === 'markdown' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({node, ...props}) => (
                            <a
                              {...props}
                              style={{
                                color: message.isUser ? '#fff' : theme.palette.primary.main,
                                textDecoration: 'none',
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.content}
                      </Typography>
                    )}
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      color: 'text.secondary',
                      textAlign: message.isUser ? 'right' : 'left',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  alignSelf: 'flex-start',
                  opacity: 0,
                  animation: 'fadeIn 0.3s ease forwards',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#F5F5FF',
                    color: 'primary.main',
                  }}
                >
                  <BotIcon />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : '#F5F5FF',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      正在思考...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          p: 3,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '100%',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息，按Enter发送，Shift+Enter换行..."
            variant="outlined"
            size="medium"
            disabled={isLoading}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: theme => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : '#F5F5FF',
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : '#EEEEFF',
                },
                '&.Mui-focused': {
                  bgcolor: theme => theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#EEEEFF',
                },
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            sx={{
              alignSelf: 'flex-end',
              p: 1,
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};