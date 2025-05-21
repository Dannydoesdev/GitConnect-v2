import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

type NotificationType = 'loading' | 'success' | 'error' | 'info';

interface NotificationOptions {
  id?: string;
  title: string;
  message: string;
  type?: NotificationType;
  autoClose?: number | false;
  icon?: ReactNode;
}

interface TypeConfig {
  loading: boolean;
  color: string;
  autoClose: boolean | number;
  icon?: ReactNode;
}

// Create icon constants
const SUCCESS_ICON = <IconCheck size={24} />;
const ERROR_ICON = <IconX size={24} />;

const typeConfig: Record<NotificationType, TypeConfig> = {
  loading: {
    loading: true,
    color: 'cyan',
    autoClose: false,
  },
  success: {
    loading: false,
    color: 'teal',
    autoClose: 5000,
    icon: SUCCESS_ICON,
  },
  error: {
    loading: false,
    color: 'red',
    autoClose: 5000,
    icon: ERROR_ICON,
  },
  info: {
    loading: false,
    color: 'blue',
    autoClose: 5000,
  },
};

export const showNotification = ({
  id,
  title,
  message,
  type = 'info',
  autoClose = 5000,
  icon,
}: NotificationOptions) => {
  const baseConfig = {
    id,
    title,
    message,
    autoClose,
  };

  return notifications.show({
    ...baseConfig,
    ...typeConfig[type],
    icon: icon || typeConfig[type].icon,
  });
};

export const updateNotification = ({
  id,
  title,
  message,
  type = 'info',
  autoClose = 5000,
  icon,
}: NotificationOptions) => {
  if (!id) return;
  
  const baseConfig = {
    id,
    title,
    message,
    autoClose,
  };

  return notifications.update({
    ...baseConfig,
    ...typeConfig[type],
    icon: icon || typeConfig[type].icon,
  });
};

// Common notification patterns
export const quickstartNotifications = {
  fetchingGithub: (username: string) => 
    showNotification({
      id: 'fetch-github',
      title: 'Fetching GitHub Data',
      message: `Looking for ${username}...`,
      type: 'loading',
    }),

  githubFetched: () =>
    updateNotification({
      id: 'fetch-github',
      title: 'Github Profile Fetched',
      message: 'Please select repositories.',
      type: 'success',
      autoClose: 3000,
    }),

  githubNotFound: (username: string) =>
    updateNotification({
      id: 'fetch-github',
      title: 'Not Found',
      message: `GitHub user "${username}" not found or has no public repositories.`,
      type: 'error',
      autoClose: 5000,
    }),

  buildingPortfolio: () =>
    showNotification({
      id: 'portfolio-build',
      title: 'Building Portfolio',
      message: 'Preparing your projects...',
      type: 'loading',
    }),

  savingProgress: (current: number, total: number) =>
    updateNotification({
      id: 'portfolio-build',
      title: 'Saving Progress',
      message: `Saving project ${current} of ${total}...`,
      type: 'loading',
    }),

  redirecting: () =>
    updateNotification({
      id: 'portfolio-build',
      title: 'Redirecting...',
      message: 'Loading your new portfolio page',
      type: 'loading',

    }),
}; 