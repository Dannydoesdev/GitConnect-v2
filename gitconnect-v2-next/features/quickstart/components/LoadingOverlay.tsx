import React from 'react';
import { LoadingOverlay as MantineLoadingOverlay, Text } from '@mantine/core';

interface LoadingOverlayProps {
  message?: string;
  visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message, visible }) => {
  return (
      <MantineLoadingOverlay
        visible={visible}
        overlayBlur={2}
        loaderProps={{ children: message ? <Text>{message}</Text> : undefined }}
      />
  );
};