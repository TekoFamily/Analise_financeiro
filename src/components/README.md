# 📦 Componentes - Guia de Uso

Este diretório contém todos os componentes React Native do aplicativo, organizados por categoria para facilitar manutenção e reutilização.

## 📁 Estrutura de Pastas

```
src/components/
├── base/              # Componentes primitivos reutilizáveis
│   ├── Button.tsx     # Botão estilizado
│   ├── Input.tsx      # Campo de entrada
│   ├── Card.tsx       # Container com elevação/bordas
│   ├── Typography.tsx # Heading, Body, Caption
│   └── index.ts       # Barrel export
│
├── feedback/          # Componentes de feedback visual
│   ├── EmptyState.tsx # Estado vazio (sem dados)
│   ├── Loading.tsx    # Indicador de carregamento
│   └── index.ts       # Barrel export
│
├── domain/            # Componentes específicos do domínio
│   ├── DespesasList.tsx
│   ├── ResumoDoMes.tsx
│   ├── AdicionarGastoForm.tsx
│   ├── UltimosGastos.tsx
│   └── FiltroDespesasButtons.tsx
│
└── *.tsx              # Componentes gerais (ErrorBoundary, ToggleSaldoButton)
```

---

## 🎨 Componentes Base

### Button

Botão reutilizável com variantes solid e outline.

**Props:**
- `title: string` - Texto do botão
- `variant?: "solid" | "outline"` - Estilo (padrão: "solid")
- `isLoading?: boolean` - Mostra spinner de loading
- `onPress?: () => void` - Callback ao clicar
- Aceita todas as props do Button do gluestack-ui

**Referências do theme.ts:**
- `theme.colors.green500` → Cor do botão solid
- `theme.colors.green700` → Cor ao pressionar
- `theme.colors.surface` → Cor do texto no botão solid
- `theme.colors.border` → Cor da borda no outline

**Exemplo:**
```tsx
import { Button } from '@components/base';

// Botão primário
<Button 
  title="Salvar" 
  onPress={() => console.log('Salvando...')} 
/>

// Botão outline
<Button 
  title="Cancelar" 
  variant="outline"
  onPress={handleCancel}
/>

// Botão com loading
<Button 
  title="Carregando..." 
  isLoading={true}
/>
```

---

### Input

Campo de entrada de texto estilizado.

**Props:**
- `rounded?: string` - Border radius customizado
- `placeholder?: string` - Texto placeholder
- Aceita todas as props do InputField do gluestack-ui

**Referências do theme.ts:**
- `theme.colors.surface` → Cor de fundo
- `theme.colors.border` → Cor da borda
- `theme.colors.accent` → Cor da borda ao focar
- `theme.colors.text` → Cor do texto
- `theme.colors.muted` → Cor do placeholder

**Exemplo:**
```tsx
import { Input } from '@components/base';

<Input 
  placeholder="Digite seu e-mail"
  keyboardType="email-address"
  value={email}
  onChangeText={setEmail}
  rounded="$lg"
/>
```

---

### Card

Container com variantes de elevação e borda.

**Props:**
- `variant?: "default" | "elevated" | "outlined"` - Estilo do card
- `children: React.ReactNode` - Conteúdo do card
- `onPress?: () => void` - Torna o card clicável
- `style?: ViewStyle` - Estilos adicionais

**Referências do theme.ts:**
- `theme.colors.surface` → Cor de fundo
- `theme.spacing.md` → Padding interno
- `theme.radii.lg` → Border radius
- `theme.shadow.md` → Sombra (variant="elevated")
- `theme.colors.border` → Cor da borda (variant="outlined")

**Exemplo:**
```tsx
import { Card } from '@components/base';

// Card com elevação
<Card variant="elevated">
  <Text>Conteúdo do card</Text>
</Card>

// Card com borda
<Card variant="outlined">
  <Text>Card com borda</Text>
</Card>

// Card clicável
<Card variant="elevated" onPress={() => navigate('Details')}>
  <Text>Clique aqui</Text>
</Card>
```

---

### Typography (Heading, Body, Caption)

Componentes de tipografia consistentes.

**Props compartilhadas:**
- `size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"` - Tamanho do texto
- `color?: string` - Cor customizada
- `muted?: boolean` - Aplica cor muted (cinza)
- `align?: "left" | "center" | "right" | "justify"` - Alinhamento
- `numberOfLines?: number` - Limita número de linhas
- `children: React.ReactNode` - Conteúdo do texto

**Referências do theme.ts:**
- `theme.fonts.family.bold` → Fonte do Heading
- `theme.fonts.family.regular` → Fonte do Body e Caption
- `theme.fonts.sizes.*` → Tamanhos (xs, sm, md, lg, xl, 2xl)
- `theme.colors.text` → Cor padrão
- `theme.colors.muted` → Cor secundária

**Exemplo:**
```tsx
import { Heading, Body, Caption } from '@components/base';

// Título principal
<Heading size="xl">Bem-vindo!</Heading>

// Texto de corpo
<Body>Este é um parágrafo de texto normal.</Body>

// Texto secundário
<Body muted>Informação complementar em cinza.</Body>

// Legenda pequena
<Caption align="center">Última atualização: 10/01/2025</Caption>
```

---

## 🔔 Componentes de Feedback

### EmptyState

Exibido quando não há dados para mostrar.

**Props:**
- `icon?: string` - Emoji ou ícone (padrão: "📭")
- `title: string` - Título principal
- `description?: string` - Descrição adicional
- `actionLabel?: string` - Texto do botão de ação
- `onAction?: () => void` - Callback do botão

**Referências do theme.ts:**
- `theme.spacing.xl` → Padding vertical
- `theme.colors.text` → Cor do título
- `theme.colors.muted` → Cor da descrição
- `theme.colors.accent` → Cor do botão

**Exemplo:**
```tsx
import { EmptyState } from '@components/feedback';

// Sem ação
<EmptyState
  icon="💰"
  title="Nenhum gasto registrado"
  description="Comece adicionando seu primeiro gasto!"
/>

// Com botão de ação
<EmptyState
  icon="🎯"
  title="Sem metas cadastradas"
  description="Defina metas para melhorar seu controle financeiro"
  actionLabel="Criar Meta"
  onAction={() => navigation.navigate('NewGoal')}
/>
```

---

### Loading

Indicador de carregamento centralizado.

**Props:** Nenhuma (componente simples)

**Referências do theme.ts:**
- `theme.colors.surface` → Cor de fundo (branco)

**Exemplo:**
```tsx
import { Loading } from '@components/feedback';

{isLoading ? <Loading /> : <ContentScreen />}
```

---

## 🧩 Componentes de Domínio

### DespesasList

Lista de despesas com cards estilizados.

**Props:**
- `despesas: Despesa[]` - Array de despesas

**Exemplo:**
```tsx
import { DespesasList } from '@components/domain/DespesasList';

<DespesasList despesas={despesas} />
```

---

### ResumoDoMes

Gráfico de barras com resumo de gastos por categoria.

**Props:** Nenhuma (usa contexto)

**Exemplo:**
```tsx
import { ResumoDoMes } from '@components/domain/ResumoDoMes';

<ResumoDoMes />
```

---

### AdicionarGastoForm

Formulário completo para adicionar novo gasto.

**Props:**
- `categorias: string[]` - Lista de categorias disponíveis
- `onSalvar: (gasto) => void` - Callback ao salvar

**Exemplo:**
```tsx
import { AdicionarGastoForm } from '@components/domain/AdicionarGastoForm';

<AdicionarGastoForm
  categorias={["Mercado", "Lazer", "Transporte"]}
  onSalvar={(dados) => {
    criarDespesa(dados);
    toast.success("Gasto adicionado!");
  }}
/>
```

---

## 🎯 Hooks Disponíveis

### useAppToast

Sistema de notificações toast.

**Métodos:**
- `success(message: string)` - Toast verde de sucesso
- `error(message: string)` - Toast vermelho de erro
- `info(message: string)` - Toast azul informativo
- `warning(message: string)` - Toast laranja de aviso
- `closeAll()` - Fecha todos os toasts

**Exemplo:**
```tsx
import { useAppToast } from '@hooks/useAppToast';

function MyComponent() {
  const toast = useAppToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      toast.success("Dados salvos com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar dados.");
    }
  };
}
```

---

### useResponsive

Design responsivo baseado em breakpoints.

**Retorna:**
- `isSmall, isMedium, isLarge, isExtraLarge` - Breakpoints
- `cardWidth, inputWidth, modalWidth` - Larguras sugeridas
- `columns` - Número de colunas para grids
- `spacing` - Espaçamentos adaptativos
- `fontSize` - Tamanhos de fonte adaptativos
- `buttonHeight, inputHeight, headerHeight` - Alturas
- `isPortrait, isLandscape` - Orientação

**Exemplo:**
```tsx
import { useResponsive } from '@hooks/useResponsive';

function MyComponent() {
  const { cardWidth, isSmall, spacing } = useResponsive();
  
  return (
    <Box width={cardWidth} padding={spacing.md}>
      <Heading size={isSmall ? "md" : "xl"}>Título</Heading>
    </Box>
  );
}
```

---

## 🎨 Usando o Tema

Todos os componentes referenciam `src/config/theme.ts`. Para customizar:

**1. Alterar cores globais:**
```typescript
// src/config/theme.ts
const colors = {
  primary: '#3B82F6',    // Mude para sua cor primária
  accent: '#FF9100',     // Cor de destaque (botões CTA)
  success: '#22C55E',    // Cor de sucesso
  danger: '#EF4444',     // Cor de erro
  // ...
}
```

**2. Usar o tema em componentes customizados:**
```tsx
import { theme } from '@config/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fonts.sizes.xl,
    fontFamily: theme.fonts.family.bold,
  },
});
```

---

## 📚 Melhores Práticas

1. **Sempre use componentes base** ao invés de componentes nativos diretos
2. **Use o tema** para cores, tamanhos e espaçamentos
3. **Prefira barrel exports** para imports mais limpos:
   ```tsx
   // ✅ Bom
   import { Button, Input, Card } from '@components/base';
   
   // ❌ Evitar
   import { Button } from '@components/base/Button';
   import { Input } from '@components/base/Input';
   ```
4. **Documente props customizadas** nos componentes de domínio
5. **Use EmptyState** ao invés de textos genéricos para listas vazias
6. **Prefira toast.success()** ao invés de Alert.alert()
7. **Use useResponsive** para layouts que precisam se adaptar

---

## 🚀 Exemplos Completos

### Tela com Loading, EmptyState e Lista

```tsx
import { EmptyState, Loading } from '@components/feedback';
import { Card, Heading } from '@components/base';
import { DespesasList } from '@components/domain/DespesasList';

function MyScreen() {
  const { despesas, isLoading } = useDespesas();
  
  if (isLoading) return <Loading />;
  
  if (despesas.length === 0) {
    return (
      <EmptyState
        icon="💰"
        title="Nenhum gasto registrado"
        description="Adicione seu primeiro gasto para começar!"
        actionLabel="Adicionar Gasto"
        onAction={() => navigation.navigate('AddExpense')}
      />
    );
  }
  
  return <DespesasList despesas={despesas} />;
}
```

### Formulário com Validação e Toast

```tsx
import { Button, Input, Card, Heading } from '@components/base';
import { useAppToast } from '@hooks/useAppToast';

function MyForm() {
  const toast = useAppToast();
  const [name, setName] = useState('');
  
  const handleSubmit = async () => {
    if (!name) {
      toast.error("Por favor, preencha o nome.");
      return;
    }
    
    try {
      await saveData({ name });
      toast.success("Dados salvos com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar.");
    }
  };
  
  return (
    <Card variant="elevated">
      <Heading>Novo Cadastro</Heading>
      <Input 
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <Button title="Salvar" onPress={handleSubmit} />
    </Card>
  );
}
```

---

## 🔧 Troubleshooting

**Imports não funcionando?**
- Verifique se os paths aliases estão configurados em `tsconfig.json`
- Reinicie o Metro Bundler: `npm start -- --reset-cache`

**Cores não aplicando?**
- Verifique se está importando de `@config/theme`
- Alguns componentes gluestack precisam de `style={}` ao invés de props diretas

**Toasts não aparecem?**
- Certifique-se de que `GluestackUIProvider` está envolvendo sua aplicação

---

## 📝 Changelog

### v2.0.0 (Janeiro 2025)
- ✅ Reorganização completa da estrutura de componentes
- ✅ Criação de componentes base (Card, Typography)
- ✅ Sistema de feedback (EmptyState, Toast)
- ✅ Hooks utilitários (useResponsive, useAppToast)
- ✅ Migração completa para tema centralizado
- ✅ Documentação completa

---

**Dúvidas?** Consulte a documentação do tema em `src/config/theme.ts` ou os exemplos de uso nos comentários de cada componente.