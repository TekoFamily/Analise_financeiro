/**
 * src/components/feedback/EmptyState.tsx
 * 🫙 Componente EmptyState - Estado Vazio
 *
 * Usado quando não há dados para exibir (listas vazias, sem metas, sem gastos, etc.)
 *
 * Props:
 * - icon?: Emoji ou ícone a ser exibido (padrão: "📭")
 * - title: Título principal
 * - description?: Descrição adicional
 * - actionLabel?: Texto do botão de ação
 * - onAction?: Função executada ao clicar no botão
 *
 * Exemplos de uso:
 * <EmptyState
 *   icon="💰"
 *   title="Nenhum gasto registrado"
 *   description="Comece adicionando seu primeiro gasto!"
 * />
 *
 * <EmptyState
 *   icon="🎯"
 *   title="Sem metas cadastradas"
 *   description="Crie sua primeira meta financeira"
 *   actionLabel="Criar Meta"
 *   onAction={() => navigation.navigate('NewGoal')}
 * />
 *
 * Referências no theme.ts:
 * - theme.colors.surface → Cor de fundo do card
 * - theme.spacing.* → Espaçamentos internos
 * - theme.colors.text → Cor do título
 * - theme.colors.muted → Cor da descrição
 * - theme.colors.accent → Cor do botão de ação
 */

import React from "react";
import { VStack, Center } from "@gluestack-ui/themed";
import { Card } from "../base/Card";
import { Heading, Body } from "../base/Typography";
import { Button } from "../base/Button";
import { theme } from "../../config/theme";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card variant="default">
      <Center py={theme.spacing.xl}>
        <VStack space="md" alignItems="center">
          {/* 🎨 Ícone grande */}
          <Heading size="2xl" style={{ fontSize: 64 }}>
            {icon}
          </Heading>

          {/* 📝 Título */}
          <Heading size="lg" align="center">
            {title}
          </Heading>

          {/* 📄 Descrição (opcional) */}
          {description && (
            <Body size="sm" muted align="center" style={{ maxWidth: 280 }}>
              {description}
            </Body>
          )}

          {/* 🔘 Botão de ação (opcional) */}
          {actionLabel && onAction && (
            <Button
              title={actionLabel}
              onPress={onAction}
              style={{ marginTop: theme.spacing.md }}
            />
          )}
        </VStack>
      </Center>
    </Card>
  );
}
