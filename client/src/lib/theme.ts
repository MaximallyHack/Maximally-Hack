export const theme = {
  colors: {
    cream: '#FFFDF7',
    softGray: '#F5F5F7',
    textDark: '#2D2D2D',
    textMuted: '#6C6C6C',
    sky: '#A3D5FF',
    coral: '#FF8C8C',
    yellow: '#FFE680',
    mint: '#A8E6CF',
    success: '#7FD77F',
    error: '#FF6F6F',
  },
  fonts: {
    heading: ['Fredoka', 'Baloo 2', 'cursive'],
    body: ['Inter', 'Nunito', 'sans-serif'],
  },
  shadows: {
    soft: '0 8px 24px rgba(0,0,0,0.06)',
  },
  radius: {
    card: '16px',
    button: '9999px', // pill shape
  },
  animations: {
    hover: 'transform 0.18s ease',
    scale: 'scale(1.03)',
  }
} as const;

export const statusColors = {
  upcoming: 'yellow',
  active: 'success',
  completed: 'sky',
  registration_open: 'mint',
} as const;

export const trackColors = {
  AI: 'sky',
  Healthcare: 'coral',
  Education: 'yellow',
  Climate: 'mint',
  'Social Impact': 'success',
  Blockchain: 'sky',
  Web3: 'coral',
  FinTech: 'yellow',
  Mobile: 'mint',
  'Social Justice': 'coral',
} as const;

export const formatColors = {
  online: 'sky',
  'in-person': 'coral',
  hybrid: 'mint',
} as const;
