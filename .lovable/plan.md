## Problema
Hoje na aba Posts, o `colaborador` (e também o `admin`) só vê os posts criados por ele mesmo, e não tem ação de "Mais ações" (publicar/despublicar/excluir). Isso ocorre por dois motivos:

1. **Frontend (`AdminPosts.tsx`)**: filtra a query por `author_id = user.id` quando não é superadmin, e o menu "Mais ações" (dropdown com publicar/excluir) só aparece para superadmin.
2. **RLS no banco**: políticas permitem que `colaborador` leia/edite apenas os próprios posts (`author_id = auth.uid()`), e só apague rascunhos próprios.

## O que será feito

### 1. Banco de dados (RLS na tabela `posts`)
Adicionar políticas para `colaborador` ter acesso total a posts, equivalente ao admin:
- SELECT: ler todos os posts
- UPDATE: editar qualquer post
- DELETE: excluir qualquer post

(Mantemos as políticas existentes intactas; apenas adicionamos novas para colaborador.)

### 2. Frontend (`src/pages/admin/AdminPosts.tsx`)
- Remover o filtro `eq("author_id", user.id)` — todos os usuários autenticados (superadmin/admin/colaborador) verão todos os posts. RLS continua garantindo a segurança.
- Sempre mostrar a coluna "Autor" (não só para superadmin).
- Sempre mostrar o menu "Mais ações" (publicar/despublicar/excluir) para todos os roles.

## Impacto
- Colaboradores passam a enxergar e gerenciar todos os posts do blog.
- Admin também verá todos (corrige inconsistência atual em que estava filtrado).
- Superadmin continua com acesso total.
