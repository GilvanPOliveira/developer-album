# Developer Album

Aplicação web para descoberta de desenvolvedores, vinculação com GitHub e organização de perfis em formato de álbum de figurinhas.

##

## Sobre

Aplicação web focada em perfil profissional, integração com GitHub, visualização de repositórios e coleção de perfis em um álbum interativo.

O projeto foi desenvolvido com foco em experiência visual, organização de estado, integração com API externa e persistência com Supabase.

##

## Objetivo

Consolidar conhecimentos em desenvolvimento moderno, incluindo:

* integração com GitHub API
* autenticação e persistência com Supabase
* gerenciamento de estado com Pinia
* paginação e filtros
* organização de arquitetura frontend
* modelagem de perfis, projetos e álbuns

##

## Funcionalidades

### Perfil do desenvolvedor

* criação e edição do perfil
* controle de visibilidade pública
* vínculo com conta do GitHub
* exibição de informações profissionais
* seleção de stacks principais

###

### Dashboard

* resumo do perfil
* métricas do GitHub
* visualização de repositórios em destaque
* busca e vínculo de conta GitHub no verso do card principal

###

### Exploração

* busca de usuários reais do GitHub
* paginação de resultados
* exibição de nome, bio, empresa, localização e links públicos
* adição de perfis GitHub ao álbum

###

### Projetos

* listagem automática de repositórios do GitHub vinculado
* filtros por nome e linguagem
* ordenação por stars, atualização e nome
* paginação local da listagem

###

### Álbum de figurinhas

* coleção de perfis da plataforma e do GitHub
* cards com frente e verso
* exibição de dados enriquecidos do GitHub
* navegação de repositórios dentro do verso da figurinha
* remoção de itens do álbum

###

### Persistência e modo de execução

* modo `demo`
* modo `supabase`
* armazenamento de perfil, stacks, projetos favoritos e álbum
* sincronização de snapshots do GitHub

##

## Regras de funcionamento

* cada usuário acessa apenas seus próprios dados privados
* o álbum padrão centraliza perfis coletados da plataforma e do GitHub
* perfis GitHub adicionados ao álbum armazenam snapshot para consulta posterior
* repositórios exibidos em projetos dependem de conta GitHub vinculada
* resultados da exploração são paginados
* vínculo de GitHub atualiza o dashboard e as seções dependentes do perfil

##

## Estrutura do Repositório

```text
developer-album/
├─ public/
├─ src/
│  ├─ app/
│  ├─ assets/
│  ├─ components/
│  ├─ composables/
│  ├─ config/
│  ├─ features/
│  ├─ lib/
│  ├─ stores/
│  ├─ types/
│  └─ views/
├─ supabase/
│  └─ migrations/
└─ README.md
```

##

## Como executar

```bash
git clone <url-do-repositorio>
cd developer-album
npm install
```

Crie o `.env`:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
VITE_GITHUB_TOKEN=SEU_TOKEN_GITHUB
VITE_APP_MODE=supabase
```

Se quiser executar sem backend real, use:

```env
VITE_APP_MODE=demo
```

Configure o Supabase:

```bash
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

Execute:

```bash
npm run dev
```

##

## Como testar

1. criar conta ou acessar o modo `demo`
2. preencher o perfil no dashboard
3. vincular uma conta do GitHub
4. validar métricas e repositórios em destaque
5. acessar a página explorar e buscar perfis
6. adicionar perfis GitHub ao álbum
7. abrir o álbum e verificar frente e verso das figurinhas
8. acessar a página de projetos e validar filtros e paginação

##

## Stack

[![My Skills](https://skillicons.dev/icons?i=vue,ts,vite,tailwind,postgres&perline=5)](https://skillicons.dev)

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Pinia
* Vue Router
* Supabase
* PostgreSQL
* GitHub API
* Zod

##

## Contato

* Portfólio: https://gilvanpoliveira.github.io
* Email: [gilvanoliveira06@gmail.com](mailto:gilvanoliveira06@gmail.com)
