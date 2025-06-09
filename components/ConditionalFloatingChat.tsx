'use client';

import { useAuth } from '@/hooks/useAuth';
import FloatingChat from './FloatingChat';

export function ConditionalFloatingChat() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // No renderizar mientras está cargando
  if (isLoading) {
    return null;
  }
  
  // Solo renderizar si está autenticado
  return isAuthenticated ? <FloatingChat /> : null;
}