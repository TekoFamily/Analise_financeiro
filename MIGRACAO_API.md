# 🔄 Migração para API - Guia de Implementação

## ✅ O que foi implementado no App Mobile

### 1. **Serviços de API Criados**

#### `src/services/api.ts`
- Classe `ApiService` centralizada para fazer requisições HTTP
- Adiciona automaticamente o token JWT no header `Authorization: Bearer {token}`
- Trata erros de autenticação (401/403) limpando o token automaticamente
- Base URL configurável em `src/config/api.ts`

#### `src/services/despesasService.ts`
- `getAll()` - Busca todas as despesas do usuário logado
- `create(despesa)` - Cria nova despesa
- `update(id, despesa)` - Atualiza despesa existente
- `delete(id)` - Deleta despesa
- `getByPeriod(mes, ano)` - Busca despesas por período

#### `src/services/metasService.ts`
- `getAll()` - Busca todas as metas do usuário logado
- `create(meta)` - Cria nova meta
- `update(id, meta)` - Atualiza meta existente
- `delete(id)` - Deleta meta
- `addValue(id, valor)` - Adiciona valor à meta

#### `src/services/userService.ts`
- `getRenda()` - Busca renda mensal do usuário logado
- `updateRenda(renda)` - Atualiza renda mensal do usuário

### 2. **Contextos Modificados**

#### `AuthContext.tsx`
- ✅ Agora expõe `token` e `userId` no contexto
- ✅ Mantém compatibilidade com código existente

#### `ExpensesContext.tsx`
- ✅ **REMOVIDO**: Uso de `AsyncStorage` para despesas e renda
- ✅ **ADICIONADO**: Chamadas à API usando `despesasService` e `userService`
- ✅ Carrega dados automaticamente quando usuário faz login
- ✅ Converte datas entre formato brasileiro (DD/MM/YYYY) e ISO (YYYY-MM-DD)
- ✅ Adiciona estados `isLoading` e `error` para feedback ao usuário
- ✅ Funções agora são `async` e retornam `Promise`

#### `MetasContext.tsx`
- ✅ **REMOVIDO**: Uso de `AsyncStorage` para metas
- ✅ **ADICIONADO**: Chamadas à API usando `metasService`
- ✅ Carrega dados automaticamente quando usuário faz login
- ✅ Converte datas de string ISO para objetos `Date`
- ✅ Adiciona estados `isLoading` e `error` para feedback ao usuário

## 🔧 O que precisa ser implementado no Backend

### 1. **Middleware de Autenticação JWT**

Crie um middleware para validar o token JWT nas rotas protegidas:

```javascript
// src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Adiciona userId ao request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};
```

### 2. **Endpoints de Despesas**

```javascript
// src/routers/despesas.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../database/index.js';

const router = Router();

// Todas as rotas precisam de autenticação
router.use(authenticateToken);

// GET /api/despesas - Lista despesas do usuário logado
router.get('/', async (req, res) => {
  try {
    const despesas = await prisma.despesa.findMany({
      where: { userId: req.userId },
      orderBy: { data: 'desc' }
    });
    return res.json({ despesas });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
});

// POST /api/despesas - Cria nova despesa
router.post('/', async (req, res) => {
  try {
    const { nome, valor, data, icone, descricao, tipo, categoria } = req.body;
    
    const despesa = await prisma.despesa.create({
      data: {
        nome,
        valor,
        data: new Date(data),
        icone: icone || '💰',
        descricao: descricao || '',
        tipo,
        categoria: categoria || 'Outros',
        userId: req.userId
      }
    });
    
    return res.status(201).json({ despesa });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar despesa' });
  }
});

// PUT /api/despesas/:id - Atualiza despesa
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const despesa = await prisma.despesa.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });

    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    const updated = await prisma.despesa.update({
      where: { id: parseInt(id) },
      data: req.body
    });

    return res.json({ despesa: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
});

// DELETE /api/despesas/:id - Deleta despesa
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const despesa = await prisma.despesa.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });

    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    await prisma.despesa.delete({
      where: { id: parseInt(id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar despesa' });
  }
});

export default router;
```

### 3. **Endpoints de Metas**

```javascript
// src/routers/metas.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../database/index.js';

const router = Router();
router.use(authenticateToken);

// GET /api/metas
router.get('/', async (req, res) => {
  try {
    const metas = await prisma.meta.findMany({
      where: { userId: req.userId },
      orderBy: { prazo: 'asc' }
    });
    return res.json({ metas });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar metas' });
  }
});

// POST /api/metas
router.post('/', async (req, res) => {
  try {
    const { nome, valor, prazo, categoria } = req.body;
    
    const meta = await prisma.meta.create({
      data: {
        nome,
        valor,
        prazo: new Date(prazo),
        categoria,
        valorAtual: 0,
        userId: req.userId
      }
    });
    
    return res.status(201).json({ meta });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar meta' });
  }
});

// POST /api/metas/:id/add-value
router.post('/:id/add-value', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor } = req.body;
    
    const meta = await prisma.meta.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    const updated = await prisma.meta.update({
      where: { id: parseInt(id) },
      data: {
        valorAtual: { increment: valor }
      }
    });

    return res.json({ meta: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar valor' });
  }
});

// DELETE /api/metas/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await prisma.meta.findFirst({
      where: { id: parseInt(id), userId: req.userId }
    });

    if (!meta) {
      return res.status(404).json({ error: 'Meta não encontrada' });
    }

    await prisma.meta.delete({
      where: { id: parseInt(id) }
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar meta' });
  }
});

export default router;
```

### 4. **Endpoints de Renda**

```javascript
// src/routers/user.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { prisma } from '../database/index.js';

const router = Router();
router.use(authenticateToken);

// GET /api/user/renda
router.get('/renda', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { rendaMensal: true }
    });
    
    return res.json({ rendaMensal: user?.rendaMensal || 0 });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar renda' });
  }
});

// PUT /api/user/renda
router.put('/renda', async (req, res) => {
  try {
    const { rendaMensal } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { rendaMensal }
    });
    
    return res.json({ rendaMensal: user.rendaMensal });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar renda' });
  }
});

export default router;
```

### 5. **Atualizar SignIn para retornar JWT**

```javascript
// src/controllers/users.js
import jwt from 'jsonwebtoken';

export const signIn = async (req, res) => {
  // ... código existente de validação ...
  
  try {
    result = await signInDB(email, username, password);
    
    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: result.id, email: result.email },
      process.env.JWT_SECRET || 'seu-secret-aqui',
      { expiresIn: '7d' } // Token expira em 7 dias
    );

    return res.status(200).json({
      token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        username: result.username
      }
    });
  } catch (error) {
    console.error("Erro no signInDB:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
```

### 6. **Registrar Rotas no Router Principal**

```javascript
// src/routers/router.js
import { Router } from 'express';
import { signIn, signUp, updateUser, deleteUser } from '../controllers/users.js';
import despesasRouter from './despesas.js';
import metasRouter from './metas.js';
import userRouter from './user.js';

export const router = Router();

// Rotas públicas
router.post('/signup', signUp);
router.post('/signin', signIn);

// Rotas protegidas
router.use('/api/despesas', despesasRouter);
router.use('/api/metas', metasRouter);
router.use('/api/user', userRouter);

// Rotas de usuário (protegidas)
router.put('/userUpdate/:id', updateUser);
router.delete('/userDelete/:id', deleteUser);
```

## 📝 Variáveis de Ambiente

Adicione no `.env` do backend:

```env
JWT_SECRET=sua-chave-secreta-super-segura-aqui
DATABASE_URL=sua-url-do-postgresql
```

## 🧪 Testando

1. **Teste de Autenticação:**
```bash
# Login
curl -X POST http://localhost:3001/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"senha123"}'

# Use o token retornado nas próximas requisições
```

2. **Teste de Despesas:**
```bash
# Listar despesas
curl http://localhost:3001/api/despesas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Criar despesa
curl -X POST http://localhost:3001/api/despesas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mercado",
    "valor": 150.50,
    "data": "2024-01-15",
    "tipo": "variavel",
    "categoria": "Mercado",
    "descricao": "Compras do mês"
  }'
```

## ⚠️ Observações Importantes

1. **URL da API**: A URL está configurada em `src/config/api.ts`. Atualize se necessário.
2. **Porta**: O app mobile está configurado para usar a porta `3001`. Ajuste se sua API usar outra porta.
3. **Formato de Data**: O backend deve aceitar datas em formato ISO (YYYY-MM-DD) e retornar no mesmo formato.
4. **Valores Monetários**: Use `Decimal` do Prisma para valores monetários para evitar problemas de precisão.
5. **Tratamento de Erros**: Todos os endpoints devem retornar erros no formato `{ error: "mensagem" }` ou `{ message: "mensagem" }`.

## 🎯 Próximos Passos

1. ✅ Implementar middleware de autenticação
2. ✅ Criar endpoints de despesas
3. ✅ Criar endpoints de metas
4. ✅ Criar endpoints de renda
5. ✅ Atualizar signIn para retornar JWT
6. ✅ Testar todas as rotas
7. ✅ Fazer deploy e atualizar URL no app mobile

