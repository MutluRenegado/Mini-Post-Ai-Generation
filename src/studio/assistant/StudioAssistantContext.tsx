'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type StudioNotificationType = 'info' | 'success' | 'warning' | 'error' | 'progress';
export type AssistantView = 'wizard' | 'notifications';

export interface StudioNotification {
  id: string;
  type: StudioNotificationType;
  title: string;
  message: string;
  source?: string;
  createdAt: number;
  isRead: boolean;
  progress?: number;
  actionLabel?: string;
  actionRoute?: string;
}

export interface StudioAssistantContextValue {
  isOpen: boolean;
  activeAssistantView: AssistantView;
  notifications: StudioNotification[];
  unreadCount: number;
  generationProgress: number | null;
  openAssistant: (view?: AssistantView) => void;
  closeAssistant: () => void;
  toggleAssistant: (view?: AssistantView) => void;
  setActiveAssistantView: (view: AssistantView) => void;
  addNotification: (
    notification: Omit<StudioNotification, 'id' | 'createdAt' | 'isRead'> & {
      id?: string;
      createdAt?: number;
      isRead?: boolean;
    }
  ) => string;
  updateNotification: (id: string, updates: Partial<StudioNotification>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id?: string) => void;
  markAllAsRead: () => void;
  setGenerationProgress: (progress: number | null) => void;
}

const STORAGE_KEY_NOTIFS = 'minipost_studio_notifications_v1';

const StudioAssistantContext = createContext<StudioAssistantContextValue | null>(null);

export function StudioAssistantProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAssistantView, setActiveAssistantView] = useState<AssistantView>('wizard');
  const [generationProgress, setGenerationProgressState] = useState<number | null>(null);

  const [notifications, setNotifications] = useState<StudioNotification[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse saved studio notifications', e);
    }
    return [
      {
        id: 'initial_sys_welcome',
        type: 'info',
        title: 'Studio Assistant Active',
        message: 'AI Creator Wizard & Studio Notification engine initialized and monitoring.',
        source: 'System',
        createdAt: Date.now(),
        isRead: false,
      },
    ];
  });

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
      } catch (e) {
        console.warn('Failed to save studio notifications', e);
      }
    }
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const openAssistant = useCallback((view?: AssistantView) => {
    if (view) {
      setActiveAssistantView(view);
    }
    setIsOpen(true);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback((view?: AssistantView) => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        // If opening deliberately without specifying view, default to wizard
        setActiveAssistantView(view || 'wizard');
      }
      return nextState;
    });
  }, []);

  const addNotification = useCallback(
    (
      notification: Omit<StudioNotification, 'id' | 'createdAt' | 'isRead'> & {
        id?: string;
        createdAt?: number;
        isRead?: boolean;
      }
    ): string => {
      const id = notification.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      const newNotif: StudioNotification = {
        ...notification,
        id,
        createdAt: notification.createdAt || Date.now(),
        isRead: notification.isRead ?? false,
      };

      setNotifications((prev) => {
        // If updating an existing notification with same id, replace it
        const existsIndex = prev.findIndex((n) => n.id === id);
        if (existsIndex >= 0) {
          const updated = [...prev];
          updated[existsIndex] = newNotif;
          return updated;
        }
        return [newNotif, ...prev];
      });

      if (notification.type === 'progress' && notification.progress !== undefined) {
        setGenerationProgressState(notification.progress);
      }

      return id;
    },
    []
  );

  const updateNotification = useCallback((id: string, updates: Partial<StudioNotification>) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, ...updates };
          if (updated.type === 'progress' && updated.progress !== undefined) {
            setGenerationProgressState(updated.progress);
          }
          return updated;
        }
        return n;
      })
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setGenerationProgressState(null);
  }, []);

  const markAsRead = useCallback((id?: string) => {
    if (!id) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } else {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const setGenerationProgress = useCallback((progress: number | null) => {
    setGenerationProgressState(progress);
  }, []);

  const contextValue = useMemo(
    () => ({
      isOpen,
      activeAssistantView,
      notifications,
      unreadCount,
      generationProgress,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      setActiveAssistantView,
      addNotification,
      updateNotification,
      removeNotification,
      clearNotifications,
      markAsRead,
      markAllAsRead,
      setGenerationProgress,
    }),
    [
      isOpen,
      activeAssistantView,
      notifications,
      unreadCount,
      generationProgress,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      setActiveAssistantView,
      addNotification,
      updateNotification,
      removeNotification,
      clearNotifications,
      markAsRead,
      markAllAsRead,
      setGenerationProgress,
    ]
  );

  return (
    <StudioAssistantContext.Provider value={contextValue}>
      {children}
    </StudioAssistantContext.Provider>
  );
}

export function useStudioAssistant() {
  const ctx = useContext(StudioAssistantContext);
  if (!ctx) {
    throw new Error('useStudioAssistant must be used within a StudioAssistantProvider');
  }
  return ctx;
}
